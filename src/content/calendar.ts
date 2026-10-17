/**
 * The schedule, to the day.
 *
 * Every entry has a real date, a named owner and a reason it sits where it
 * sits. Where something waits on the client it says what breaks if it slips,
 * because a plan that does not say that is a wish list.
 *
 * Dates run from publish day — Saturday 17 October 2026 — to the 90-day
 * review on 18 January 2027. Weekends are deliberate: the site publishes on
 * a Saturday so there are two quiet days to find anything broken before ads
 * point at it, and the account is enabled on a Monday so the first search
 * terms report lands on a working day.
 */

export type Track =
  | "website"
  | "google-ads"
  | "gbp"
  | "reviews"
  | "social"
  | "measure"
  | "client";

export const TRACKS: Record<Track, { label: string; dot: string; chip: string }> = {
  website: { label: "Website", dot: "bg-blue", chip: "bg-blue/10 text-blue ring-blue/25" },
  "google-ads": {
    label: "Google Ads",
    dot: "bg-ember",
    chip: "bg-ember/10 text-ember ring-ember/25",
  },
  gbp: { label: "Business Profile", dot: "bg-cyan", chip: "bg-cyan/18 text-[#0a5b7d] ring-cyan/40" },
  reviews: { label: "Reviews", dot: "bg-gold", chip: "bg-gold/20 text-amber-800 ring-gold/40" },
  social: {
    label: "Instagram & Meta",
    dot: "bg-orange",
    chip: "bg-orange/12 text-orange ring-orange/30",
  },
  measure: {
    label: "Measurement",
    dot: "bg-emerald-500",
    chip: "bg-emerald-500/12 text-emerald-700 ring-emerald-500/25",
  },
  client: { label: "Needs the client", dot: "bg-navy", chip: "bg-navy/8 text-navy/70 ring-navy/15" },
};

export type Owner = "Elevate" | "Client" | "Both";

export interface Entry {
  /** ISO date. */
  date: string;
  title: string;
  track: Track;
  owner: Owner;
  detail: string;
  /** Why this date rather than any other. */
  why?: string;
  /** What fails if it slips. Only where something actually does. */
  blocks?: string;
  /** Renders larger in the agenda and marked on the month grid. */
  milestone?: boolean;
}

export const schedule: Entry[] = [
  /* ------------------------------------------------- Sat 17 Oct — publish */
  {
    date: "2026-10-17",
    title: "Publish the website",
    track: "website",
    owner: "Elevate",
    milestone: true,
    detail:
      "Deploy dist/public to the host, point the domain, force HTTPS, then walk the live site: home, one service page, one city page, all four landing pages, the 404, robots.txt and sitemap.xml.",
    why: "A Saturday publish gives two quiet days to find anything broken before a single paid click points at it.",
    blocks:
      "Everything. Ads cannot run to pages that do not resolve on the real domain, and the Google Ads conversion test on Sunday needs a live form to submit.",
  },
  {
    date: "2026-10-17",
    title: "Submit the sitemap in Search Console",
    track: "website",
    owner: "Elevate",
    detail:
      "Verify the property, submit sitemap.xml, request indexing on the home page and the nine city pages.",
    why: "Organic is the only channel that compounds and the only one that is free. Indexing takes days to weeks, so the clock starts the hour the site is live.",
  },
  {
    date: "2026-10-17",
    title: "Licence numbers that will be current on launch day",
    track: "client",
    owner: "Client",
    detail:
      "The upgrade is in progress. We need the numbers as they will read on Monday, plus a certificate of insurance naming the correct entity.",
    blocks:
      "The site publishes CMC1251768, CRC1335475 and CCC1336116 on all 92 pages and inside the JSON-LD. If a number changes after publish it is a rebuild and a redeploy, not an edit.",
  },
  {
    date: "2026-10-17",
    title: "Instagram and Meta Business access",
    track: "client",
    owner: "Client",
    detail:
      "Add us as an admin on the Meta Business Suite covering the Instagram account and the Facebook page. Not the password — proper partner access, so it survives a staff change.",
    why: "The Meta Pixel needs 30 days of traffic before a retargeting audience is large enough to run. Installed on the 19th, that window closes around 18 November. Every day access slips, retargeting slips with it.",
    blocks: "The Pixel install, the retargeting campaign, and any organic posting schedule.",
  },

  /* ----------------------------------------------- Sun 18 Oct — build it */
  {
    date: "2026-10-18",
    title: "Create the Google Ads account",
    track: "google-ads",
    owner: "Elevate",
    detail:
      "Expert mode, not the Smart Campaign flow. Add billing. Link GA4, Search Console and the Business Profile once it exists.",
  },
  {
    date: "2026-10-18",
    title: "Build the conversion actions and test them live",
    track: "measure",
    owner: "Elevate",
    detail:
      "Call from ads, call from website, click-to-call, form submit. Then submit a real form and place a real 90-second call, and confirm both land in Ads.",
    why: "Launching without working conversion tracking wastes the entire learning period — the account spends the first fortnight unable to tell a good click from a bad one.",
    blocks: "Nothing gets enabled until both test conversions appear.",
  },
  {
    date: "2026-10-18",
    title: "Build AC Repair and Brand, leave both paused",
    track: "google-ads",
    owner: "Elevate",
    detail:
      "Three ad groups, keywords, the three negative lists, two RSAs per group, all assets, the tracking template. Brand stays paused until the DBA is filed.",
    why: "Building on Sunday and enabling on Monday means the build is checked with fresh eyes rather than enabled the moment it is typed.",
  },

  /* ------------------------------------------------- Mon 19 Oct — launch */
  {
    date: "2026-10-19",
    title: "Enable AC Repair — ads are live",
    track: "google-ads",
    owner: "Elevate",
    milestone: true,
    detail: "$40/day, max CPC $9, presence-only targeting on Naples, North Naples, Bonita Springs and Estero. Brand $3/day stays paused.",
    why: "Monday morning. The first 48 hours are when a wrong match type burns the week, and nobody reads a search terms report on a Saturday.",
  },
  {
    date: "2026-10-19",
    title: "Install GA4 and the Meta Pixel",
    track: "measure",
    owner: "Elevate",
    detail:
      "Both are already wired into the site behind environment variables — VITE_GA4_ID and VITE_META_PIXEL_ID. Setting them and redeploying is the whole job.",
    why: "The Pixel's 30-day audience window starts today. 18 November is the earliest retargeting can run.",
  },
  {
    date: "2026-10-19",
    title: "Brief the office on speed-to-lead",
    track: "client",
    owner: "Both",
    detail:
      "Every enquiry called back inside five minutes. Agree who answers between 6am and 9pm and what happens to a lead that arrives at 8:45pm.",
    why: "A lead called back in five minutes converts several times better than one called back in an hour. No bid management compensates for a slow callback.",
  },
  {
    date: "2026-10-19",
    title: "Start the Google Business Profile claim",
    track: "gbp",
    owner: "Both",
    detail:
      "Create or claim the HVAC profile — not the roofing one. Request verification immediately.",
    why: "Postcard verification runs 5 to 14 days. Starting today means it is likely live before the tune-up campaign needs it.",
    blocks:
      "The local pack, the location asset on every ad, the review link, the whole review sequence, and Local Services Ads.",
  },

  /* ----------------------------------------------------------- week one */
  {
    date: "2026-10-20",
    title: "Search terms review — day 2",
    track: "google-ads",
    owner: "Elevate",
    detail: "Read every query that triggered an ad. Add negatives. Twenty minutes.",
    why: "Day two is when the worst matches show up and are cheapest to stop.",
  },
  {
    date: "2026-10-21",
    title: "Instagram audit and profile fix",
    track: "social",
    owner: "Elevate",
    detail:
      "Bio, link, category, contact buttons, highlights, and an inventory of what is already posted. No posting yet — the account gets fixed before it gets fed.",
  },
  {
    date: "2026-10-22",
    title: "Search terms review — day 4",
    track: "google-ads",
    owner: "Elevate",
    detail: "Second pass. By now the pattern of what Google is matching is visible.",
  },
  {
    date: "2026-10-23",
    title: "Listen to five recorded calls",
    track: "measure",
    owner: "Elevate",
    detail:
      "How the phone is answered decides the cost per booked job more than any bid does. Note what gets asked and what gets missed.",
  },
  {
    date: "2026-10-25",
    title: "Week 1 close",
    track: "measure",
    owner: "Elevate",
    detail:
      "Spend, clicks, average CPC, leads, and the negatives added. Reported in those terms, not in impressions.",
    why: "Expect 2–3 leads. That is a normal week one on $300 and it is not a verdict on the account.",
  },

  /* ----------------------------------------------------------- week two */
  {
    date: "2026-10-26",
    title: "Week 2 — same $300, tighter keywords",
    track: "google-ads",
    owner: "Elevate",
    detail:
      "Every junk query from week one is now a negative, so the same money buys better clicks. No budget change.",
  },
  {
    date: "2026-10-26",
    title: "Confirm the budget for weeks 2 to 4 in writing",
    track: "client",
    owner: "Client",
    detail: "$300, $300, then $500 a week. Agreeing it now means the ramp is not renegotiated mid-flight.",
    blocks: "Weeks 3–4. A budget decided late is a week of the campaign sitting at the wrong daily cap.",
  },
  {
    date: "2026-10-28",
    title: "Search terms review",
    track: "google-ads",
    owner: "Elevate",
    detail: "Twice weekly through month one.",
  },
  {
    date: "2026-10-29",
    title: "First three Instagram posts scheduled",
    track: "social",
    owner: "Elevate",
    detail:
      "Two posts a week, scheduled a fortnight ahead. Pillars: the work, the team, the seasonal advice, the offer — in that order of frequency.",
    blocks: "Needs the Meta Business access from 17 October and real job photographs.",
  },
  {
    date: "2026-10-30",
    title: "Calls reviewed, first offline conversion upload",
    track: "measure",
    owner: "Elevate",
    detail:
      "Any lead that became a booked job gets uploaded against its GCLID. From here the account starts learning from jobs rather than from form fills.",
  },
  { date: "2026-11-01", title: "Week 2 close", track: "measure", owner: "Elevate", detail: "Spend, leads, cost per lead, and whether week 3's budget increase is earned." },

  /* --------------------------------------------------------- weeks 3–4 */
  {
    date: "2026-11-02",
    title: "Enable the $89 Tune-Up campaign — $500/wk",
    track: "google-ads",
    owner: "Elevate",
    milestone: true,
    detail:
      "AC Repair to $48/day, Tune-Up on at $20/day with a $5 cap, Brand still $3. The tune-up is capped so it can never eat the repair budget.",
    blocks: "Needs the $89 landing page booking path tested end to end.",
  },
  {
    date: "2026-11-02",
    title: "Maintenance plan pricing",
    track: "client",
    owner: "Client",
    detail: "A real rate for one system, multi-system and property/HOA.",
    blocks:
      "The maintenance plan page converts badly with no price on it, and the price asset in the ad account cannot be built.",
  },
  {
    date: "2026-11-02",
    title: "The standard Clean & Tune price",
    track: "client",
    owner: "Client",
    detail:
      "The build sheet says $149, the website carries $189, and neither is confirmed as a rate the business has charged.",
    blocks:
      "The 'usually $X' anchor, everywhere. Advertising a saving against a price you never charged is false advertising, so nothing is shown until this is settled.",
  },
  { date: "2026-11-04", title: "Search terms review", track: "google-ads", owner: "Elevate", detail: "Now covering two campaigns." },
  { date: "2026-11-06", title: "Calls and offline uploads", track: "measure", owner: "Elevate", detail: "Weekly from here." },
  {
    date: "2026-11-09",
    title: "Month 1 report",
    track: "measure",
    owner: "Elevate",
    milestone: true,
    detail:
      "Booked jobs and revenue first, cost per booked job second, clicks and impressions last if at all. Against the build sheet's month-one targets.",
  },
  {
    date: "2026-11-09",
    title: "Review sequence goes live",
    track: "reviews",
    owner: "Both",
    detail:
      "Every completed job enters the four-step sequence: the technician asks in the driveway, an SMS carries the link the same day, one email on day 3, a final SMS on day 7, then it stops.",
    blocks:
      "Needs the Business Profile verified, because that is what issues the review link. If verification has slipped, this slips with it.",
  },
  { date: "2026-11-11", title: "Search terms review", track: "google-ads", owner: "Elevate", detail: "Weekly from here unless spend rises." },
  { date: "2026-11-13", title: "Calls and offline uploads", track: "measure", owner: "Elevate", detail: "Weekly." },

  /* ----------------------------------------------------------- month 2 */
  {
    date: "2026-11-16",
    title: "Month 2 — $650/wk, call-only comes on",
    track: "google-ads",
    owner: "Elevate",
    milestone: true,
    detail:
      "Repair $55/day, Tune-Up $25, Call-Only $10 at a $12 cap, Brand $3. Roughly $2,800 a month — Tier B from the build sheet.",
    blocks:
      "Call-only needs the dedicated tracked number live and answered 6am–9pm. A missed emergency call is worse than no ad at all.",
  },
  {
    date: "2026-11-18",
    title: "Meta retargeting audience is ready",
    track: "social",
    owner: "Elevate",
    detail:
      "Thirty days of Pixel data. Build the 180-day site-visitor audience excluding converters, and launch retargeting at $400/mo equivalent.",
    why: "Exactly 30 days after the Pixel went in on 19 October. This date moves day for day with the Meta access date.",
  },
  { date: "2026-11-23", title: "Weekly review", track: "measure", owner: "Elevate", detail: "Search terms, calls, uploads, pacing." },
  {
    date: "2026-11-26",
    title: "Thanksgiving — schedule check",
    track: "google-ads",
    owner: "Elevate",
    detail:
      "Pause the tune-up campaign over the long weekend; nobody books maintenance on Thanksgiving. Leave repair and call-only running — emergencies do not take the holiday off, and competition is thinner.",
  },
  { date: "2026-11-30", title: "Weekly review", track: "measure", owner: "Elevate", detail: "Search terms, calls, uploads, pacing." },
  {
    date: "2026-12-01",
    title: "Seasonal shift into heating",
    track: "google-ads",
    owner: "Elevate",
    detail:
      "Southwest Florida cold snaps drive heat-pump and heating-mode calls from systems that have not run in nine months. Add the heating terms to the repair campaign as a fourth ad group rather than a new campaign.",
    why: "Demand here is the inverse of most of the country. December through February is the quiet season for cooling and the only season for heating.",
  },
  {
    date: "2026-12-07",
    title: "Thirty-conversion check — bidding decision",
    track: "google-ads",
    owner: "Elevate",
    milestone: true,
    detail:
      "If the preceding 30 days produced 30+ conversions, switch Repair and Tune-Up to Maximize Conversions. If not, stay manual and say so.",
    why: "Smart bidding below 30 conversions is guesswork with a learning period attached. Switching early spends a month finding out what it already knew.",
  },
  { date: "2026-12-07", title: "Month 2 report", track: "measure", owner: "Elevate", detail: "Against month-one actuals, not against the targets alone." },

  /* ----------------------------------------------------------- month 3 */
  {
    date: "2026-12-14",
    title: "Month 3 — $800/wk, AC Replacement comes on",
    track: "google-ads",
    owner: "Elevate",
    milestone: true,
    detail:
      "Replacement at $10/day with a $14 cap. The highest ticket in the account and the slowest to convert, so it starts small and is judged over months rather than weeks.",
    blocks: "Needs the confirmed brand list for the structured snippet and the replacement page.",
  },
  {
    date: "2026-12-25",
    title: "Christmas — emergency only",
    track: "google-ads",
    owner: "Elevate",
    detail:
      "Tune-up and replacement paused 24–26 December. Repair and call-only stay on, with the ad schedule checked against who is genuinely available.",
  },
  {
    date: "2027-01-04",
    title: "Q1 planning and geo decision",
    track: "google-ads",
    owner: "Both",
    detail:
      "If cost per booked job is stable, expand into Fort Myers and Cape Coral and drop them from the geo-exclusion list. If it is not, fix the three cities first.",
    why: "The build sheet puts geo expansion at month 4. Expanding before the cost per job is stable just spreads the same problem over more cities.",
  },
  {
    date: "2027-01-18",
    title: "90-day review",
    track: "measure",
    owner: "Both",
    milestone: true,
    detail:
      "Booked jobs, revenue attributed, cost per booked job, review count, and whether the tune-up offer is converting into repair work. Decide the next quarter's budget from actuals.",
  },
];

/* --------------------------------------------------------- social plan */

/**
 * Instagram, once access lands. Two posts a week is the cadence a contractor
 * can actually sustain, and a sustained two beats an abandoned five.
 */
export const socialPlan = {
  cadence: "Two posts a week, scheduled a fortnight ahead",
  need: [
    "Admin access on the Meta Business Suite covering Instagram and the Facebook page",
    "Real job photographs — before and after, the van, the team. This is the gap no agency can fill for you",
    "Permission to photograph at customer properties, asked at the door",
  ],
  pillars: [
    {
      name: "The work",
      share: "Half of all posts",
      detail:
        "Before and after on a real job. A choked coil next to a clean one explains the $89 service better than any caption. Unbranded equipment, no faces without permission.",
    },
    {
      name: "The team",
      share: "One in four",
      detail:
        "Who turns up at the door. In a trade where the fear is a stranger in your house, a face with a name is the whole point of the channel.",
    },
    {
      name: "Seasonal advice",
      share: "One in five",
      detail:
        "Drain line clearing before the rains, what a cold snap does to a heat pump, storm mounting before June. Useful, not promotional, and it is what gets saved and shared.",
    },
    {
      name: "The offer",
      share: "One in ten at most",
      detail:
        "The $89 Clean & Tune. Any more often than this and the account reads as an advert and the engagement that makes the other posts work disappears.",
    },
  ],
  note: "Instagram will not produce leads at this budget and should not be measured on them. It does two jobs: it is the first thing a homeowner checks after a recommendation, and it feeds the retargeting audience that does convert.",
};
