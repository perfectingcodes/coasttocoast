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
