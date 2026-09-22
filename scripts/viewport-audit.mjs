/**
 * Responsive QA harness.
 *
 * Loads each route at a phone width, settles every scroll-reveal, then reports
 * the three things that actually break a mobile layout — anything sticking out
 * past the viewport, text clipped inside its own box, and tap targets under
 * 34px — and writes a screenshot strip so the result can be looked at rather
 * than assumed.
 *
 *   pnpm dev                                    # in another terminal
 *   pnpm audit:viewport                         # home at 375px
 *   W=360 PATHS=/,/contact pnpm audit:viewport  # other widths and routes
 *
 * Shots land in OUT below. Needs Playwright's chromium:
 *   pnpm exec playwright install chromium
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const OUT = process.env.OUT || "/tmp/viewport-audit";
const BASE = process.env.BASE || "http://localhost:5173";
const WIDTH = Number(process.env.W || 375);
const paths = (process.env.PATHS || "/").split(",");

const AUDIT = () => {
  const vw = document.documentElement.clientWidth;
  const out = { docW: document.documentElement.scrollWidth, vw, over: [], tiny: [], clipped: [] };
  for (const el of document.querySelectorAll("body *")) {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || cs.position === "fixed") continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    const id = el.tagName + "." + String(el.className || "").slice(0, 80);
    if (r.right > vw + 1 || r.left < -1) {
      let clipped = false;
      for (let p = el.parentElement; p; p = p.parentElement) {
        const pc = getComputedStyle(p);
        if (pc.overflow !== "visible" || pc.overflowX !== "visible") { clipped = true; break; }
      }
      if (!clipped) out.over.push({ id, l: Math.round(r.left), r: Math.round(r.right) });
    }
    if (el.children.length === 0 && el.scrollWidth > el.clientWidth + 2 && cs.overflowX === "visible")
      out.clipped.push({ id, sw: el.scrollWidth, cw: el.clientWidth, txt: (el.textContent || "").trim().slice(0, 40) });
    if ((el.tagName === "A" || el.tagName === "BUTTON") && r.height > 0 && r.height < 34)
      out.tiny.push({ h: Math.round(r.height), txt: (el.textContent || "").trim().slice(0, 34) });
  }
  out.over = out.over.slice(0, 12);
  out.clipped = out.clipped.slice(0, 12);
  out.tiny = out.tiny.slice(0, 20);
  return out;
};

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: WIDTH, height: 812 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
const page = await ctx.newPage();

for (const p of paths) {
  await page.goto(BASE + p, { waitUntil: "networkidle" });
  await page.addStyleTag({ content: "*,*::before,*::after{animation-duration:0s!important;animation-delay:0s!important;transition-duration:0s!important} html{scroll-behavior:auto!important}" });
  // Force every scroll-reveal into its settled state.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 30)); }
    window.scrollTo(0, 0);
    await new Promise(r => setTimeout(r, 400));
  });
  await page.waitForTimeout(700);
  const slug = (p === "/" ? "home" : p.replace(/\//g, "_").replace(/^_/, ""));
  const dir = path.join(OUT, `${WIDTH}-${slug}`);
  fs.mkdirSync(dir, { recursive: true });

  const audit = await page.evaluate(AUDIT);
  fs.writeFileSync(path.join(dir, "audit.json"), JSON.stringify(audit, null, 2));

  const height = await page.evaluate(() => document.body.scrollHeight);
  const step = 1400;
  let i = 0;
  for (let y = 0; y < height; y += step) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(250);
    await page.screenshot({ path: path.join(dir, `${String(i).padStart(2, "0")}.png`), scale: "css" });
    i++;
  }
  console.log(`${p}  ${WIDTH}px  h=${height}  shots=${i}  docW=${audit.docW}  over=${audit.over.length} clipped=${audit.clipped.length} tiny=${audit.tiny.length}`);
}

await browser.close();
