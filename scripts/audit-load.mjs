/**
 * Load audit.
 *
 * Opens each route at several widths, scrolls the whole page so every lazy
 * image is asked for, and reports the three things a visitor experiences as
 * "it didn't load": a request that failed, an image that never decoded, and
 * a console error (which is where a hydration mismatch shows up).
 *
 *   PORT=4178 NODE_ENV=production node server.mjs   # in another terminal
 *   BASE=http://localhost:4178 node scripts/audit-load.mjs
 */
import { chromium } from "playwright";

const BASE = process.env.BASE || "http://localhost:4178";
const WIDTHS = (process.env.WIDTHS || "390,768,1024,1440").split(",").map(Number);
const PATHS = (process.env.PATHS ||
  "/,/services,/services/mechanical,/services/commercial-hvac,/services/cooling,/locations,/locations/naples,/locations/naples/commercial-hvac,/about,/contact,/financing,/links,/commercial-hvac,/service-agreements,/ac-repair").split(",");

const browser = await chromium.launch();
let problems = 0;
for (const width of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 } });
  for (const path of PATHS) {
    const page = await ctx.newPage();
    const failed = [], errors = [];
    page.on("requestfailed", (r) => { if (!r.url().includes("/api/")) failed.push(`${r.failure()?.errorText} ${r.url()}`); });
    // The lead and event API needs the deployment's database. Run locally
    // without one it answers 503, which is not a loading fault of the site.
    const api = (u) => u.includes("/api/");
    page.on("response", (r) => { if (r.status() >= 400 && !api(r.url())) failed.push(`${r.status()} ${r.url()}`); });
    page.on("console", (m) => {
      if (m.type() !== "error") return;
      if (/status of 503/.test(m.text())) return;
      errors.push(m.text().slice(0, 160));
    });
    page.on("pageerror", (e) => errors.push(String(e).slice(0, 160)));
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    await page.addStyleTag({ content: "html{scroll-behavior:auto!important}" });
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
    });
    await page.waitForLoadState("networkidle");
    const broken = await page.evaluate(() =>
      [...document.images]
        // An image hidden at this width is never requested; that is not a failure.
        .filter((i) => i.offsetParent !== null || getComputedStyle(i).position === "fixed")
        .filter((i) => !i.complete || i.naturalWidth === 0)
        .map((i) => i.currentSrc || i.src));
    const bad = failed.length + broken.length + errors.length;
    problems += bad;
    if (bad) {
      console.log(`✗ ${width}px ${path}`);
      for (const f of failed) console.log(`    request: ${f}`);
      for (const b of broken) console.log(`    image:   ${b}`);
      for (const e of errors) console.log(`    console: ${e}`);
    }
    await page.close();
  }
  await ctx.close();
}
await browser.close();
console.log(problems ? `\n${problems} problem(s)` : `\n✓ ${PATHS.length} pages × ${WIDTHS.length} widths: nothing failed to load, no console errors`);
process.exit(problems ? 1 : 0);
