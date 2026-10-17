import { cleanAndTune } from "./site";

/**
 * The launch plan — the version we actually work to.
 *
 * ads-plan.ts is the Arranges Web build sheet transcribed as written. This
 * file is that plan revised for how the account is really starting: Monday
 * 19 October 2026, on $300 in week one rather than $1,500 a month, with the
 * DBA and the licence/insurance upgrade still in flight.
 *
 * Everything here is meant to be read once and then pasted into Google Ads.
 * Where the two files disagree, this one describes what we are doing and the
 * other describes what was specified.
 */

export const launch = {
  startDate: "Monday 19 October 2026",
  startShort: "Mon 19 Oct",
  weekOneBudget: 300,
  /** Why Monday. It is not arbitrary. */
  whyMonday:
    "Never enable a new account on a Friday. The first 48 hours are when a misconfigured match type or a wrong location setting burns the week's budget, and nobody is watching the search terms report on a Saturday.",
  oneLine:
    "Spend week one buying 30-odd clicks from people in Naples, Bonita and Estero whose AC is broken right now, and learn what they actually search before spending anything bigger.",
} as const;

/* ------------------------------------------------------------- strategy */

/**
 * The whole approach in five sentences. If somebody only reads one section,
 * it should be this one.
 */
export const strategy: { point: string; detail: string }[] = [
  {
    point: "One campaign first, not five",
    detail:
      "At $300 a week, splitting across five campaigns gives each one five or six clicks — not enough for any of them to learn anything, and not enough for us to tell a good keyword from a bad one. Week one runs AC Repair and nothing else, plus a couple of dollars a day on Brand because it is cheap and it stops competitors buying our name.",
  },
  {
    point: "Buy the broken, not the browsing",
    detail:
      "Someone searching 'ac not cooling' at 2pm in Naples has a problem today and will call the first credible result. Someone searching 'ac maintenance' is comparing. The first one is worth three times the second and costs about the same, so the first one gets the money until there is data to argue otherwise.",
  },
  {
    point: "Manual control until there is something to automate",
    detail:
      "Smart bidding needs roughly 30 conversions in 30 days to work. We will not have that for weeks. Until then it is Maximize Clicks with a hard CPC cap, which is predictable and cheap to be wrong about.",
  },
  {
    point: "The search terms report is the job",
    detail:
      "In a new account, reading what people actually typed and adding negatives is worth more than any bid change. Twice a week for the first month, twenty minutes each time. That is where most of the waste gets cut.",
  },
  {
    point: "Measure booked jobs, not clicks",
    detail:
      "The GCLID is captured on the website and stored with every lead. Once a job is booked we upload it back to Google, and from then on the account optimizes for work that actually happened rather than for forms that got filled in.",
  },
];

/* ---------------------------------------------------------- the ramp */

export interface BudgetWeek {
  label: string;
  dates: string;
  total: number;
  /** Campaigns live this week, and the daily budget of each. */
  rows: { campaign: string; daily: number; cap: string }[];
  goal: string;
  gate?: string;
}

/**
 * A ladder, not a flat monthly number. Each rung is conditional on the one
 * below it producing something — a week that generates no calls does not
 * earn a bigger budget, it earns a diagnosis.
 */
export const budgetLadder: BudgetWeek[] = [
  {
    label: "Week 1",
    dates: "Oct 19 – Oct 25",
    total: 300,
    rows: [
      { campaign: "Search — AC Repair", daily: 40, cap: "Max CPC $9" },
      { campaign: "Search — Brand", daily: 3, cap: "Max CPC $2" },
    ],
    goal: "Get impressions on the right terms in the right three cities, and collect the first search-terms report. Leads are a bonus this week, not the test.",
  },
  {
    label: "Week 2",
    dates: "Oct 26 – Nov 1",
    total: 300,
    rows: [
      { campaign: "Search — AC Repair", daily: 40, cap: "Max CPC $9" },
      { campaign: "Search — Brand", daily: 3, cap: "Max CPC $2" },
    ],
    goal: "Same budget, a tighter keyword set. Everything the week-one search terms showed as junk is now a negative, so the same money buys better clicks.",
    gate: "Only continue if week one produced at least one genuine enquiry or a clear reason it did not.",
  },
  {
    label: "Weeks 3–4",
    dates: "Nov 2 – Nov 15",
    total: 500,
    rows: [
      { campaign: "Search — AC Repair", daily: 48, cap: "Max CPC $9" },
      { campaign: "Search — $89 Tune-Up", daily: 20, cap: "Max CPC $5" },
      { campaign: "Search — Brand", daily: 3, cap: "Max CPC $2" },
    ],
    goal: "Add the tune-up campaign. Cheaper clicks, lower intent, and it fills quiet days — but it is capped so it can never eat the repair budget.",
    gate: "Needs the $89 landing page live and the booking path tested end to end.",
  },
  {
    label: "Month 2",
    dates: "Nov 16 onward",
    total: 650,
    rows: [
      { campaign: "Search — AC Repair", daily: 55, cap: "Max CPC $9" },
      { campaign: "Search — $89 Tune-Up", daily: 25, cap: "Max CPC $5" },
      { campaign: "Call-Only — Emergency AC", daily: 10, cap: "Max CPC $12" },
      { campaign: "Search — Brand", daily: 3, cap: "Max CPC $2" },
    ],
    goal: "Roughly $2,800 a month — Tier B territory from the build sheet. Call-only comes on once somebody is reliably answering out of hours.",
    gate: "Needs the dedicated tracked phone number live and answered 6am–9pm.",
  },
  {
    label: "Month 3",
    dates: "Mid December",
    total: 800,
    rows: [
      { campaign: "Search — AC Repair", daily: 60, cap: "Maximize Conversions" },
      { campaign: "Search — $89 Tune-Up", daily: 28, cap: "Maximize Conversions" },
      { campaign: "Call-Only — Emergency AC", daily: 14, cap: "Max CPC $12" },
      { campaign: "Search — AC Replacement", daily: 10, cap: "Max CPC $14" },
      { campaign: "Search — Brand", daily: 3, cap: "Manual CPC $2" },
    ],
    goal: "Replacement comes on — the highest ticket in the account and the slowest to convert. Bidding switches to Maximize Conversions if, and only if, there were 30+ conversions in the preceding 30 days.",
    gate: "30 conversions in 30 days. Do not switch early; the learning period will spend the month's budget finding out what it already knew.",
  },
];

/**
 * What $300 actually buys, stated before anyone forms an expectation from it.
 * Every figure is the build sheet's own month-one target applied to the
 * budget we are really starting on.
 */
export const weekOneMath: { line: string; value: string; note: string }[] = [
  { line: "Budget", value: "$300", note: "$43 a day across seven days" },
  { line: "Average CPC, month one", value: "$9.50", note: "Build sheet target for repair terms" },
  { line: "Clicks", value: "≈ 31", note: "$300 ÷ $9.50, minus the few dollars on Brand" },
  { line: "Conversion rate, month one", value: "8%", note: "Build sheet target. New landing pages, no review base yet" },
  { line: "Leads", value: "2 – 3", note: "Calls and form fills combined" },
  { line: "Lead to booked job", value: "50%", note: "The client's number. Speed-to-lead is the lever" },
  { line: "Booked jobs, week one", value: "1 – 2", note: "At an average repair ticket this is roughly break-even" },
];

export const weekOneCaveat =
  "Two leads is a normal week one and it is not a verdict on the account. A new advertiser has no quality score history, so the first fortnight is bought at the worst price it will ever pay. What week one is really for is the search terms report: finding the twenty wasteful queries that get negated before the budget grows.";

/* ------------------------------------------------- what we need from you */

export type AskState = "in-flight" | "waiting" | "done";

export interface ClientAsk {
  what: string;
  state: AskState;
  why: string;
  blocks: string;
  needBy: string;
}

/**
 * The only list the client needs to read. Everything else on this page is
 * ours to do.
 */
export const clientAsks: ClientAsk[] = [
  {
    what: "HVAC DBA filed and confirmed",
    state: "in-flight",
    why: "We need the exact trading name as filed on Sunbiz, spelled the way it will appear on the Google Business Profile, the van and the invoice. Ad copy is written to fit 18 characters or fewer; longer than that and several headlines have to be rewritten.",
    blocks:
      "The Brand campaign, every [Brand] line in the ad copy, and the Business Profile name. Brand is the cheapest, highest-converting campaign in the account and it cannot run without this.",
    needBy: "Before week 1 — or Brand stays paused and we run AC Repair alone.",
  },
  {
    what: "Licence and insurance upgrade completed",
    state: "in-flight",
    why: "We need the licence numbers that will be current on launch day and a certificate of insurance naming the correct entity. If the upgrade changes the licence number, every page of the website and the schema have to change with it — the site currently publishes CMC1251768, CRC1335475 and CCC1336116.",
    blocks:
      "Google Local Services Ads outright. LSA verification is a licence check plus an insurance check, and the Google Guaranteed badge is not issued without both. It also gates the $800/mo LSA line in the original plan.",
    needBy: "Licence numbers before launch. COI whenever LSA is applied for.",
  },
  {
    what: "Dedicated HVAC phone number",
    state: "waiting",
    why: "A tracked number that forwards to the real line, so calls from Ads, from the Business Profile and from LSA can be told apart. Without it every call is attributed to whatever was called last.",
    blocks:
      "Call conversion tracking, the call-only campaign in month 2, and any honest answer to 'where are the calls coming from'.",
    needBy: "Before the call-only campaign in month 2. Useful from day one.",
  },
  {
    what: "Google Business Profile claimed and verified",
    state: "waiting",
    why: "The highest-return asset in local search and the only thing that issues the review link. It also has to be the HVAC profile, not the roofing one.",
    blocks:
      "The local pack, the location asset on every ad, the whole review sequence, and LSA.",
    needBy: "Verification takes days to weeks. Start it now, not when it is needed.",
  },
  {
    what: "Budget confirmed in writing",
    state: "waiting",
    why: "$300 for week one is agreed. We need the same for weeks two to four so the ramp is not renegotiated mid-flight.",
    blocks: "The ramp above. Each rung is already conditional on results; it should not also be conditional on a conversation.",
    needBy: "Before week 2.",
  },
  {
    what: "Maintenance plan pricing",
    state: "waiting",
    why: "The plan page is built with the tiers and what each covers, but no price, because inventing one is worse than omitting it.",
    blocks: "The maintenance-plan landing page converting properly, and the price asset in the ad account.",
    needBy: "Before weeks 3–4, when the tune-up campaign turns on.",
  },
  {
    what: "The standard Clean & Tune price",
    state: "waiting",
    why: `The ${cleanAndTune.price} offer is advertised as a saving. We need the real standard rate it discounts from — the build sheet says $149, the website carries $189, and neither is confirmed as a price the business has actually charged.`,
    blocks:
      "The 'usually $X' anchor on the offer page and in the promotion asset. Advertising a saving against a price you never charged is false advertising, so until it is confirmed no anchor is shown anywhere.",
    needBy: "Before weeks 3–4.",
  },
  {
    what: "Brands actually installed",
    state: "waiting",
    why: "The structured snippet lists Carrier, Trane, Lennox, Rheem, Goodman and Daikin. We will only publish the ones that are true.",
    blocks: "The Brands structured snippet and the brand list on the replacement page.",
    needBy: "Before month 3.",
  },
];

/* ------------------------------------------------- paste into Google Ads */

/**
 * Everything below is formatted for pasting straight into Google Ads.
 *
 * Match types follow Google's own notation, which is what the keyword box
 * accepts: "quoted" is phrase, [bracketed] is exact. Paste a whole block at
 * once — the UI splits it on newlines.
 */

export interface PasteBlock {
  /** Where this goes, in the words Google uses on the screen. */
  where: string;
  title: string;
  note?: string;
  lines: string[];
}

export const keywordBlocks: { campaign: string; groups: PasteBlock[] }[] = [
  {
    campaign: "Search — AC Repair",
    groups: [
      {
        where: "Ad group: AC Repair → Keywords",
        title: "AC Repair",
        note: "The core money terms. Expect the highest CPC in the account here.",
        lines: [
          '"ac repair"',
          "[ac repair naples]",
          "[ac repair bonita springs]",
          "[ac repair estero]",
          '"air conditioning repair"',
          '"air conditioner repair near me"',
          '"ac repair near me"',
          "[hvac repair naples fl]",
          '"ac company near me"',
        ],
      },
      {
        where: "Ad group: AC Not Cooling → Keywords",
        title: "AC Not Cooling",
        note: "Symptom searches. These convert best of anything in the account — somebody describing a symptom has the problem right now.",
        lines: [
          '"ac not cooling"',
          '"air conditioner not cooling"',
          '"ac blowing warm air"',
          '"ac not blowing cold air"',
          '"ac stopped working"',
          '"ac leaking water"',
          '"ac frozen"',
          '"air handler leaking"',
          '"ac making noise"',
        ],
      },
      {
        where: "Ad group: AC Service → Keywords",
        title: "AC Service",
        note: "Ambiguous intent — splits between repair and maintenance. Watch the search terms here first.",
        lines: [
          "[ac service naples]",
          '"air conditioning service near me"',
          '"hvac service near me"',
          '"ac technician near me"',
          '"residential hvac service"',
        ],
      },
    ],
  },
  {
    campaign: "Search — Brand",
    groups: [
      {
        where: "Ad group: Brand → Keywords",
        title: "Brand",
        note: "Replace [Brand] with the DBA once it is filed, and add every plausible misspelling. Until then this campaign stays paused.",
        lines: [
          "[Brand]",
          "[Brand hvac]",
          "[Brand air conditioning]",
          "[Brand naples]",
          "[coast to coast ac naples]",
        ],
      },
    ],
  },
  {
    campaign: "Search — $89 Tune-Up (weeks 3–4)",
    groups: [
      {
        where: "Ad group: AC Tune-Up → Keywords",
        title: "AC Tune-Up",
        lines: [
          '"ac tune up"',
          '"ac tune up near me"',
          "[ac tune up naples]",
          '"ac tune up special"',
          '"air conditioner tune up cost"',
        ],
      },
      {
        where: "Ad group: AC Maintenance → Keywords",
        title: "AC Maintenance",
        note: "Recurring-revenue intent. Routes to the maintenance plan page, not the $89 page.",
        lines: [
          '"ac maintenance"',
          '"ac maintenance near me"',
          '"ac maintenance plan"',
          "[hvac maintenance naples]",
          '"annual ac service"',
        ],
      },
      {
        where: "Ad group: AC Cleaning → Keywords",
        title: "AC Cleaning",
        note: "Watch this one closely — it attracts duct-cleaning intent. The negatives below handle it.",
        lines: ['"ac cleaning service"', '"ac coil cleaning"', '"ac drain line cleaning"'],
      },
      {
        where: "Ad group: AC Inspection → Keywords",
        title: "AC Inspection",
        lines: ['"ac inspection"', '"hvac inspection near me"'],
      },
    ],
  },
  {
    campaign: "Call-Only — Emergency AC (month 2)",
    groups: [
      {
        where: "Ad group: Emergency AC → Keywords",
        title: "Emergency AC",
        note: "Only turn this on once after-hours calls are genuinely answered. A missed emergency call is worse than no ad.",
        lines: [
          '"emergency ac repair"',
          '"emergency air conditioning repair"',
          '"24 hour ac repair"',
          '"same day ac repair"',
          '"ac repair open now"',
          '"24 7 hvac near me"',
        ],
      },
    ],
  },
  {
    campaign: "Search — AC Replacement (month 3)",
    groups: [
      {
        where: "Ad group: AC Replacement → Keywords",
        title: "AC Replacement",
        lines: [
          '"ac replacement"',
          '"ac replacement cost"',
          '"new ac unit cost"',
          "[replace air conditioner naples]",
        ],
      },
      {
        where: "Ad group: AC Installation → Keywords",
        title: "AC Installation",
        lines: [
          '"ac installation"',
          '"ac installation near me"',
          "[new ac install naples]",
          "[hvac installation bonita springs]",
        ],
      },
    ],
  },
];

export const negativeBlocks: PasteBlock[] = [
  {
    where: "Tools → Negative keyword lists → Master — All Campaigns",
    title: "Master list",
    note: "Applies to every campaign. This is the list that stops most of the waste in a new trades account.",
    lines: [
      '"free"', '"cheap"', '"diy"', '"do it yourself"', '"how to"', '"tutorial"',
      '"youtube"', '"reddit"',
      '"jobs"', '"job"', '"hiring"', '"salary"', '"career"', '"apprentice"',
      '"training"', '"school"', '"certification"', '"license"', '"nate exam"',
      '"parts"', '"part"', '"filter"', '"filters"', '"capacitor"',
      '"thermostat wire"', '"manual"', '"schematic"', '"wiring diagram"',
      '"window unit"', '"portable ac"', '"mini split for sale"', '"amazon"',
      '"home depot"', '"lowes"', '"walmart"', '"costco"',
      '"car"', '"auto"', '"automotive"', '"vehicle"', '"truck ac"', '"rv"',
      '"boat"', '"marine"',
      '"commercial"', '"industrial"', '"warehouse"', '"restaurant"',
      '"rooftop unit"', '"rtu"', '"chiller"', '"walk in cooler"',
      '"roofing"', '"roof"', '"roofer"', '"shingle"', '"plumbing"', '"plumber"',
      '"electrician"', '"appliance"', '"refrigerator"', '"washer"', '"dryer"',
      '"pool heater"',
      '"rental"', '"rent"', '"landlord"', '"apartment complex"', '"hoa bid"',
      '"property management"',
      '"reviews of"', '"complaints"', '"lawsuit"', '"bbb"', '"scam"',
    ],
  },
  {
    where: "Tools → Negative keyword lists → Competitor Brands",
    title: "Competitor brands",
    note: "We do not bid on competitor names. Expensive, low conversion, and it invites retaliation in a market this small.",
    lines: [
      '"gulf shore cooling"', '"coastal air conditioning"', '"west coast cooling"',
      '"conditioned air"', '"aztil"', '"one hour air"', '"sun air"',
      '"kool breeze"', '"advanced air"',
    ],
  },
  {
    where: "Tools → Negative keyword lists → Geo Exclusions",
    title: "Geo exclusions",
    note: "Belt and braces on top of presence-only targeting. Remove Fort Myers and Cape Coral when the geo expands in month 4.",
    lines: [
      '"fort myers"', '"cape coral"', '"lehigh acres"', '"port charlotte"',
      '"punta gorda"', '"sarasota"', '"tampa"', '"miami"', '"fort lauderdale"',
      '"sanibel"', '"captiva"', '"immokalee"', '"marco island"',
    ],
  },
  {
    where: "Campaign: Search — $89 Tune-Up → Negative keywords",
    title: "Tune-up campaign only",
    note: "Cross-campaign negatives. These force repair intent into the repair campaign, where the bids and the copy are right for it.",
    lines: [
      '"ac repair"', '"not cooling"', '"broken"', '"emergency"', '"replacement"',
      '"install"',
      '"duct cleaning"', '"air duct cleaning"', '"vent cleaning"', '"dryer vent"',
      '"mold remediation"', '"mold testing"',
    ],
  },
  {
    where: "Campaign: Search — AC Repair → Negative keywords",
    title: "Repair campaign only",
    note: "Keeps maintenance intent in the cheaper campaign.",
    lines: ['"tune up"', '"maintenance plan"', '"annual service"'],
  },
];

export const rsaBlocks: {
  adGroup: string;
  headlines: { text: string; pin?: string }[];
  descriptions: string[];
  finalUrl: string;
  note?: string;
}[] = [
  {
    adGroup: "AC Repair",
    finalUrl: "/ac-repair",
    note: "Pin 'AC Repair in Naples, FL' to position 1. Build two RSAs; pin sparingly beyond that — over-pinning kills Google's own optimization.",
    headlines: [
      { text: "AC Repair in Naples, FL", pin: "Pin 1" },
      { text: "AC Repair Bonita Springs" },
      { text: "Same-Day AC Repair" },
      { text: "AC Not Cooling? We Can Help" },
      { text: "Licensed & Insured HVAC" },
      { text: "Upfront Pricing, No Surprises" },
      { text: "Locally Owned & Operated" },
      { text: "Call Now — Fast Response" },
      { text: "Most Repairs Done Same Day" },
      { text: "Honest AC Diagnostics" },
      { text: "All Makes & Models Serviced" },
      { text: `${cleanAndTune.price} AC Clean & Tune` },
      { text: "Free Replacement Estimates" },
      { text: "FL Lic. CMC1251768", pin: "Pin 3 if CTR is weak" },
      { text: "Serving Naples & Bonita" },
    ],
    descriptions: [
      "AC out? We offer same-day repair in Naples, Bonita Springs & Estero. Call now.",
      "Licensed, insured, locally owned. Upfront pricing before any work begins.",
      "We diagnose fast and fix it right the first time. All makes and models.",
      "Not sure if it needs repair or replacement? We'll tell you honestly. Call today.",
    ],
  },
  {
    adGroup: "AC Not Cooling",
    finalUrl: "/ac-repair",
    note: "Same landing page as AC Repair. The page carries an H2 on the four common causes so the ad and the page use the same words.",
    headlines: [
      { text: "AC Not Blowing Cold Air?", pin: "Pin 1" },
      { text: "AC Blowing Warm Air? Call Us" },
      { text: "Fix Your AC Today" },
      { text: "Same-Day AC Diagnostics" },
      { text: "AC Leaking Water? We Fix It" },
      { text: "Frozen AC Coil Repair" },
      { text: "Naples & Bonita AC Repair" },
      { text: "Upfront Pricing, No Surprises" },
      { text: "Licensed & Insured" },
      { text: "Call Now — Fast Response" },
      { text: "Most Repairs Fixed in 1 Visit" },
      { text: "Locally Owned & Operated" },
    ],
    descriptions: [
      "AC running but not cooling? Usually a capacitor, coil or drain line. We'll find it.",
      "Same-day service in Naples, Bonita Springs & Estero. Upfront pricing, no pressure.",
      "Licensed Florida HVAC contractor. Honest diagnosis before any repair is approved.",
      "Don't wait for it to fail completely in the Florida heat. Call us today.",
    ],
  },
  {
    adGroup: "AC Tune-Up",
    finalUrl: "/ac-tune-up",
    note: "The price is the hook — pin it to position 1.",
    headlines: [
      { text: `${cleanAndTune.price} AC Clean & Tune`, pin: "Pin 1" },
      { text: `10-Point AC Inspection, ${cleanAndTune.price}` },
      { text: "AC Tune-Up in Naples, FL" },
      { text: "AC Tune-Up Bonita Springs" },
      { text: "Beat the Heat — Tune Up Now" },
      { text: "No Upsell. Just Honest Info." },
      { text: "Book Online in 60 Seconds" },
      { text: "Licensed & Insured HVAC" },
      { text: "Avoid a Summer Breakdown" },
      { text: "Locally Owned & Operated" },
      { text: "Ask About Maintenance Plans" },
      { text: "Same-Week Appointments" },
    ],
    descriptions: [
      `${cleanAndTune.price} gets you a full 10-point AC inspection and cleaning. Book online today.`,
      `Most $2,000 breakdowns start as a $150 fix. Catch it early for ${cleanAndTune.price}.`,
      "Coils, drain line, refrigerant, capacitor, airflow and more. Honest report.",
      "If your system is fine, we'll tell you. No pressure, no upsell. Naples & Bonita.",
    ],
  },
  {
    adGroup: "Emergency AC (call-only)",
    finalUrl: "Call only — no landing page",
    note: "Call-only ads take 2 headlines and 2 descriptions. Verify the number routes correctly on a real phone before enabling.",
    headlines: [
      { text: "Emergency AC Repair" },
      { text: "Call Now — AC Repair Today" },
      { text: "Same-Day AC Repair Naples" },
      { text: "24/7 AC Repair Available", pin: "Only if after-hours calls are answered" },
    ],
    descriptions: [
      "AC out in the Florida heat? Call now for same-day emergency repair.",
      "Licensed, insured, locally owned. Naples, Bonita Springs & Estero.",
    ],
  },
  {
    adGroup: "AC Replacement",
    finalUrl: "/ac-replacement",
    note: "Month 3. Pin 'Free Replacement Estimate' to position 1 — it is the lowest-commitment ask on an expensive purchase.",
    headlines: [
      { text: "New AC Installation" },
      { text: "AC Replacement in Naples" },
      { text: "Free Replacement Estimate", pin: "Pin 1" },
      { text: "Financing Available" },
      { text: "Properly Sized for Your Home" },
      { text: "Permits & Removal Included" },
      { text: "Licensed FL HVAC Contractor" },
      { text: "All Major Brands Installed" },
      { text: "Lower Your Energy Bills" },
      { text: "Repair or Replace? We'll Say" },
      { text: "Locally Owned & Operated" },
      { text: "Serving Naples & Bonita" },
    ],
    descriptions: [
      "Free in-home estimate on a new AC system. Financing available. Call today.",
      "We size the system for your home, pull permits and haul away the old unit.",
      "Not sure if it's time? We'll give you an honest repair-vs-replace answer.",
      "Licensed Florida contractor installing all major brands in Naples & Bonita.",
    ],
  },
  {
    adGroup: "Brand",
    finalUrl: "/",
    note: "Paused until the DBA is filed. Headlines are short on purpose — the DBA may be long.",
    headlines: [
      { text: "[Brand]", pin: "Pin 1" },
      { text: "[Brand] AC" },
      { text: "Official Site" },
      { text: "AC Repair & Maintenance" },
      { text: "Naples, Bonita & Estero" },
      { text: `${cleanAndTune.price} AC Clean & Tune` },
      { text: "Call Now to Schedule" },
      { text: "Licensed & Insured" },
    ],
    descriptions: [
      "The official site for [Brand]. AC repair, maintenance and replacement.",
      "Licensed, insured and locally owned. Serving Naples, Bonita Springs & Estero.",
    ],
  },
];

export const assetBlocks: PasteBlock[] = [
  {
    where: "Assets → Sitelinks (account level)",
    title: "Sitelinks",
    note: "Link text, then the destination. Two description lines each, 35 characters max per line.",
    lines: [
      `Book ${cleanAndTune.price} Tune-Up  →  /ac-tune-up`,
      "Emergency AC Repair  →  /ac-repair",
      "Maintenance Plans  →  /maintenance-plans",
      "New AC & Financing  →  /ac-replacement",
    ],
  },
  {
    where: "Assets → Sitelinks → description lines",
    title: "Sitelink descriptions",
    lines: [
      "10-Point AC Inspection",
      "Honest, no-pressure quote",
      "Two seasonal tune-ups",
      "Permits & haul-away incl.",
      "Naples · Bonita · Estero",
    ],
  },
  {
    where: "Assets → Callouts (account level)",
    title: "Callouts",
    note: "25 characters each. Add all eight; Google picks.",
    lines: [
      "Licensed & Insured",
      "Locally Owned",
      "Same-Day Service",
      "Upfront Pricing",
      "Free Estimates",
      "Financing Available",
      "No Overtime Charges",
      "FL Lic. CMC1251768",
    ],
  },
  {
    where: "Assets → Structured snippets",
    title: "Structured snippets",
    note: "Header 'Services' for the first, 'Brands' for the second. Only publish brands actually installed — unconfirmed, so hold the second until the client says.",
    lines: [
      "Services: AC Repair, AC Installation, Maintenance, Duct Repair, Thermostats",
      "Brands: Carrier, Trane, Lennox, Rheem, Goodman, Daikin",
    ],
  },
  {
    where: "Assets → Promotion / Price",
    title: "Promotion and price assets",
    note: "Monetary discount, occasion: none, runs continuously. No 'was' price until the standard rate is confirmed.",
    lines: [
      `Price asset — AC Clean & Tune — ${cleanAndTune.price} — Type: Services — links to /ac-tune-up`,
      `Promotion asset — ${cleanAndTune.price} AC Clean & Tune`,
    ],
  },
  {
    where: "Settings → Tracking → Tracking template",
    title: "UTM tracking template",
    note: "Account level, set once. The website reads every one of these and stores them against the lead.",
    lines: [
      "{lpurl}?utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_term={keyword}&gclid={gclid}",
    ],
  },
];

/* ------------------------------------------------------ build it in order */

/**
 * The account build, in the order the screens appear. Settings in `set` are
 * literally what to type or choose.
 */
export const setupSteps: {
  n: number;
  title: string;
  body: string;
  set?: { field: string; value: string }[];
  warn?: string;
}[] = [
  {
    n: 1,
    title: "Create the account and add billing",
    body: "Skip the 'smart campaign' setup Google pushes on a new account — choose Switch to Expert Mode on the first screen, then Create an account without a campaign.",
    warn: "If you let Google build a Smart Campaign it will spend on Display and on searches outside the service area, and the settings that matter are hidden.",
  },
  {
    n: 2,
    title: "Link GA4, Search Console and the Business Profile",
    body: "Tools → Linked accounts. The Business Profile link is what puts the address and the map pin on the ads, and it has to be the HVAC profile rather than the roofing one.",
  },
  {
    n: 3,
    title: "Build the conversion actions before any campaign",
    body: "Goals → Conversions → New. Build the call and form actions first; the offline import comes later once GCLIDs are flowing. Nothing gets enabled until a live test registers.",
    set: [
      { field: "Call from ads", value: "Phone call lead · One · Primary · 60s threshold" },
      { field: "Call from website", value: "Phone call lead · One · Primary · 60s threshold" },
      { field: "Click-to-call (mobile)", value: "Phone call lead · One · SECONDARY" },
      { field: "Booking form submitted", value: "Submit lead form · One · Primary" },
      { field: "Booked job (offline)", value: "Qualified lead · One · Primary · offline import" },
      { field: "Attribution", value: "Data-driven (leave as default)" },
      { field: "Conversion window", value: "30-day click, 1-day engaged view" },
    ],
    warn: "Launching without this wastes the entire learning period. Submit a real form and place a real 90-second call, and confirm both appear in Ads within 24 hours before you enable anything.",
  },
  {
    n: 4,
    title: "Set the account-level tracking template",
    body: "Settings → Account settings → Tracking template. Paste the template from the assets section below. This is what carries the GCLID onto the landing page, where the site stores it against the lead.",
  },
  {
    n: 5,
    title: "Create the AC Repair campaign",
    body: "New campaign → Leads → Search. Then work down the settings screen and change every one of these from its default.",
    set: [
      { field: "Networks", value: "Search only. UNTICK Search Partners. UNTICK Display Expansion" },
      { field: "Locations", value: "Naples FL, North Naples FL, Bonita Springs FL, Estero FL" },
      { field: "Location options", value: "Presence — people in or regularly in your targeted locations" },
      { field: "Languages", value: "English (add Spanish only if someone can take the call)" },
      { field: "Budget", value: "$40.00 per day" },
      { field: "Bidding", value: "Maximize clicks, with a maximum CPC bid limit of $9.00" },
      { field: "Ad schedule", value: "Monday–Sunday, 6:00 AM – 9:00 PM" },
      { field: "Device bid adj.", value: "Mobile +20%" },
      { field: "Hours bid adj.", value: "11:00 AM – 6:00 PM +15%" },
      { field: "Ad rotation", value: "Optimize: prefer best performing ads" },
    ],
    warn: "Location options is the expensive one. The default is 'presence or interest', which serves to anyone merely researching Naples from anywhere in the world — the build sheet puts the waste at 20–30% of budget.",
  },
  {
    n: 6,
    title: "Add the three ad groups and their keywords",
    body: "AC Repair, AC Not Cooling and AC Service. Paste each keyword block below into its own ad group. No broad match anywhere — broad needs conversion history to behave, and with none it spends the week on irrelevant traffic.",
  },
  {
    n: 7,
    title: "Apply the negative keyword lists",
    body: "Tools → Shared library → Negative keyword lists. Build the three lists, then apply Master and Geo Exclusions to every campaign and Competitor Brands to all search campaigns. Campaign-level negatives go on the campaign itself.",
  },
  {
    n: 8,
    title: "Write two RSAs per ad group",
    body: "Paste the headlines and descriptions below. Aim for Ad Strength 'Good' or better, and pin only where the table says — over-pinning stops Google testing combinations and usually lowers Ad Strength to 'Poor'.",
  },
  {
    n: 9,
    title: "Add the assets",
    body: "Sitelinks, callouts, structured snippets, the call asset and the price asset — all at account level so every campaign inherits them. Check each character count; a rejected asset silently stops showing.",
  },
  {
    n: 10,
    title: "Create the Brand campaign, then pause it",
    body: "Build it now so it is ready, but leave it paused until the DBA is filed. $3/day, manual CPC $2. It will spend less than its cap and convert better than anything else in the account.",
  },
  {
    n: 11,
    title: "Enable on Monday morning",
    body: "Never a Friday. Check the search terms report on day 2, day 4 and day 7 of week one, and add negatives each time.",
    warn: "Brief the office on speed-to-lead before go-live. A lead called back inside five minutes converts several times better than one called back in an hour, and no amount of bid management makes up for that.",
  },
];

/** The ongoing job, so nobody has to guess what 'managing it' means. */
export const cadence: { when: string; task: string }[] = [
  { when: "Day 2, 4 and 7", task: "Search terms report. Add negatives. Twenty minutes each." },
  { when: "Twice weekly, month 1", task: "Search terms, then check spend is pacing to budget." },
  { when: "Weekly", task: "Listen to five recorded calls. How leads are handled decides the cost per booked job more than the ads do." },
  { when: "Weekly", task: "Upload booked jobs against their GCLIDs." },
  { when: "Fortnightly", task: "Pause any keyword with 50+ clicks and no conversions." },
  { when: "Monthly", task: "Report in booked jobs and revenue, never in clicks and impressions." },
];
