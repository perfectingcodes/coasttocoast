/**
 * Static prerender step, run after the client and SSR Vite builds:
 *   1. Renders every public route to HTML with its own <head> tags.
 *   2. Writes dist/public/<route>/index.html.
 *   3. Emits sitemap.xml, robots.txt and a 404.html fallback.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const publicDir = path.resolve(root, "dist/public");
const serverEntry = path.resolve(root, "dist/server/entry-server.js");

function priorityFor(url) {
  if (url === "/") return "1.0";
  if (url.split("/").length === 4) return "0.7"; // /locations/city/service
  if (url.startsWith("/services/") || url.startsWith("/locations/")) return "0.8";
  return "0.6";
}

async function main() {
  const template = await fs.readFile(
    path.resolve(publicDir, "index.html"),
    "utf-8",
  );
  const { render, routes, siteUrl } = await import(pathToFileURL(serverEntry).href);

  // Override with SITE_URL only for staging/preview deploys.
  const SITE_URL = (process.env.SITE_URL || siteUrl).replace(/\/$/, "");

  for (const url of routes) {
    const { html, head } = render(url);
    const page = template
      // Drop the fallback <title>; the injected head carries the real one.
      .replace(/<title>[\s\S]*?<\/title>\s*/, "")
      .replace("<!--app-head-->", head)
      .replace("<!--app-html-->", html);

    const outPath =
      url === "/"
        ? path.resolve(publicDir, "index.html")
        : path.resolve(publicDir, `.${url}`, "index.html");

    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, page, "utf-8");
    console.log(`  prerendered ${url}`);
  }

  // SPA-style fallback for hosts that serve 404.html on unknown paths.
  const notFound = render("/404");
  await fs.writeFile(
    path.resolve(publicDir, "404.html"),
    template
      .replace(/<title>[\s\S]*?<\/title>\s*/, "")
      .replace("<!--app-head-->", notFound.head)
      .replace("<!--app-html-->", notFound.html),
    "utf-8",
  );

  const today = new Date().toISOString().slice(0, 10);
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (u) => `  <url>
    <loc>${SITE_URL}${u}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u === "/" ? "weekly" : "monthly"}</changefreq>
    <priority>${priorityFor(u)}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;
  await fs.writeFile(path.resolve(publicDir, "sitemap.xml"), sitemap, "utf-8");

  await fs.writeFile(
    path.resolve(publicDir, "robots.txt"),
    `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
    "utf-8",
  );

  console.log(
    `\n✅ Prerendered ${routes.length} pages + 404.html + sitemap.xml + robots.txt`,
  );
}

main().catch((err) => {
  console.error("Prerender failed:", err);
  process.exit(1);
});
