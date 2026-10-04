import { chromium } from "playwright";
import fs from "node:fs";
const OUT = "/private/tmp/claude-501/-Users-sandin-Projects-coasttocoast/42fded79-d9b6-4a98-98f9-4090dc973bf1/scratchpad/pages";
fs.mkdirSync(OUT, { recursive: true });
const PAGES = [
  ["/services", "services"],
  ["/services/cooling", "svc-cooling"],
  ["/services/repairs-maintenance", "svc-offer"],
  ["/services/commercial-hvac", "svc-commercial"],
  ["/locations", "locations"],
  ["/locations/naples", "city-naples"],
  ["/locations/naples/cooling", "citysvc"],
  ["/about", "about"],
  ["/contact", "contact"],
  ["/financing", "financing"],
  ["/privacy", "privacy"],
  ["/nope", "notfound"],
];
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 1000 } })).newPage();
for (const [path, name] of PAGES) {
  await p.goto("http://localhost:5173" + path, { waitUntil: "networkidle" });
  await p.addStyleTag({ content: "*{animation-duration:0s!important;transition-duration:0s!important}html{scroll-behavior:auto!important}" });
  await p.evaluate(async () => { for (let y=0;y<document.body.scrollHeight;y+=400){scrollTo(0,y);await new Promise(r=>setTimeout(r,20));} scrollTo(0,0); });
  await p.waitForTimeout(500);
  const h = await p.evaluate(() => document.body.scrollHeight);
  let i = 0;
  for (let y = 0; y < h; y += 1000) {
    await p.evaluate((yy) => scrollTo(0, yy), y);
    await p.waitForTimeout(140);
    await p.screenshot({ path: `${OUT}/${name}-${String(i).padStart(2,"0")}.png` });
    i++;
  }
  console.log(name, "h=" + h, "shots=" + i);
}
await b.close();
