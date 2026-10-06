/**
 * Google Ads build sheet — Arranges Web, October 2026.
 *
 * Transcribed from the client's workbook so the dashboard shows the plan that
 * is actually being built rather than the earlier draft in marketing.ts. That
 * draft was written from the site's own content before this sheet existed;
 * where the two disagree, this file wins. The conflicts are listed at the
 * bottom rather than quietly reconciled, because several of them are numbers
 * only the client can settle.
 *
 * Nothing here is our estimate. Every figure is the sheet's.
 */

export const planSource = {
  title: "Google Ads Build Sheet — Residential HVAC",
  author: "Arranges Web",
  dated: "October 2026",
  client: "Coast to Coast (HVAC division)",
  markets: "Naples · Bonita Springs · Estero (plus North Naples)",
  offer: "$89 AC Clean & Tune. Loss leader. The account is optimized for booked tune-ups and repair calls, not clicks.",
  constraint:
    "New advertiser, no conversion history, no Google review base. Phase 1 is manual control; smart bidding only after 30 conversions.",
  gate: "Conversion tracking must be live and tested BEFORE any campaign is enabled. Launching without it wastes the entire learning period.",
} as const;

/* ------------------------------------------------------------- structure */

export interface AdCampaign {
  name: string;
  type: string;
  share: number;
  purpose: string;
  timing: string;
}

export const adCampaigns: AdCampaign[] = [
  {
    name: "Search — AC Repair",
    type: "Search",
    share: 45,
    purpose:
      "Highest-intent demand. Someone whose AC is broken right now. Drives same-day repair calls and the best average ticket at launch.",
    timing: "Day 1",
  },
  {
    name: "Search — $89 Tune-Up",
    type: "Search",
    share: 25,
    purpose:
      "Captures maintenance intent and feeds the $89 offer. Cheaper clicks, lower intent — must be capped so it cannot eat repair budget.",
    timing: "Day 1",
  },
  {
    name: "Call-Only — Emergency AC",
    type: "Call-only",
    share: 15,
    purpose:
      "Mobile-only call ads for emergency intent. HVAC converts better on the phone than on a form. Tight keyword set.",
    timing: "Day 1",
  },
  {
    name: "Search — AC Replacement",
    type: "Search",
    share: 10,
    purpose:
      "High-ticket install intent. Expensive clicks, long consideration — deliberately small until conversion data exists.",
    timing: "Month 3",
  },
  {
    name: "Search — Brand",
    type: "Search",
    share: 5,
    purpose:
      "Defends the new brand name against competitors and the 'Coast to Coast' confusion problem. Very cheap, very high conversion rate.",
    timing: "Day 1",
  },
  {
    name: "Performance Max",
    type: "PMax",
    share: 0,
    purpose:
      "DO NOT launch at this stage. PMax needs conversion volume and a review base. Revisit at 50+ conversions a month.",
    timing: "Hold",
  },
  {
    name: "Display / YouTube",
    type: "Display",
    share: 0,
    purpose: "Hold. No audience data yet and budget is better spent on intent.",
    timing: "Hold",
  },
];

/** Settings that are wrong by default and cost real money if missed. */
export const criticalSettings: { setting: string; value: string; why: string }[] = [
  {
    setting: "Location option",
    value: "Presence only",
    why: "The default is 'presence or interest', which serves to people merely researching the area. The sheet puts the waste at 20–30% of budget. Change it on every campaign.",
  },
  {
    setting: "Networks",
    value: "Search only",
    why: "Search Partners and Display Expansion both dilute a small budget. Off at launch.",
  },
  {
    setting: "Locations",
    value: "Naples, Bonita Springs, Estero, North Naples",
    why: "By city and zip, not radius from the office — the office is in Fort Myers and a radius would bleed budget north into cities that are excluded on purpose.",
  },
  {
    setting: "Ad schedule",
    value: "Mon–Sun, 6am–9pm",
    why: "Do not run ads during hours nobody answers the phone. Match the GBP and LSA hours.",
  },
  {
    setting: "Bid adjustments",
    value: "Mobile +20% · 11am–6pm +15%",
    why: "HVAC search is overwhelmingly mobile and peaks in the heat of the day.",
  },
  {
    setting: "Match types",
    value: "No broad at launch",
    why: "Broad needs conversion data to behave. With none it spends the budget on irrelevant traffic in week one.",
  },
];

/* -------------------------------------------------------------- geo */

export const geoTargets: {
  place: string;
  kind: "City" | "Zip" | "Exclude" | "Optional";
  bid: string;
  note: string;
}[] = [
  {
    place: "Naples",
    kind: "City",
    bid: "+0%",
    note: "Primary market, highest ticket value, and the hardest to rank organically from a Fort Myers address — which is exactly why paid matters here.",
  },
  { place: "Bonita Springs", kind: "City", bid: "+10%", note: "Closest to the business address, so drive times and close rates are best. Bid up." },
  { place: "Estero", kind: "City", bid: "+0%", note: "Smaller volume, good margins, low competition." },
  { place: "North Naples", kind: "City", bid: "+0%", note: "Covered by Naples city targeting; split out as a zip layer if performance diverges." },
  { place: "34102 · 34103 · 34105 · 34108 · 34109 · 34110 · 34119", kind: "Zip", bid: "—", note: "Naples zip layer. Add in month 2 once there is data on which zips convert." },
  { place: "34134 · 34135", kind: "Zip", bid: "—", note: "Bonita Springs zips." },
  { place: "33928 · 33967", kind: "Zip", bid: "—", note: "Estero zips." },
  {
    place: "Fort Myers · Cape Coral",
    kind: "Exclude",
    bid: "EXCLUDE",
    note: "Excluded at launch. Splitting a small budget across six cities is the single fastest way to fail. Revisit month 4 once CPA is stable.",
  },
  { place: "Port Charlotte · Punta Gorda", kind: "Exclude", bid: "EXCLUDE", note: "Too far for same-day residential service economics." },
  { place: "Marco Island", kind: "Optional", bid: "OPTIONAL", note: "Only if the client will drive it. High-value homes, low volume." },
];

/* ----------------------------------------------------------- budget */

export const budgetTiers = [
  { campaign: "Search — AC Repair", a: 675, b: 1125, c: 1800, strategy: "Ph1 Max Clicks, cap $9 · Ph2 Max Conv · Ph3 tCPA $75" },
  { campaign: "Search — $89 Tune-Up", a: 375, b: 625, c: 1000, strategy: "Ph1 Max Clicks, cap $5 · Ph2 Max Conv · Ph3 tCPA $45" },
  { campaign: "Call-Only — Emergency AC", a: 225, b: 375, c: 600, strategy: "Ph1 Max Clicks, cap $12" },
  { campaign: "Search — AC Replacement", a: 150, b: 250, c: 400, strategy: "Month 3. Max Clicks, cap $14" },
  { campaign: "Search — Brand", a: 75, b: 125, c: 200, strategy: "Manual CPC, cap $2" },
];

export const budgetNote =
  "Tier B ($2,500/mo) recommended. At Tier A the account needs roughly 10 weeks to reach the 30 conversions that unlock smart bidding. Below $1,200/mo Google Ads is not the right first channel and LSA should carry the load instead.";

export const biddingPhases = [
  {
    phase: "Phase 1",
    when: "Weeks 1–6",
    what: "Maximize Clicks with a max CPC cap on every campaign. No conversion history exists, so smart bidding has nothing to learn from. Review search terms twice weekly and build negatives aggressively.",
  },
  {
    phase: "Phase 2",
    when: "30+ conversions in 30 days",
    what: "Switch the two main campaigns to Maximize Conversions. Leave Brand manual. Expect 2–3 weeks of unstable CPA during learning — do not touch budgets or bids during it.",
  },
  {
    phase: "Phase 3",
    when: "50+ conversions, stable CPA",
    what: "Target CPA. Introduce broad match on the top five converting keywords only, with the full negative list applied. Consider PMax.",
  },
];

/* --------------------------------------------------------- tracking */

export const conversionActions: {
  action: string;
  primary: boolean;
  note: string;
}[] = [
  { action: "Call from ads (60s+)", primary: true, note: "Call reporting on the call asset. The 60-second threshold filters wrong numbers and hang-ups." },
  { action: "Call from website (60s+)", primary: true, note: "Google forwarding number snippet. Requires the number to be swapped dynamically on the page." },
  { action: "Click-to-call (mobile)", primary: false, note: "Tracks the tap, not the conversation. Secondary so it does not double-count." },
  { action: "Booking form submitted", primary: true, note: "Thank-you URL or a GA4 event imported into Ads." },
  { action: "Online appointment booked", primary: true, note: "Fires only on a confirmed slot — the cleanest signal in the account." },
  { action: "Chat / SMS lead", primary: true, note: "Only if a chat widget is installed." },
  { action: "Booked job (offline)", primary: true, note: "OFFLINE IMPORT. Capture the GCLID on the form, store it against the lead, upload weekly. This is what makes the account optimize for jobs rather than form fills." },
  { action: "Completed job with revenue", primary: true, note: "Offline import with a value. From month 2 once the GCLID pipeline is proven." },
  { action: "$89 page view (15s+)", primary: false, note: "Diagnostic only. Never primary — it would wreck smart bidding." },
];

/* ------------------------------------------------------------- KPIs */

export const kpiTargets: { metric: string; m1: string; m3: string; m6: string; note?: string }[] = [
  { metric: "Impression share", m1: "35%", m3: "55%", m6: "70%", note: "Low at launch is normal — no quality score history." },
  { metric: "Avg CPC — repair", m1: "$9.50", m3: "$7.50", m6: "$6.50" },
  { metric: "Avg CPC — tune-up", m1: "$5.00", m3: "$4.00", m6: "$3.50" },
  { metric: "Click-through rate", m1: "6%", m3: "9%", m6: "11%", note: "Below 5% means the copy or the match type is wrong." },
  { metric: "Conversion rate", m1: "8%", m3: "13%", m6: "16%", note: "Landing page quality drives this more than the ads do." },
  { metric: "Cost per lead", m1: "$95", m3: "$65", m6: "$50" },
  { metric: "Lead → booked job", m1: "50%", m3: "65%", m6: "70%", note: "The client's number, not ours. Speed-to-lead is the lever." },
  { metric: "Cost per booked job", m1: "$190", m3: "$100", m6: "$71", note: "The number that actually matters." },
  { metric: "Booked jobs from Ads", m1: "12", m3: "28", m6: "45", note: "At Tier B." },
  { metric: "Replacements attributed", m1: "0–1", m3: "2", m6: "4", note: "Where the ROI actually lands." },
  { metric: "Ad-attributed revenue", m1: "$4,500", m3: "$12,000", m6: "$22,000", note: "Requires offline import to measure honestly." },
];

export const kpiNote =
  "Report in booked jobs and revenue, never in clicks and impressions. If replacements attributed is still zero past month 3, the problem is the technician's recommend process, not the ads — flag it early.";

/* -------------------------------------------------------- checklist */

export type Owner = "Client" | "Arranges" | "Both";

export interface ChecklistItem {
  group: string;
  task: string;
  owner: Owner;
  /** Our read of where this stands from inside this repo. Anything outside
   *  the repo — an ad account, a phone line — we cannot see and do not claim. */
  state: "done" | "blocked" | "outside";
  note?: string;
}

export const checklist: ChecklistItem[] = [
  { group: "Pre-build", task: "HVAC DBA filed on Sunbiz", owner: "Client", state: "blocked", note: "The whole brand campaign and every [Brand] cell in the ad copy wait on this." },
  { group: "Pre-build", task: "Dedicated HVAC phone number live and answered", owner: "Client", state: "blocked", note: "The site publishes (239) 518-5928 everywhere. If ads need a separate tracked line, the site has to change too." },
  { group: "Pre-build", task: "HVAC Google Business Profile created and verified", owner: "Both", state: "blocked", note: "Also blocks the review link and the whole review sequence." },
  { group: "Pre-build", task: "Landing pages built and live", owner: "Arranges", state: "done", note: "/ac-repair, /ac-tune-up, /maintenance-plans and /ac-replacement are built to tab 10 and live in this build." },
  { group: "Pre-build", task: "Monthly ad budget confirmed in writing", owner: "Client", state: "blocked" },
  { group: "Setup", task: "Google Ads account created, billing added", owner: "Arranges", state: "outside" },
  { group: "Setup", task: "Account linked to GBP, GA4 and Search Console", owner: "Arranges", state: "outside" },
  { group: "Setup", task: "Call tracking number provisioned and forwarding tested", owner: "Arranges", state: "outside" },
  { group: "Setup", task: "All conversion actions built", owner: "Arranges", state: "outside" },
  { group: "Setup", task: "Live test: form submit + 90-second call both recorded in Ads", owner: "Arranges", state: "outside" },
  { group: "Setup", task: "GCLID hidden field on every form, writing to the CRM", owner: "Arranges", state: "done", note: "Captured first-touch on every page, written into every lead, and posted as hidden fields on both forms. It reaches a real CRM the moment VITE_LEADS_ENDPOINT is set — until then it is device-local." },
  { group: "Setup", task: "UTM tracking template set at account level", owner: "Arranges", state: "outside", note: "The site reads and stores the full UTM set already; the template itself is an Ads setting." },
  { group: "Build", task: "Campaigns created with the tab 2 settings", owner: "Arranges", state: "outside" },
  { group: "Build", task: "Location targeting PRESENCE ONLY on every campaign", owner: "Arranges", state: "outside", note: "The single most expensive setting to get wrong." },
  { group: "Build", task: "Ad groups and keywords imported", owner: "Arranges", state: "outside" },
  { group: "Build", task: "Negative keyword lists created and applied", owner: "Arranges", state: "outside" },
  { group: "Build", task: "2 RSAs per ad group, Ad Strength Good or better", owner: "Arranges", state: "outside" },
  { group: "Build", task: "All assets added, character limits verified", owner: "Arranges", state: "outside" },
  { group: "Build", task: "Budgets and bid caps set", owner: "Arranges", state: "outside" },
  { group: "Launch", task: "Campaigns enabled Monday morning — never Friday", owner: "Arranges", state: "outside" },
  { group: "Launch", task: "Client briefed on speed-to-lead (under 5 minutes)", owner: "Arranges", state: "outside" },
];

/* --------------------------------------------------- open questions */

/**
 * Where the sheet and the site disagree, or where the sheet leaves a cell to
 * be filled. None of these are ours to decide.
 */
export const conflicts: { what: string; sheet: string; site: string; cost: string }[] = [
  {
    what: "The anchor price on the $89 offer",
    sheet: "Tab 10 asks for a 'usually $149' anchor on /ac-tune-up.",
    site: "content/site.ts carries regularPrice: $189, which drives a struck-through price and a 'save $100' figure.",
    cost: "Two different anchors for the same offer, neither confirmed as a price the business has ever charged. Advertising a saving against a price you never charged is false advertising. No anchor is rendered on the landing page until one is confirmed.",
  },
  {
    what: "The brand name",
    sheet: "Every ad references [Brand] — an HVAC DBA not yet filed on Sunbiz. Ad copy is written to fit 18 characters or fewer.",
    site: "The site trades as Coast to Coast Air; the legal entity is Coast to Coast Contracting & Roofing LLC.",
    cost: "'Coast to Coast Air' is 18 characters, so it fits — but the Brand campaign cannot be built against a DBA that does not exist, and the sheet flags a 'Coast to Coast' confusion problem with other local firms.",
  },
  {
    what: "The phone number",
    sheet: "A dedicated HVAC tracking number that forwards to the real line, to keep GBP, LSA and Ads attribution separate.",
    site: "(239) 518-5928 is published on all 91 pages and in the schema.",
    cost: "If ads use a different number, call attribution works but the site's number and the ad's number differ — and the schema's number is the one Google trusts for the profile. Decide before launch, not after.",
  },
  {
    what: "Maintenance plan pricing",
    sheet: "Listed as an open item; a price asset reads 'Maintenance Plan — $[X]/yr'.",
    site: "/maintenance-plans is built with the tiers and what each covers, but no price.",
    cost: "A plan page with no price converts worse than one with a price. It is still better than inventing a rate people will hold you to.",
  },
  {
    what: "The brands installed",
    sheet: "A structured snippet lists Carrier, Trane, Lennox, Rheem, Goodman, Daikin — with the instruction 'only list brands actually installed'.",
    site: "No brand list is published anywhere.",
    cost: "The replacement page says 'all major brands' rather than naming six that may not all be accurate. Confirm the real list and both the page and the snippet can be specific.",
  },
  {
    what: "Reviews",
    sheet: "Tab 10 requires three reviews on /ac-repair; a /reviews sitelink reads 'Read real customer reviews'.",
    site: "Three testimonials exist, two of them placeholders, with no verified Google rating and no review count.",
    cost: "The three render on /ac-repair, but two are not real customers and two are from Fort Myers and Cape Coral — cities the ads deliberately exclude. The /reviews sitelink should stay off until the GBP is claimed and there are real reviews to point at.",
  },
  {
    what: "The /service-areas sitelink",
    sheet: "An account-level sitelink pointing at /service-areas.",
    site: "The equivalent page is /locations and it covers all nine cities, including the four the ads exclude.",
    cost: "Either point the sitelink at /locations and accept that it shows excluded cities, or build a paid-geo version. Not built yet — it needs a decision.",
  },
];
