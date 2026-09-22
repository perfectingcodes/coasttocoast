/**
 * Marketing plan — first draft.
 *
 * Written from what the site already establishes: six services, eight cities
 * across four counties, the published $89 Clean & Tune, Florida Mechanical
 * Contractor #CMC1251768, and the seasonal demand curve of a Gulf Coast HVAC
 * business. Budgets and targets are marked as proposals, not commitments.
 *
 * ⚠️ Every number below is a starting assumption for the client to confirm or
 * replace. Nothing here is drawn from their actual ad accounts or books.
 */
import { business, cleanAndTune, countyList, locations, services } from "./site";

export type Status = "live" | "ready" | "draft" | "blocked" | "not-connected";
export type Channel = "seo" | "google" | "meta" | "local" | "email" | "reviews";

export const planMeta = {
  version: "Draft 1",
  drafted: "September 2026",
  owner: "Elevate Marketing",
  note: "Drafted from site content. Budgets, targets and account figures need the client's confirmation before anything is committed.",
} as const;

// -------------------------------------------------------------- objectives

export const objectives = [
  {
    title: "Own local search in all eight cities",
    body: `Rank in the Google local pack for "AC repair" and "HVAC" in ${locations.length} cities across ${countyList} counties. The ${locations.length * services.length} service × city pages already exist to support this.`,
    metric: "Local pack presence",
    target: "Top 3 in 5 of 8 cities",
    horizon: "6 months",
    channel: "seo" as Channel,
  },
  {
    title: "Make the Clean & Tune the front door",
    body: `A ${cleanAndTune.price} maintenance visit is a low-friction first purchase that produces a diagnosed system, a documented condition report and a repeat customer. It is the single best-converting offer this business has.`,
    metric: "Clean & Tune bookings",
    target: "60 / month in season",
    horizon: "Ongoing",
    channel: "google" as Channel,
  },
  {
    title: "Build the Google review base",
    body: "The profile is the highest-leverage asset in local search and the site currently publishes no rating because there is nothing verified to publish. Every completed job should end with a review request.",
    metric: "Google reviews",
    target: "100 reviews at 4.7+",
    horizon: "12 months",
    channel: "reviews" as Channel,
  },
  {
    title: "Capture emergency demand",
    body: "24/7 emergency is a genuine differentiator and the highest-intent, highest-margin call type. It should be the headline on paid search between June and September.",
    metric: "Emergency calls",
    target: "Track from call tracking",
    horizon: "Summer peak",
    channel: "google" as Channel,
  },
] as const;

// ---------------------------------------------------------------- channels

export const channels: {
  key: Channel;
  name: string;
  status: Status;
  role: string;
  budget: string;
  owner: string;
  actions: string[];
}[] = [
  {
    key: "seo",
    name: "Organic search & content",
    status: "live",
    role: "The long game, and the only channel that compounds. 70 pages are live and technically clean; the work now is authority and freshness, not more pages.",
    budget: "Time, not spend",
    owner: "Elevate Marketing",
    actions: [
      "Publish one seasonal guide per month (hurricane prep, pre-summer checklist, snowbird shutdown)",
      "Build citations on the trade and local directories that matter in SWFL",
      "Earn links from the chamber, HOA newsletters and supplier pages",
      "Re-audit with pnpm audit:seo after every content change",
    ],
  },
  {
    key: "google",
    name: "Google Ads & Local Services",
    status: "not-connected",
    role: "Buys the bottom of the funnel. Local Services Ads carry the Google Guaranteed badge, which for a licensed contractor is worth more than position on Search.",
    budget: "$2,500 / mo proposed",
    owner: "Client account required",
    actions: [
      "Apply for Local Services Ads and complete licence verification (CMC1251768)",
      "Search campaigns on emergency and repair intent, city-segmented",
      "Separate campaign for the Clean & Tune offer at a lower CPC ceiling",
      "Negative-keyword list for DIY, parts and jobs queries",
    ],
  },
  {
    key: "meta",
    name: "Meta (Facebook & Instagram)",
    status: "not-connected",
    role: "Demand generation and retargeting, not direct response. People do not scroll Instagram looking for an AC contractor — they remember one when the unit dies.",
    budget: "$800 / mo proposed",
    owner: "Client account required",
    actions: [
      "Retarget site visitors who reached a service or city page and did not call",
      "Seasonal awareness: pre-summer tune-up, storm season prep",
      "Lookalike from the maintenance customer list",
      "Run the mascot and van creative — it is distinctive and under-used",
    ],
  },
  {
    key: "local",
    name: "Google Business Profile",
    status: "blocked",
    role: "The single highest-ROI asset in local search. Posts, photos and Q&A all feed the local pack ranking.",
    budget: "Time, not spend",
    owner: "Client",
    actions: [
      "Claim and verify the profile for the Fort Myers address",
      "Set service areas to match the eight cities on the site",
      "Weekly post: offer, job photo or seasonal tip",
      "Answer every Q&A and seed the common ones",
    ],
  },
  {
    key: "email",
    name: "Email & SMS to the maintenance base",
    status: "draft",
    role: "The cheapest revenue in the business. A customer on a maintenance cadence is worth several times a one-off repair call.",
    budget: "Under $100 / mo",
    owner: "Elevate Marketing",
    actions: [
      "Clean & Tune due reminders at 6-month intervals",
      "Pre-season campaign in March and October",
      "Post-visit review request, sent same day",
      "Win-back for customers not seen in 18 months",
    ],
  },
  {
    key: "reviews",
    name: "Reviews & reputation",
    status: "ready",
    role: "Feeds both local ranking and conversion rate. The site is already built to display a rating the moment there is a verified one.",
    budget: "Time, not spend",
    owner: "Client + Elevate",
    actions: [
      "Same-day review request by SMS after every completed job",
      "Respond to every review, positive or not, within 48 hours",
      `Fill rating and count in content/site.ts once verified — stars and schema switch on together`,
    ],
  },
];

// --------------------------------------------------------- seasonal cadence

/** Florida's demand curve is the opposite shape to most of the country. */
export const seasonality = [
  { month: "Jan", demand: 25, focus: "Heating calls, cold snaps" },
  { month: "Feb", demand: 30, focus: "Snowbird season, seasonal homes" },
  { month: "Mar", demand: 55, focus: "Pre-season Clean & Tune push" },
  { month: "Apr", demand: 70, focus: "Cooling season opens" },
  { month: "May", demand: 85, focus: "Replacement quotes peak" },
  { month: "Jun", demand: 100, focus: "Emergency + storm prep" },
  { month: "Jul", demand: 100, focus: "Peak load, emergency first" },
  { month: "Aug", demand: 95, focus: "Peak load, emergency first" },
  { month: "Sep", demand: 80, focus: "Storm season, insurance work" },
  { month: "Oct", demand: 55, focus: "Post-season Clean & Tune push" },
  { month: "Nov", demand: 35, focus: "Seasonal homes reopening" },
  { month: "Dec", demand: 25, focus: "Heating checks, low volume" },
] as const;

// ---------------------------------------------------------------- campaigns

export const campaigns: {
  name: string;
  platform: "Google Ads" | "Google LSA" | "Meta" | "Email" | "Organic";
  status: Status;
  objective: string;
  audience: string;
  budget: string;
  window: string;
  kpi: string;
}[] = [
  {
    name: "Emergency AC — always on",
    platform: "Google Ads",
    status: "not-connected",
    objective: "Capture same-day, high-intent emergency demand",
    audience: `"ac repair near me", "emergency ac", city-segmented across ${locations.length} cities`,
    budget: "$1,200 / mo",
    window: "Year-round, weighted Jun–Sep",
    kpi: "Cost per booked call",
  },
  {
    name: "Local Services Ads — Google Guaranteed",
    platform: "Google LSA",
    status: "blocked",
    objective: "Top-of-page placement with the verified badge",
    audience: `${countyList} counties`,
    budget: "$800 / mo",
    window: "Year-round",
    kpi: "Cost per lead",
  },
  {
    name: `${cleanAndTune.price} Clean & Tune — pre-season`,
    platform: "Google Ads",
    status: "draft",
    objective: "Fill the calendar before the season and diagnose systems early",
    audience: "Homeowners in all eight cities, maintenance intent",
    budget: "$500 / mo",
    window: "March and October",
    kpi: "Bookings, then repair attach rate",
  },
  {
    name: "Storm season readiness",
    platform: "Meta",
    status: "draft",
    objective: "Awareness on elevated pads and hurricane-rated mounts",
    audience: `Canal and coastal ZIPs in ${locations.filter((l) => l.conditions.stormImpact).map((l) => l.city).join(", ")}`,
    budget: "$400 / mo",
    window: "May–September",
    kpi: "Reach, then assisted conversions",
  },
  {
    name: "Site retargeting",
    platform: "Meta",
    status: "not-connected",
    objective: "Recover visitors who read a service or city page and did not call",
    audience: "180-day site visitors, excluding converters",
    budget: "$400 / mo",
    window: "Year-round",
    kpi: "Return visit rate",
  },
  {
    name: "Maintenance due reminders",
    platform: "Email",
    status: "draft",
    objective: "Bring the existing base back on a six-month cadence",
    audience: "Past Clean & Tune customers",
    budget: "Under $100 / mo",
    window: "Rolling",
    kpi: "Rebooking rate",
  },
];

// ------------------------------------------------------------- keyword plan

export const keywordTargets = [
  { term: "ac repair {city}", intent: "Emergency", priority: "P0", page: "/locations/{city}/cooling" },
  { term: "air conditioning repair {city} fl", intent: "Emergency", priority: "P0", page: "/locations/{city}/cooling" },
  { term: "hvac {city} fl", intent: "Research", priority: "P1", page: "/locations/{city}" },
  { term: "ac maintenance {city}", intent: "Offer", priority: "P0", page: "/locations/{city}/repairs-maintenance" },
  { term: "ac tune up cost florida", intent: "Offer", priority: "P1", page: "/services/repairs-maintenance" },
  { term: "ac replacement permit {county}", intent: "Research", priority: "P2", page: "/locations/{city}/mechanical" },
  { term: "commercial hvac {city}", intent: "B2B", priority: "P1", page: "/locations/{city}/commercial-hvac" },
  { term: "indoor air quality {city} fl", intent: "Research", priority: "P2", page: "/locations/{city}/indoor-air-quality" },
  { term: "24 hour ac repair {city}", intent: "Emergency", priority: "P0", page: "/locations/{city}/cooling" },
  { term: "hvac company near me", intent: "Emergency", priority: "P0", page: "Google Business Profile" },
] as const;

// ----------------------------------------------------------------- tracking

export const trackingStack: {
  name: string;
  purpose: string;
  status: Status;
  idLabel: string;
  note: string;
}[] = [
  {
    name: "Google Analytics 4",
    purpose: "Traffic, landing pages, conversion paths",
    status: "not-connected",
    idLabel: "Measurement ID (G-XXXXXXX)",
    note: "Nothing is installed on the site yet. No visitor data is being collected.",
  },
  {
    name: "Google Ads conversion tag",
    purpose: "Attribute calls and form submissions to ad spend",
    status: "not-connected",
    idLabel: "Conversion ID / label",
    note: "Required before any paid search spend, or the budget cannot be judged.",
  },
  {
    name: "Meta Pixel",
    purpose: "Retargeting audiences and conversion attribution",
    status: "not-connected",
    idLabel: "Pixel ID",
    note: "Needed before the retargeting campaign can build an audience.",
  },
  {
    name: "Call tracking",
    purpose: "Attribute phone calls, which are most of this business's leads",
    status: "not-connected",
    idLabel: "Tracking number pool",
    note: `The site publishes ${business.phone} everywhere. Use dynamic number insertion so the real number stays the NAP of record for local SEO.`,
  },
  {
    name: "Google Search Console",
    purpose: "Index coverage, queries, structured-data errors",
    status: "not-connected",
    idLabel: "Verified property",
    note: "Verify and submit the sitemap as soon as the domain is live. This is the first thing to set up.",
  },
  {
    name: "Lead destination",
    purpose: "Where the quote form actually sends",
    status: "blocked",
    idLabel: "VITE_QUOTE_ENDPOINT",
    note: "Unset. The form currently falls back to opening a prefilled email, so leads are not dropped but are not tracked either.",
  },
];

// ----------------------------------------------------------- content plan

export const contentCalendar = [
  { month: "March", piece: "Pre-summer AC checklist for SWFL homeowners", channel: "seo" as Channel, ties: "Clean & Tune pre-season push" },
  { month: "April", piece: "What a $89 Clean & Tune actually covers", channel: "seo" as Channel, ties: "Offer campaign landing support" },
  { month: "May", piece: "When to repair and when to replace in a 10–15 year system", channel: "seo" as Channel, ties: "Replacement quote season" },
  { month: "June", piece: "Hurricane prep for your outdoor condenser", channel: "meta" as Channel, ties: "Storm season readiness" },
  { month: "July", piece: "Why your house feels clammy at 74 degrees", channel: "seo" as Channel, ties: "Indoor air quality page" },
  { month: "August", piece: "What to do when the AC quits at 11pm", channel: "google" as Channel, ties: "Emergency always-on" },
  { month: "September", piece: "Documenting HVAC damage for an insurance claim", channel: "seo" as Channel, ties: "Post-storm work" },
  { month: "October", piece: "Closing up a seasonal home without growing mould", channel: "email" as Channel, ties: "Naples & North Naples snowbirds" },
] as const;
