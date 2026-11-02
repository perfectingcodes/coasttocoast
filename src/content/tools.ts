/**
 * The stack, and where each piece of it stands.
 *
 * Two kinds of status live here and they are kept apart deliberately:
 *
 *   DETECTED — the build or the running page can tell. Whether an
 *   environment variable is set, whether a script actually loaded. These
 *   cannot be wrong, and they cannot be marked done by wishful thinking.
 *
 *   DECLARED — nothing in this codebase can see it. Whether somebody has
 *   verified a Business Profile or provisioned a tracking number is a fact
 *   about the outside world, so it is recorded by hand and shown as
 *   recorded rather than as proven.
 *
 * The distinction matters. A dashboard that shows a green tick for GA4 when
 * no measurement ID is set is worse than one showing nothing, because it
 * stops anybody checking and the data is gone for good.
 */

export type ToolGroup = "measurement" | "advertising" | "presence" | "leads";

export const TOOL_GROUPS: Record<ToolGroup, string> = {
  measurement: "Measurement",
  advertising: "Advertising",
  presence: "Presence",
  leads: "Leads",
};

export type Detect =
  | "ga4"
  | "pixel"
  | "leads-endpoint"
  | "quote-endpoint"
  | "site"
  | null;

export interface Tool {
  key: string;
  name: string;
  group: ToolGroup;
  what: string;
  /** How the dashboard knows. null means it is a declared status only. */
  detect: Detect;
  /** The recorded state for declared tools. Ignored when `detect` is set. */
  declared?: "connected" | "in-progress" | "blocked";
  /** Shown under a declared status so nobody mistakes it for a live check. */
  declaredNote?: string;
  /** What this unlocks, or what is stuck behind it. */
  consequence?: string;
}

export const tools: Tool[] = [
  /* ------------------------------------------------------ measurement */
  {
    key: "ga4",
    name: "Google Analytics 4",
    group: "measurement",
    what: "Sessions, pages, and where traffic comes from, across every visitor rather than one browser.",
    detect: "ga4",
    consequence:
      "Without it the dashboard can only report what happens in the browser it is open in.",
  },
  {
    key: "pixel",
    name: "Meta Pixel",
    group: "measurement",
    what: "Builds the retargeting audience and measures what Instagram and Facebook send.",
    detect: "pixel",
    consequence:
      "A retargeting audience needs about 30 days of traffic before it is big enough to run. The clock starts the day the Pixel is live.",
  },
  {
    key: "search-console",
    name: "Google Search Console",
    group: "measurement",
    what: "What the site ranks for, what gets clicked, and anything Google cannot index.",
    detect: null,
    declared: "connected",
    declaredNote: "Property verified and sitemap submitted on publish day.",
  },
  {
    key: "crm",
    name: "Site tracking & CRM feed",
    group: "measurement",
    what: "Page views, phone taps, quote opens and submissions, with the GCLID attached to every lead.",
    detect: "leads-endpoint",
    consequence:
      "With no endpoint set this is device-local: a visitor's activity stays in their browser and never reaches the office.",
  },

  /* ------------------------------------------------------ advertising */
  {
    key: "google-ads",
    name: "Google Ads",
    group: "advertising",
    what: "The search account. Campaigns, keywords, negatives, RSAs and assets are built.",
    detect: null,
    declared: "in-progress",
    declaredNote:
      "Account created and the build is complete. Campaigns are paused pending the DBA and the Business Profile.",
    consequence: "Paused by choice, not blocked by setup.",
  },
  {
    key: "meta-business",
    name: "Meta Business Suite",
    group: "advertising",
    what: "Admin access covering the Instagram account and the Facebook page.",
    detect: null,
    declared: "connected",
    declaredNote: "Partner access granted, so it survives a staff change.",
  },
  {
    key: "lsa",
    name: "Local Services Ads",
    group: "advertising",
    what: "Google Guaranteed placement above the paid results.",
    detect: null,
    declared: "blocked",
    declaredNote:
      "Verification is a licence check plus an insurance check. Waiting on the upgraded licence numbers and a certificate of insurance.",
    consequence: "No Google Guaranteed badge until both documents clear.",
  },

  /* --------------------------------------------------------- presence */
  {
    key: "site-hvac",
    name: "coast2coastair.com",
    group: "presence",
    what: "The HVAC site. 94 pages prerendered, sitemap, robots and llms.txt.",
    detect: "site",
  },
  {
    key: "site-contracting",
    name: "coastalswfl.com",
    group: "presence",
    what: "The contracting and roofing side of the same company, declared as the parent organisation in this site's schema.",
    detect: null,
    declared: "connected",
    declaredNote: "Live, and the entity relationship is declared in JSON-LD.",
  },
  {
    key: "gbp",
    name: "Google Business Profile",
    group: "presence",
    what: "The map pack listing, the location asset on every ad, and the review link.",
    detect: null,
    declared: "in-progress",
    declaredNote:
      "Claim submitted. Postcard verification runs 5 to 14 days and nothing downstream moves until it lands.",
    consequence:
      "The one outstanding item. It gates the local pack, the review sequence, Local Services Ads and the Google Ads location asset — which is most of what is currently paused.",
  },
  {
    key: "instagram",
    name: "Instagram",
    group: "presence",
    what: "Two posts a week, written and scheduled through 29 December.",
    detect: null,
    declared: "connected",
    declaredNote: "Account access in place and the calendar is loaded.",
  },

  /* ------------------------------------------------------------ leads */
  {
    key: "quote-form",
    name: "Quote form delivery",
    group: "leads",
    what: "Where a submitted quote request is sent.",
    detect: "quote-endpoint",
    consequence:
      "With no endpoint the form falls back to opening a prefilled email, so a lead is never silently dropped — but it depends on the visitor's mail client, which is not a system of record.",
  },
  {
    key: "call-tracking",
    name: "Call tracking number",
    group: "leads",
    what: "A tracked number forwarding to the real line, so Ads, the Business Profile and LSA can be told apart.",
    detect: null,
    declared: "in-progress",
    declaredNote: "Number selected, forwarding not yet tested end to end.",
    consequence: "Call conversions and the call-only campaign both wait on this.",
  },
];
