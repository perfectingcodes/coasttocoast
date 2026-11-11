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
  /**
   * PAUSED as of 2 November 2026.
   *
   * Not abandoned and not behind schedule — held. The two things the account
   * is waiting on are both client-side and both outside our control, and
   * spending into them would waste the learning period rather than shorten
   * it: the DBA that the Brand campaign and half the ad copy are written
   * against, and the Business Profile that supplies the location asset and
   * the review link.
   *
   * The build is done. Campaigns, ad groups, keywords, negatives, RSAs and
   * assets are all specified and ready to paste. Resuming is a Monday
   * morning and an enable, not a rebuild.
   */
  status: "paused" as "paused" | "live" | "scheduled",
  pausedSince: "2 November 2026",
  pausedReason:
    "Holding until the HVAC DBA is filed and the Business Profile is verified. Both are client-side, and enabling without them means paying new-advertiser prices for clicks that land without a map pin, without reviews and without a brand campaign to catch the name.",
  resumeWhen: [
    "The DBA is filed and we have the exact trading name",
    "The Business Profile is verified and has issued the review link",
  ],
  resumeTakes:
    "One morning. Everything is built — resuming is enabling two campaigns and swapping [Brand] for the real name.",
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
    point: "Commercial search volume is a fraction of residential",
    detail:
      "This is the fact the whole plan has to be built around. 'ac repair naples' is searched constantly; 'commercial hvac naples' is searched a handful of times a week. Paid search cannot fill a commercial pipeline on its own and nobody should expect it to — it catches the few people already looking, and the rest of the pipeline comes from outbound and relationships.",
  },
  {
    point: "Buy breakdowns, build relationships",
    detail:
      "A restaurant with a dead rooftop unit searches and buys the same day. A property manager with twelve buildings does not — they sign an agreement after a conversation, a walk and a quote. Paid gets the first kind. The second kind comes from the equipment walk being free and producing a document they do not have.",
  },
  {
    point: "The equipment walk is the offer",
    detail:
      "Residential had the $89 tune-up. The commercial equivalent is a free walk that produces an asset list — every unit, aged, photographed, with filter and belt sizes. Most buildings genuinely do not have this, it costs us two hours, and it is very hard to hand somebody that document and then lose the agreement to a contractor who has not seen their equipment.",
  },
  {
    point: "Fewer clicks, higher value, longer wait",
    detail:
      "Expect a higher cost per click and a far lower volume than the residential plan assumed. Judge it on quotes issued and agreements signed over a quarter, not on leads per week. One portfolio agreement is worth more than a year of tune-ups.",
  },
  {
    point: "Residential pays the bills while this lands",
    detail:
      "Commercial cycles run two to nine months. The 54 residential service-by-city pages stay live and keep earning — they are the only organic asset the domain has. Leading with commercial does not mean switching residential off, and the site is now ordered to reflect exactly that.",
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
    what: "Instagram and Meta Business access",
    state: "waiting",
    why: "Admin access on the Meta Business Suite covering the Instagram account and the Facebook page — partner access, not a shared password, so it survives a staff change.",
    blocks:
      "The Meta Pixel, and therefore retargeting. A retargeting audience needs roughly 30 days of traffic before it is big enough to run: installed 19 October it opens around 18 November, and every day access slips moves that date with it. Also blocks any posting schedule.",
    needBy: "Today. The 30-day clock does not start until the Pixel is in.",
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
    campaign: "Search — Commercial Service",
    groups: [
      {
        where: "Ad group: Commercial HVAC → Keywords",
        title: "Commercial HVAC",
        note: "The core commercial terms. Low volume, high CPC, and worth every cent — one agreement off these pays for the quarter.",
        lines: [
          '"commercial hvac"',
          "[commercial hvac naples]",
          "[commercial hvac fort myers]",
          "[commercial hvac bonita springs]",
          '"commercial air conditioning"',
          '"commercial hvac company near me"',
          '"commercial ac repair near me"',
          '"commercial hvac contractor"',
        ],
      },
      {
        where: "Ad group: Rooftop Units → Keywords",
        title: "Rooftop units",
        note: "Equipment-specific and almost nobody bids on it. A search this precise is a facility person, not a homeowner.",
        lines: [
          '"rooftop unit repair"',
          '"rtu repair"',
          '"rooftop hvac unit service"',
          '"commercial rooftop ac"',
          '"package unit repair"',
          '"rtu replacement cost"',
        ],
      },
      {
        where: "Ad group: Emergency Commercial → Keywords",
        title: "Emergency commercial",
        note: "Downtime searches. The fastest-closing traffic in the account — a restaurant with no cooling buys today.",
        lines: [
          '"emergency commercial hvac"',
          '"commercial ac repair open now"',
          '"24 hour commercial hvac"',
          '"restaurant ac repair"',
          '"walk in cooler not cooling"',
        ],
      },
    ],
  },
  {
    campaign: "Search — Service Agreements",
    groups: [
      {
        where: "Ad group: Service Contracts → Keywords",
        title: "Service agreements",
        note: "Recurring revenue intent. Somebody searching this has already decided they want a contract — they are choosing who with.",
        lines: [
          '"hvac service contract"',
          '"commercial hvac maintenance contract"',
          '"hvac preventive maintenance"',
          '"commercial hvac maintenance"',
          '"hvac service agreement cost"',
          "[commercial hvac maintenance naples]",
        ],
      },
      {
        where: "Ad group: Property & HOA → Keywords",
        title: "Property management and HOA",
        note: "These were negatives on the residential plan. They are targets now.",
        lines: [
          '"hvac for property management"',
          '"hoa hvac contractor"',
          '"multi building hvac service"',
          '"apartment complex hvac maintenance"',
          '"property management hvac vendor"',
          '"assisted living hvac service"',
        ],
      },
    ],
  },
  {
    campaign: "Search — Mechanical Projects",
    groups: [
      {
        where: "Ad group: Mechanical Contracting → Keywords",
        title: "Mechanical contracting",
        note: "Project work. Long cycles, large tickets, and the terms a GC or an estimator uses.",
        lines: [
          '"mechanical contractor"',
          "[mechanical contractor fort myers]",
          "[mechanical contractor naples]",
          '"commercial ductwork installation"',
          '"commercial hvac installation"',
          '"make up air unit"',
          '"commercial exhaust fan repair"',
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
        note: "Replace [Brand] with the DBA once it is filed. Cheapest conversions in the account.",
        lines: [
          "[Brand]",
          "[Brand hvac]",
          "[Brand mechanical]",
          "[Brand commercial hvac]",
          "[coast to coast air naples]",
        ],
      },
    ],
  },
  {
    campaign: "Search — Residential (maintained, not grown)",
    groups: [
      {
        where: "Ad group: AC Repair → Keywords",
        title: "Residential repair",
        note: "Kept on a small budget because it converts and funds the commercial wait. Not where the growth is going.",
        lines: [
          "[ac repair naples]",
          "[ac repair bonita springs]",
          '"ac not cooling"',
          '"ac repair near me"',
        ],
      },
    ],
  },
];

export const negativeBlocks: PasteBlock[] = [
  {
    where: "Tools → Negative keyword lists → Master — All Campaigns",
    title: "Master list",
    note: "The no-budget, job-seeker, parts-shopper and wrong-trade traffic. Unchanged by the repositioning — this is waste in any configuration.",
    lines: [
      '"free"', '"cheap"', '"diy"', '"do it yourself"', '"how to"', '"tutorial"',
      '"youtube"', '"reddit"',
      '"jobs"', '"job"', '"hiring"', '"salary"', '"career"', '"apprentice"',
      '"training"', '"school"', '"certification"', '"nate exam"',
      '"parts"', '"part"', '"capacitor"', '"schematic"', '"wiring diagram"',
      '"window unit"', '"portable ac"', '"mini split for sale"', '"amazon"',
      '"home depot"', '"lowes"', '"walmart"', '"costco"',
      '"car"', '"auto"', '"automotive"', '"vehicle"', '"truck ac"', '"rv"',
      '"boat"', '"marine"',
      '"roofing"', '"roofer"', '"shingle"', '"plumbing"', '"plumber"',
      '"electrician"', '"appliance"', '"refrigerator"', '"washer"', '"dryer"',
      '"pool heater"',
      '"reviews of"', '"complaints"', '"lawsuit"', '"bbb"', '"scam"',
    ],
  },
  {
    where: "Campaign: Commercial / Agreements / Mechanical → Negative keywords",
    title: "Residential exclusions — THE BIG CHANGE",
    note: "The inversion. Every one of these used to be a target and is now excluded from the commercial campaigns, because a homeowner clicking a commercial ad is the most expensive wrong click in the account. Apply to the three commercial campaigns only — NOT to the residential campaign, which still needs them.",
    lines: [
      '"home"', '"house"', '"homeowner"', '"residential"',
      '"my ac"', '"my air conditioner"', '"my house"',
      '"tune up"', '"$89"', '"ac tune up special"',
      '"single family"', '"condo"', '"mobile home"', '"manufactured home"',
      '"window ac"', '"through the wall"',
      '"diy"', '"handyman"',
      '"home warranty"', '"home depot"',
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
    note: "Wider than the residential plan on purpose. A commercial ticket justifies drive time that a $200 residential repair does not, so Fort Myers, Cape Coral and Port Charlotte come back in — only the genuinely out-of-area names stay excluded.",
    lines: [
      '"tampa"', '"miami"', '"fort lauderdale"', '"orlando"', '"jacksonville"',
      '"west palm"', '"boca raton"', '"st petersburg"',
    ],
  },
  {
    where: "Campaign: Residential → Negative keywords",
    title: "Commercial exclusions",
    note: "The mirror image. Keeps commercial intent out of the small residential campaign where the bids and the copy are wrong for it.",
    lines: [
      '"commercial"', '"rooftop"', '"rtu"', '"chiller"', '"walk in cooler"',
      '"restaurant"', '"warehouse"', '"office building"', '"property management"',
      '"hoa"', '"contract"', '"agreement"', '"bid"', '"rfp"',
    ],
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
    adGroup: "Commercial HVAC",
    finalUrl: "/commercial-hvac",
    note: "Pin the city headline to position 1. Every line here is written for somebody who answers to someone else for the downtime — that is the difference from the residential copy.",
    headlines: [
      { text: "Commercial HVAC in Naples", pin: "Pin 1" },
      { text: "Commercial HVAC Fort Myers" },
      { text: "Rooftop Units & Split Systems" },
      { text: "Service Agreements Available" },
      { text: "Response Time In Writing" },
      { text: "Licensed Mechanical Contractor" },
      { text: "Certificates Of Insurance" },
      { text: "After-Hours Service" },
      { text: "Every Unit On Your Site Logged" },
      { text: "One Contractor, One Invoice" },
      { text: "Free Equipment Walk" },
      { text: "FL Lic. CMC1251768", pin: "Pin 3 if CTR is weak" },
    ],
    descriptions: [
      "Commercial HVAC across Southwest Florida. Rooftop units, air handlers, ductwork, controls.",
      "Service agreements with a named response window — not a promise of priority. Call today.",
      "Free equipment walk: every unit listed, aged and photographed. Most buildings do not have this.",
      "Licensed mechanical contractor. COI naming you as additional insured, on request.",
    ],
  },
  {
    adGroup: "Rooftop Units",
    finalUrl: "/commercial-hvac",
    note: "Equipment-specific. Use the same page but let the copy carry the specificity.",
    headlines: [
      { text: "Rooftop Unit Repair", pin: "Pin 1" },
      { text: "RTU Service & Replacement" },
      { text: "Package Unit Specialists" },
      { text: "Belts, Bearings, Economizers" },
      { text: "Same-Week Scheduling" },
      { text: "Licensed & Insured" },
      { text: "After-Hours Available" },
      { text: "All Major Brands Serviced" },
      { text: "Free Equipment Walk" },
      { text: "Serving SWFL Commercial" },
    ],
    descriptions: [
      "Rooftop units fail on belts, bearings, economizers and controls. We service all of it.",
      "Scheduled around your trading hours, with an out-of-hours rate agreed in advance.",
      "Licensed mechanical contractor serving commercial property across Southwest Florida.",
      "Free walk of your equipment — aged, photographed and logged. No obligation.",
    ],
  },
  {
    adGroup: "Emergency Commercial",
    finalUrl: "Call only — no landing page",
    note: "Call-only. Downtime is the fastest-closing intent in the account and it converts on the phone, not on a form.",
    headlines: [
      { text: "Emergency Commercial HVAC" },
      { text: "Call Now — Commercial AC" },
      { text: "24/7 Commercial Response" },
      { text: "Restaurant & Retail HVAC" },
    ],
    descriptions: [
      "Commercial AC down? Call now. A person answers, any hour, and dispatches.",
      "Licensed mechanical contractor. Naples, Fort Myers, Bonita Springs and Estero.",
    ],
  },
  {
    adGroup: "Service Agreements",
    finalUrl: "/service-agreements",
    note: "Recurring revenue. The searcher has already decided they want a contract — this is about who with.",
    headlines: [
      { text: "HVAC Service Agreements", pin: "Pin 1" },
      { text: "Planned Maintenance Contracts" },
      { text: "Response Window In Writing" },
      { text: "No Overtime Charges" },
      { text: "Every Unit Documented" },
      { text: "Multi-Building & Portfolio" },
      { text: "Reporting A Board Can Read" },
      { text: "Licensed Mechanical Contractor" },
      { text: "Free Equipment Walk First" },
      { text: "One Contact, One Invoice" },
    ],
    descriptions: [
      "Visit frequency, scope and response window written into the agreement, not implied.",
      "We start with a free walk: every unit aged, photographed and logged before anything is quoted.",
      "Multi-building and HOA portfolios on one agreement, one contact and one invoice.",
      "Licensed mechanical contractor across Southwest Florida. COI on request.",
    ],
  },
  {
    adGroup: "Property & HOA",
    finalUrl: "/service-agreements",
    headlines: [
      { text: "HVAC For Property Managers", pin: "Pin 1" },
      { text: "HOA HVAC Contractor" },
      { text: "Multi-Building Agreements" },
      { text: "Condition Reports For Boards" },
      { text: "One Invoice, Every Address" },
      { text: "Reserve Study Documentation" },
      { text: "Licensed & Fully Insured" },
      { text: "Free Portfolio Walk" },
    ],
    descriptions: [
      "Several addresses on one agreement, one point of contact, one invoice.",
      "Condition reporting aged and costed — the format a board approves a budget against.",
      "Certificates of insurance naming the association as additional insured.",
      "Start with a free walk of every building. No obligation to sign anything.",
    ],
  },
  {
    adGroup: "Mechanical Contracting",
    finalUrl: "/services/mechanical",
    note: "Project work for GCs and estimators. Long cycle — judge on quotes issued, not on leads.",
    headlines: [
      { text: "Mechanical Contractor SWFL", pin: "Pin 1" },
      { text: "Commercial Ductwork" },
      { text: "Bid-Ready Mechanical Scope" },
      { text: "Permits Pulled & Inspected" },
      { text: "Make-Up Air & Exhaust" },
      { text: "FL Lic. CMC1251768" },
      { text: "Schedules That Hold" },
      { text: "Commercial Installation" },
    ],
    descriptions: [
      "Licensed mechanical contractor. Ductwork, air handlers, make-up air, exhaust, controls.",
      "Bid-ready scope, permits pulled, inspections met and a schedule that holds.",
      "Commercial installation across Southwest Florida. References on request.",
      "Working with GCs on project mechanical. Call to discuss the scope.",
    ],
  },
  {
    adGroup: "Brand",
    finalUrl: "/",
    note: "Paused until the DBA is filed.",
    headlines: [
      { text: "[Brand]", pin: "Pin 1" },
      { text: "[Brand] Mechanical" },
      { text: "Official Site" },
      { text: "Commercial & Mechanical HVAC" },
      { text: "Southwest Florida" },
      { text: "Licensed & Insured" },
      { text: "Call Now" },
    ],
    descriptions: [
      "The official site for [Brand]. Commercial and mechanical HVAC across Southwest Florida.",
      "Licensed mechanical contractor. Service agreements, rooftop units, ductwork and controls.",
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
