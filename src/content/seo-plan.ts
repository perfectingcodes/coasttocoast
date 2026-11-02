import { locations } from "./site";

/**
 * The organic plan, stated plainly.
 *
 * One honest caveat up front, because it changes how the priorities below
 * should be read: we have no keyword volume data. The Ads account has days
 * of history, not months, and nobody has pulled Keyword Planner against a
 * verified account yet. So nothing here claims a monthly search volume.
 *
 * What the priorities are actually built on, which is defensible:
 *   - Intent. What a person typing this is about to do.
 *   - Value. What that job is worth, and whether it recurs.
 *   - Winnability. Whether 77 pages on a new domain can realistically rank
 *     for it inside two quarters.
 *
 * Volumes get added the first week Keyword Planner has data behind it, and
 * the priorities get re-sorted then. Guessing at them now would make this
 * look more rigorous than it is.
 */

export const seoPremise = {
  position:
    "A new domain with 77 clean pages, no backlinks and no reviews. That combination ranks for long-tail city and service terms within a quarter, and for head terms like 'ac repair naples' not for a year or more without links and a review base.",
  consequence:
    "So the organic plan goes after the long tail deliberately — service-by-city pages where the competition is thin — while paid buys the head terms that organic cannot reach yet. Spending effort on 'ac repair' organically in month one is effort spent losing.",
  leadLever:
    "Every organic page carries the same two conversion paths as the paid pages: the phone number in the header and a form. The difference is that organic traffic arrives colder, so the page has to answer the question before it asks for anything.",
};

/* ---------------------------------------------------------- the targets */

export type Intent = "Emergency" | "Offer" | "Research" | "B2B" | "Local pack";
export type Tier = "Now" | "Quarter" | "Year";

export interface Target {
  term: string;
  intent: Intent;
  /** When this is realistically winnable from where the site stands today. */
  tier: Tier;
  page: string;
  /** Why it sits in that tier. No volume claims. */
  why: string;
}

export const targets: Target[] = [
  {
    term: "ac repair {city}",
    intent: "Emergency",
    tier: "Year",
    page: "/locations/{city}/cooling",
    why: "The most valuable term in the category and the most contested. Needs links and a review base. Paid owns this one until then.",
  },
  {
    term: "hvac company near me",
    intent: "Local pack",
    tier: "Year",
    page: "Google Business Profile",
    why: "Not a page at all — this is won in the map pack, which is the Business Profile, proximity and review count. Nothing on the website moves it.",
  },
  {
    term: "ac not cooling {city}",
    intent: "Emergency",
    tier: "Quarter",
    page: "/locations/{city}/cooling",
    why: "Symptom phrasing is longer and thinner on competition than 'ac repair', and it converts as well. The city pages already carry the four common causes.",
  },
  {
    term: "ac tune up {city}",
    intent: "Offer",
    tier: "Quarter",
    page: "/locations/{city}/repairs-maintenance",
    why: "A published price on the page is a genuine differentiator — most competitors say 'call for a quote'. That wins the click even from position four.",
  },
  {
    term: "ac maintenance plan {city}",
    intent: "Offer",
    tier: "Quarter",
    page: "/maintenance-plans",
    why: "Recurring revenue, and the search implies somebody already decided they want one. Blocked on plan pricing being published.",
  },
  {
    term: "ac replacement permit {county}",
    intent: "Research",
    tier: "Now",
    page: "/locations/{city}/mechanical",
    why: "Almost nobody writes this properly. We name the issuing office per city, which is the answer to the question, so it is winnable now.",
  },
  {
    term: "hvac {city} fl",
    intent: "Research",
    tier: "Quarter",
    page: "/locations/{city}",
    why: "Broad and mid-intent. The city pages are built for exactly this and already rank-ready.",
  },
  {
    term: "ac drain line clogged {city}",
    intent: "Emergency",
    tier: "Now",
    page: "/locations/{city}/cooling",
    why: "The single most common Florida call, and barely anybody targets it. Thin competition, real intent, cheap job that opens a relationship.",
  },
  {
    term: "how often service ac florida",
    intent: "Research",
    tier: "Now",
    page: "/services/repairs-maintenance",
    why: "Question-shaped, which is what answer engines quote. Our pages already answer it with a reason specific to this climate.",
  },
  {
    term: "salt air ac corrosion {city}",
    intent: "Research",
    tier: "Now",
    page: "/locations/{city}",
    why: "Coastal-specific and genuinely under-served. Every city page carries its own salt exposure, which almost no competitor does.",
  },
  {
    term: "commercial hvac {city}",
    intent: "B2B",
    tier: "Quarter",
    page: "/locations/{city}/commercial-hvac",
    why: "Fewer searches, far higher value, and long sales cycles. Worth holding a page for even at low volume.",
  },
  {
    term: "indoor air quality {city} fl",
    intent: "Research",
    tier: "Quarter",
    page: "/locations/{city}/indoor-air-quality",
    why: "Humidity and post-storm duct concerns make this more live here than in most markets.",
  },
];

/* ------------------------------------------------------------------ GEO */

/**
 * Generative engine optimisation — being the source an answer engine quotes
 * rather than the tenth blue link.
 *
 * This matters more for a local trade than most people assume. "Who should I
 * call for AC repair in Naples" is now asked of an assistant as often as of
 * a search box, and assistants quote whoever stated the fact cleanly and
 * attributably.
 */
export const geoWork: { item: string; state: "done" | "next"; detail: string }[] = [
  {
    item: "One linked JSON-LD @graph per page",
    state: "done",
    detail:
      "Not separate blocks. A single connected graph is what lets a parser follow business → service → area → offer without guessing.",
  },
  {
    item: "A self-contained answer at the top of every substantial page",
    state: "done",
    detail:
      "Marked with [data-answer] and pointed at by speakable. It is written to be liftable — a complete answer in two sentences that makes sense with no surrounding page.",
  },
  {
    item: "llms.txt generated at build time",
    state: "done",
    detail:
      "Facts, licences, services, every city with its permit office and ZIPs, and an explicit note that the site publishes no aggregate rating so none should be inferred.",
  },
  {
    item: "Named crawlers allowed explicitly",
    state: "done",
    detail:
      "GPTBot, ClaudeBot, PerplexityBot, Google-Extended and the rest are named in robots.txt rather than left to the wildcard.",
  },
  {
    item: "Local facts as real tables, not styled divs",
    state: "done",
    detail:
      "ZIPs, permit authority, coastal exposure and response times are in a <table> with proper row headers. Parsers read tables; they guess at divs.",
  },
  {
    item: "parentOrganization declared to the contracting brand",
    state: "done",
    detail:
      "Two sites share a NAP and a licence. Declared, that reads as two divisions. Undeclared, it reads as a doorway attempt.",
  },
  {
    item: "Question-shaped headings on the service pages",
    state: "next",
    detail:
      "The FAQs are question-shaped; the body headings mostly are not. Assistants quote a heading that matches the question asked.",
  },
  {
    item: "A dated 'last reviewed' signal on the city pages",
    state: "next",
    detail:
      "Permit offices and ZIP coverage change. A visible review date is both a trust signal and something an assistant can cite as current.",
  },
  {
    item: "Real reviews with attributable text",
    state: "next",
    detail:
      "The strongest GEO asset this business does not yet have. Blocked on the Business Profile, same as everything else in that column.",
  },
];

/* ------------------------------------------------------- what moves leads */

/**
 * Ordered by effect on booked jobs, not by effort. The first two are worth
 * more than everything below them combined.
 */
export const leadLevers: { lever: string; effect: string; owner: string }[] = [
  {
    lever: "Google Business Profile, claimed and verified",
    effect:
      "The map pack is where 'near me' is won, and it is the single largest source of calls for a local trade. The website cannot substitute for it.",
    owner: "Client",
  },
  {
    lever: "Reviews, in volume and recent",
    effect:
      "Moves both the map pack ranking and the click-through rate of everything else. Twenty recent reviews changes the economics of every channel on this list.",
    owner: "Both — the sequence is built and waits on the link",
  },
  {
    lever: "Speed to lead, under five minutes",
    effect:
      "Converts several times better than an hour. It costs nothing and it is entirely inside the client's control.",
    owner: "Client",
  },
  {
    lever: `Service-by-city pages for the long tail (${locations.length} cities × 6 services)`,
    effect:
      "Already built and live. The work now is links and freshness, not more pages — 54 more pages would dilute, not add.",
    owner: "Elevate",
  },
  {
    lever: "One seasonal guide a month",
    effect:
      "Hurricane prep, pre-summer checklist, snowbird shutdown. Earns the links that the head terms need, and feeds the social calendar at the same time.",
    owner: "Elevate",
  },
  {
    lever: "Local citations with a consistent NAP",
    effect:
      "Name, address and phone identical everywhere. Cheap, dull, and it is the floor the map pack is built on — inconsistency actively suppresses it.",
    owner: "Elevate",
  },
];

/* ------------------------------------------------------------- stages */

/**
 * The organic programme as stages rather than a task list.
 *
 * A checklist of forty items tells you nothing about whether you are
 * winning. Five stages, each either finished or visibly part-done, tells you
 * where the work actually is — and makes it obvious that the two unfinished
 * ones are unfinished for reasons that are not ours.
 */
export interface StageItem {
  task: string;
  done: boolean;
  note?: string;
}

export interface Stage {
  n: number;
  name: string;
  premise: string;
  items: StageItem[];
}

export const stages: Stage[] = [
  {
    n: 1,
    name: "Technical foundations",
    premise:
      "The things that have to be right before anything else counts. Finished, and they stay finished.",
    items: [
      { task: "94 pages prerendered as static HTML, no client-side rendering for content", done: true },
      { task: "Canonical on every page, pointing at the live domain", done: true, note: "Corrected to coast2coastair.com" },
      { task: "sitemap.xml generated at build, admin and paid pages excluded", done: true },
      { task: "robots.txt naming every crawler explicitly, /admin disallowed", done: true },
      { task: "Titles and descriptions inside the truncation limits, audited on every build", done: true },
      { task: "No duplicate titles or descriptions across 94 pages", done: true },
      { task: "Content-similarity audit in the build — service×city at 26% mean", done: true },
      { task: "Sitemap submitted and the property verified in Search Console", done: true },
    ],
  },
  {
    n: 2,
    name: "On-page and structure",
    premise:
      "One page per thing somebody actually searches for, each answering before it asks.",
    items: [
      { task: "9 city pages, each with its own permit office, ZIPs and coastal exposure", done: true },
      { task: "6 service pages", done: true },
      { task: "54 service × city pages for the long tail", done: true },
      { task: "A self-contained answer block at the top of every substantial page", done: true },
      { task: "Local facts as real tables with row headers, not styled divs", done: true },
      { task: "FAQ blocks on every service, city and service × city page", done: true },
      { task: "Internal linking between city, service and city × service", done: true },
      { task: "Question-shaped body headings on the service pages", done: false, note: "FAQs are question-shaped; body headings mostly are not. Assistants quote the heading that matches the question." },
    ],
  },
  {
    n: 3,
    name: "Entity and answer engines",
    premise:
      "Being the source that gets quoted rather than the tenth blue link. For a local trade this is no longer a side bet.",
    items: [
      { task: "One linked JSON-LD @graph per page, not separate blocks", done: true },
      { task: "HVACBusiness with geo, service radius and every city geocoded", done: true },
      { task: "hasCredential for all three DBPR licences", done: true },
      { task: "hasOfferCatalog across all six services", done: true },
      { task: "speakable pointed at h1 and the answer block", done: true },
      { task: "llms.txt generated at build from the content file", done: true },
      { task: "parentOrganization declared to the contracting brand", done: true, note: "Two sites sharing a NAP read as two divisions when declared, and as a doorway attempt when not" },
      { task: "aggregateRating — deliberately absent until there are real reviews", done: true, note: "Emitting a fabricated rating is a policy violation and a manual-action risk" },
      { task: "A dated 'last reviewed' signal on the city pages", done: false, note: "Permit offices and ZIP coverage change; a visible date is both trust and citability" },
    ],
  },
  {
    n: 4,
    name: "Local pack",
    premise:
      "Where 'near me' is actually won. The website cannot substitute for any of it.",
    items: [
      { task: "A consistent NAP published identically across all 94 pages and the schema", done: true },
      { task: "Service area modelled as GeoCircle plus every city as a named place", done: true },
      { task: "Business Profile claimed and verified", done: false, note: "Postcard verification in flight. Gates everything else in this stage." },
      { task: "Profile categories, services and hours matched to the site", done: false, note: "Cannot be done before verification" },
      { task: "Local citations with the NAP identical everywhere", done: false, note: "Starts once the profile is verified so the citations match it" },
    ],
  },
  {
    n: 5,
    name: "Authority and freshness",
    premise:
      "What eventually wins the head terms. Slowest to move, and the only thing that does.",
    items: [
      { task: "Review request sequence built, four steps, with the compliance rules", done: true },
      { task: "Review link captured and wired through every template", done: true, note: "Paste the link once and the whole sequence fills in" },
      { task: "Reviews coming in at volume", done: false, note: "Blocked on the profile, same as stage 4" },
      { task: "One seasonal guide a month", done: false, note: "Hurricane prep, pre-summer checklist, snowbird shutdown. Earns links and feeds the social calendar at the same time." },
      { task: "Backlinks from local sources", done: false, note: "Supplier pages, chamber listings, the contracting site. Not started." },
    ],
  },
];
