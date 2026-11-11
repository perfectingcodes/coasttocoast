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
    "77 pages of residential content on a domain with no backlinks, now selling commercial and mechanical work. Those two facts pull in opposite directions and the plan has to hold both: the residential pages are the only thing that ranks, and none of them speak to a facility manager.",
  consequence:
    "So nothing gets deleted. The 54 service-by-city pages keep earning while new commercial pages are built beside them — commercial search volume is a small fraction of residential and would not replace that traffic for years. Organic goes after commercial terms because they are genuinely uncontested, not because they are large.",
  leadLever:
    "Commercial organic converts differently. A homeowner calls from a city page; a property manager reads three pages, checks the licence, and fills in a form a week later. So the commercial pages lead with the free equipment walk rather than a phone number — it is the only ask that is reasonable at that stage.",
};

/* ---------------------------------------------------------- the targets */

export type Intent = "Downtime" | "Contract" | "Project" | "Research" | "Local pack";
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
    term: "commercial hvac {city}",
    intent: "Contract",
    tier: "Quarter",
    page: "/locations/{city}/commercial-hvac",
    why: "The core commercial term and far less contested than its residential equivalent. The 9 city × commercial pages already exist — they need depth and links rather than creation.",
  },
  {
    term: "rooftop unit repair {city}",
    intent: "Downtime",
    tier: "Now",
    page: "/commercial-hvac",
    why: "Almost nobody targets equipment-level terms. A search this specific is a facility person with a problem, and the competition is close to zero.",
  },
  {
    term: "hvac service contract {city}",
    intent: "Contract",
    tier: "Quarter",
    page: "/service-agreements",
    why: "High intent — they have decided they want an agreement and are choosing who with. New page, so it needs a quarter to age.",
  },
  {
    term: "mechanical contractor {city}",
    intent: "Project",
    tier: "Quarter",
    page: "/services/mechanical",
    why: "The licence term. CMC1251768 is published on every page, which is a real differentiator against outfits that only say 'HVAC'.",
  },
  {
    term: "hoa hvac contractor {county}",
    intent: "Contract",
    tier: "Now",
    page: "/service-agreements",
    why: "Genuinely under-served, and the highest-value lane in the account. One HOA portfolio is worth a year of residential work.",
  },
  {
    term: "property management hvac vendor",
    intent: "Contract",
    tier: "Now",
    page: "/service-agreements",
    why: "Thin competition and an exact-fit buyer. Slow to convert and worth more than anything else when it does.",
  },
  {
    term: "make up air unit repair",
    intent: "Downtime",
    tier: "Now",
    page: "/services/mechanical",
    why: "Restaurant-specific mechanical. Low volume, no competition, and it signals we are not a residential outfit in disguise.",
  },
  {
    term: "commercial hvac maintenance cost",
    intent: "Research",
    tier: "Now",
    page: "/service-agreements",
    why: "Question-shaped and nobody answers it honestly. Our answer — it is priced off the asset list — is both true and differentiating.",
  },
  {
    term: "restaurant ac repair {city}",
    intent: "Downtime",
    tier: "Now",
    page: "/commercial-hvac",
    why: "The fastest-closing commercial segment. A closed floor buys today.",
  },
  {
    term: "ac repair {city}",
    intent: "Downtime",
    tier: "Year",
    page: "/locations/{city}/cooling",
    why: "Residential, retained. Still the largest traffic source the domain has and it funds the commercial wait. Not where new effort goes.",
  },
  {
    term: "hvac company near me",
    intent: "Local pack",
    tier: "Year",
    page: "Google Business Profile",
    why: "Won in the map pack, not on the site. The profile needs the commercial categories added once it is verified.",
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
