import { chromium } from "playwright";
const OUT = "/private/tmp/claude-501/-Users-sandin-Projects-coasttocoast/42fded79-d9b6-4a98-98f9-4090dc973bf1/scratchpad/pages";
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 1000 } })).newPage();
await p.goto("http://localhost:5173" + process.env.P, { waitUntil: "networkidle" });
await p.addStyleTag({ content: "*{animation-duration:0s!important;transition-duration:0s!important}html{scroll-behavior:auto!important}" });
await p.evaluate(async () => { for (let y=0;y<document.body.scrollHeight;y+=400){scrollTo(0,y);await new Promise(r=>setTimeout(r,20));} scrollTo(0,0); });
await p.waitForTimeout(500);
const h = await p.evaluate(() => document.body.scrollHeight);
let i = 0;
for (let y = 0; y < h; y += 1000) { await p.evaluate((yy)=>scrollTo(0,yy), y); await p.waitForTimeout(140); await p.screenshot({ path: `${OUT}/${process.env.NAME}-${String(i).padStart(2,"0")}.png` }); i++; }
console.log(process.env.NAME, "h=" + h, "shots=" + i);
await b.close();
