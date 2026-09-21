/**
 * Post-build SEO/GEO audit.
 *
 * Checks the built output in dist/public for the failure modes that actually
 * cost rankings: truncated or duplicated titles and descriptions, missing or
 * multiple H1s, missing canonicals, malformed or unlinked JSON-LD, and
 * near-duplicate body copy across the generated page sets.
 *
 *   pnpm build && node scripts/audit-seo.mjs
 *
 * Exits non-zero if any hard check fails, so it can gate a deploy.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.resolve(root, "dist/public");

const TITLE_MAX = 62;
const DESC_MIN = 70;
const DESC_MAX = 158;
const SIMILARITY_MAX = 0.6;

const problems = [];
const notes = [];

function decode(s) {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

async function walk(dir) {
  const out = [];
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(full)));
    else if (e.name.endsWith(".html")) out.push(full);
  }
  return out;
}

const grab = (html, re) => {
  const m = html.match(re);
  return m ? decode(m[1]).trim() : null;
};

function mainText(html) {
  const m = html.match(/<main[^>]*>([\s\S]*?)<\/main>/);
  const body = m ? m[1] : html;
  return decode(
    body.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

function shingles(text, n = 8) {
  const w = text.split(" ");
  const s = new Set();
  for (let i = 0; i + n <= w.length; i++) s.add(w.slice(i, i + n).join(" "));
  return s;
}

function jaccard(a, b) {
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  const union = a.size + b.size - inter;
  return union ? inter / union : 0;
}

function similarityReport(label, pages) {
  if (pages.length < 2) return;
  const sh = pages.map((p) => shingles(p.text));
  let worst = 0;
  let over = 0;
  let total = 0;
  let sum = 0;
  for (let i = 0; i < sh.length; i++) {
    for (let j = i + 1; j < sh.length; j++) {
      const s = jaccard(sh[i], sh[j]);
      sum += s;
      total++;
      if (s > worst) worst = s;
      if (s > SIMILARITY_MAX) over++;
    }
  }
  const words = pages
    .map((p) => p.text.split(" ").length)
    .sort((a, b) => a - b);
  notes.push(
    `  ${label.padEnd(22)} ${String(pages.length).padStart(3)} pages | ` +
      `mean ${(sum / total * 100).toFixed(1).padStart(5)}% | ` +
      `max ${(worst * 100).toFixed(1).padStart(5)}% | ` +
      `median ${String(words[words.length >> 1]).padStart(4)} words`,
  );
  if (over > 0) {
    problems.push(
      `${label}: ${over} page pair(s) exceed ${SIMILARITY_MAX * 100}% similarity`,
    );
  }
}

async function main() {
  const files = await walk(dist);
  const titles = new Map();
  const descs = new Map();
  const sets = { "service x city": [], city: [], service: [], other: [] };

  for (const file of files) {
    const rel = path.relative(dist, file);
    const html = await fs.readFile(file, "utf-8");
    const isLegal = /^(404\.html|privacy|terms)/.test(rel);

    const title = grab(html, /<title>([\s\S]*?)<\/title>/);
    const desc = grab(html, /<meta name="description" content="([\s\S]*?)"/);
    const canonical = /<link rel="canonical"/.test(html);
    const h1 = html.match(/<h1[^>]*>/g) || [];

    if (!title) problems.push(`${rel}: missing <title>`);
    else if (title.length > TITLE_MAX)
      problems.push(`${rel}: title ${title.length} chars (max ${TITLE_MAX})`);

    if (!desc) problems.push(`${rel}: missing description`);
    else if (desc.length < DESC_MIN)
      problems.push(`${rel}: description only ${desc.length} chars`);
    else if (desc.length > DESC_MAX)
      problems.push(`${rel}: description ${desc.length} chars (max ${DESC_MAX})`);

    if (!canonical && !isLegal) problems.push(`${rel}: missing canonical`);
    if (h1.length !== 1) problems.push(`${rel}: ${h1.length} <h1> elements`);

    if (title) titles.set(title, [...(titles.get(title) || []), rel]);
    if (desc && !isLegal) descs.set(desc, [...(descs.get(desc) || []), rel]);

    // JSON-LD: must parse, and internal @id references must resolve.
    const blocks = [
      ...html.matchAll(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
      ),
    ];
    if (!isLegal && blocks.length === 0) {
      problems.push(`${rel}: no JSON-LD`);
    } else if (blocks.length > 1) {
      problems.push(`${rel}: ${blocks.length} JSON-LD blocks (expected 1 @graph)`);
    }
    for (const b of blocks) {
      let parsed;
      try {
        parsed = JSON.parse(decode(b[1]));
      } catch (err) {
        problems.push(`${rel}: JSON-LD does not parse — ${err.message}`);
        continue;
      }
      const nodes = parsed["@graph"] || [parsed];
      const ids = new Set(nodes.map((n) => n["@id"]).filter(Boolean));
      const refs = [...JSON.stringify(nodes).matchAll(/"@id":"([^"]+)"/g)].map(
        (m) => m[1],
      );
      for (const r of refs) {
        if (r.startsWith("http") && !ids.has(r)) {
          problems.push(`${rel}: dangling @id reference ${r}`);
        }
      }
    }

    if (rel.endsWith("index.html")) {
      // locations/<city>/<service>/index.html -> 4 segments
      // locations/<city>/index.html            -> 3
      // services/<slug>/index.html             -> 3
      const depth = rel.split("/").length;
      const page = { rel, text: mainText(html) };
      if (rel.startsWith("locations/") && depth === 4) sets["service x city"].push(page);
      else if (rel.startsWith("locations/") && depth === 3) sets.city.push(page);
      else if (rel.startsWith("services/") && depth === 3) sets.service.push(page);
      else sets.other.push(page);
    }
  }

  for (const [t, where] of titles) {
    if (where.length > 1)
      problems.push(`duplicate title "${t}" on ${where.join(", ")}`);
  }
  for (const [, where] of descs) {
    if (where.length > 1) problems.push(`duplicate description on ${where.join(", ")}`);
  }

  notes.push("\nContent similarity (main content, nav/footer stripped):");
  similarityReport("service x city", sets["service x city"]);
  similarityReport("city", sets.city);
  similarityReport("service", sets.service);

  console.log(`Audited ${files.length} pages in dist/public`);
  console.log(notes.join("\n"));

  if (problems.length) {
    console.error(`\n✗ ${problems.length} problem(s):\n`);
    for (const p of problems.slice(0, 40)) console.error(`  - ${p}`);
    if (problems.length > 40) console.error(`  … and ${problems.length - 40} more`);
    process.exit(1);
  }
  console.log("\n✓ No SEO problems found.");
}

main().catch((err) => {
  console.error("Audit failed:", err);
  process.exit(1);
});
