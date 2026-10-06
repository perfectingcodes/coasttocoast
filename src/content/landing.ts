import { business, cleanAndTune } from "./site";

/**
 * Paid landing pages.
 *
 * Built to the Google Ads Build Sheet (Arranges Web, October 2026). Tab 10 of
 * that sheet maps every ad group to a destination and lists what the page has
 * to carry; `path`, `adGroups` and `requirements` below are that mapping, kept
 * here so a page and the ad group pointing at it cannot drift apart.
 *
 * Two things that follow from the sheet and are easy to get wrong:
 *
 * GEO. The Google Ads launch targets Naples, Bonita Springs, Estero and North
 * Naples only. Fort Myers and Cape Coral are deliberately excluded until
 * month 4 — splitting a $2,500 budget across six cities is the stated fastest
 * way to fail. So these pages say Naples, Bonita and Estero, not "Southwest
 * Florida", and they do not list the northern cities. The organic site still
 * covers all nine; that is a different channel with different economics.
 *
 * INDEXING. Every page here is noindexed on purpose — they would otherwise
 * compete with the organic city and service pages for the same terms. They
 * are deliberately NOT disallowed in robots.txt: AdsBot has to be able to
 * fetch a landing page or the ad is disapproved.
 */

export type Variant =
  | "repair"
  | "offer"
  | "plans"
  | "replacement"
  | "storm"
  | "commercial";

/** The Phase 1 paid service area. Tab 3 of the build sheet. */
export const adMarkets = ["Naples", "Bonita Springs", "Estero", "North Naples"];
export const adMarketLine = "Naples, Bonita Springs and Estero";

export interface LandingPage {
  /** URL. The Google Ads pages sit at the top level because that is what the
   *  sitelinks and ad destinations in the sheet point at. */
  path: string;
  /** Which plan this page belongs to — the Google Ads build sheet, or our own
   *  Meta plan in content/marketing.ts. */
  plan: "google-ads" | "meta";
  /** Ad groups routed here, from tab 10. */
  adGroups: string[];
  campaign: string;
  platform: "Google Ads" | "Google LSA" | "Meta";
  variant: Variant;
  /** The headline the ad itself runs, so message match can be checked. */
  adHeadline: string;
  terms: string[];
  /** Tab 10, "Required on the page". The admin checks the page against it. */
  requirements: string[];
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  sub: string;
  proof: string[];
  /** Which action the page pushes hardest. */
  lead: "call" | "book";
  steps: { title: string; body: string }[];
  reasons: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
  close: { title: string; body: string };
}

export const landingPages: LandingPage[] = [
  /* --------------------------------------------------------- /ac-repair */
  {
    path: "/ac-repair",
    plan: "google-ads",
    adGroups: ["AC Repair", "AC Not Cooling", "AC Service"],
    campaign: "Search — AC Repair",
    platform: "Google Ads",
    variant: "repair",
    adHeadline: "AC Repair in Naples, FL — Same-Day Service",
    terms: [
      "ac repair naples",
      "ac not cooling",
      "ac blowing warm air",
      "ac repair near me",
      "ac leaking water",
    ],
    requirements: [
      "Click-to-call above the fold",
      "2-field form",
      "'Same-day service'",
      "License number",
      "3 reviews",
      "$89 offer as secondary CTA",
      "H2 on common causes (capacitor, coil, drain line)",
    ],
    title: `AC Repair in Naples & Bonita Springs | ${business.name}`,
    description: `Same-day AC repair in ${adMarketLine}. Licensed ${business.license}, upfront pricing before any work begins. Call ${business.phone}.`,
    eyebrow: "Same-day AC repair",
    h1: "AC out? Same-day repair in Naples, Bonita and Estero.",
    sub: "A licensed technician diagnoses the actual fault and gives you the price in writing before anything is opened. Most repairs finish in one visit.",
    proof: ["Same-day service", `Licensed ${business.license}`, "Upfront pricing, no surprises"],
    lead: "call",
    steps: [
      {
        title: "Call and tell us what it is doing",
        body: "Not cooling, blowing warm, leaking, making a noise. Two minutes on the phone is usually enough to know what we are walking into.",
      },
      {
        title: "A real window, before you hang up",
        body: "You get a time, and a call from the technician when they are on the way — not a promise to ring back.",
      },
      {
        title: "Diagnosed, priced, then fixed",
        body: "The fault is found and the flat price goes in writing before the system is opened. No hourly meter running while you watch.",
      },
    ],
    reasons: [
      {
        title: "Licensed and insured, with the number published",
        body: `Florida Mechanical Contractor ${business.license}. It is on every page of this site, because an unlicensed install is a code problem you inherit when you sell the house.`,
      },
      {
        title: "Upfront pricing, not an hourly rate",
        body: "You are quoted the job, not the clock. A technician who is slow because the attic is 140 degrees does not cost you more.",
      },
      {
        title: "We fix what is there before we sell you anything",
        body: "A failed capacitor is a part, not a reason to replace a system. If replacement genuinely is the better call you get both numbers and the reasoning.",
      },
      {
        title: "All makes and models",
        body: "Carrier, Trane, Lennox, Rheem, Goodman, Daikin and the rest. The common failure parts are on the van.",
      },
    ],
    faqs: [
      {
        q: "Can you come today?",
        a: `Same-day service across ${adMarketLine} in most cases. You are given a real window on the phone rather than a promise to call back.`,
      },
      {
        q: "What does a repair cost?",
        a: "You get a flat price for the repair in writing before any work begins, and the diagnostic is quoted up front too. Nothing on the invoice is a surprise.",
      },
      {
        q: "My AC runs but blows warm air. What is that?",
        a: "Most often a failed capacitor, a dirty or iced evaporator coil, or a refrigerant problem. All three are diagnosable in one visit and two of them are inexpensive fixes.",
      },
      {
        q: "Do you work on every brand?",
        a: "Yes — all makes and models, residential and light commercial. Common failure parts are carried on the vans so most repairs finish the same visit.",
      },
    ],
    close: {
      title: "Get a technician out today",
      body: "Name and number is enough to start. We will call you straight back with a time.",
    },
  },

  /* -------------------------------------------------------- /ac-tune-up */
  {
    path: "/ac-tune-up",
    plan: "google-ads",
    adGroups: ["AC Tune-Up", "AC Cleaning", "AC Inspection"],
    campaign: "Search — $89 Tune-Up",
    platform: "Google Ads",
    variant: "offer",
    adHeadline: `${cleanAndTune.price} AC Clean & Tune — 10-Point Inspection`,
    terms: [
      "ac tune up naples",
      "ac tune up special",
      "ac maintenance near me",
      "ac drain line cleaning",
      "ac coil cleaning",
    ],
    requirements: [
      "Price in the H1",
      "The 10-point checklist",
      "'Usually $X' anchor — PRICE NOT CONFIRMED, see admin",
      "Booking",
      "'What happens if we find something' section",
    ],
    title: `${cleanAndTune.price} AC Clean & Tune in Naples & Bonita | ${business.name}`,
    description: `A ${cleanAndTune.price} 10-point AC clean and tune by a licensed technician across ${adMarketLine}. Honest report, no upsell. Book online or call ${business.phone}.`,
    eyebrow: "Pre-season service",
    h1: `An ${cleanAndTune.price} tune-up now, or a $2,000 call in August.`,
    sub: "Ten points, a licensed technician, and a written condition report you keep. Most summer breakdowns start as something a spring service would have caught.",
    proof: [`${cleanAndTune.price} ${cleanAndTune.unit}`, "10-point inspection", "No upsell — just the report"],
    lead: "book",
    steps: [
      {
        title: "Book a window that suits you",
        body: "Same-week appointments across Naples, Bonita Springs and Estero. Pick a day; we confirm the window.",
      },
      {
        title: "The ten points, properly",
        body: "Not a filter change and a sticker. Electrical, refrigerant, airflow, drainage and the outdoor unit, each measured and recorded.",
      },
      {
        title: "You get the numbers",
        body: "A written report with the readings — what is fine, what is aging, what will need attention — and no obligation attached to any of it.",
      },
    ],
    reasons: [
      {
        title: "The price is the price",
        body: `${cleanAndTune.price} ${cleanAndTune.unit}, published rather than quoted on the phone. Anything found that needs fixing is priced before it is done.`,
      },
      {
        title: "It is a diagnostic, not a dusting",
        body: "The point of the visit is to find the thing that will fail. A capacitor reading low in March is a cheap part; the same capacitor in July is an emergency call and a hot house.",
      },
      {
        title: "Twice a year is right in this climate",
        body: "Systems here run close to year-round, and coastal salt shortens condenser coil life. March and October are the sensible months.",
      },
      {
        title: "No pressure to replace anything",
        body: "A condition report with real readings is worth more to you than a sales pitch, and it is what you will want in hand when the system genuinely is near the end.",
      },
    ],
    faqs: [
      {
        q: `Is ${cleanAndTune.price} really the whole price?`,
        a: `Yes — ${cleanAndTune.price} ${cleanAndTune.unit} for the ten-point service. Repairs found during the visit are quoted separately and only done with your say-so.`,
      },
      {
        q: "What if you find something wrong?",
        a: "You are told what it is, what it costs and how urgent it is. Nothing gets done without your approval, and plenty of visits end with nothing needing doing at all.",
      },
      {
        q: "How long does it take?",
        a: "Usually under an hour for a single system. Longer if the drain needs clearing or the coil is badly fouled, and you are told before that work starts.",
      },
      {
        q: "What are the ten points?",
        a: "Thermostat, filter, condensate drain and P-trap, drain pan treatment, capacitor readings, evaporator coil, condenser coil and cabinet, amp draws and refrigerant pressures, heater operation, and a full condition report.",
      },
    ],
    close: {
      title: "Book the tune-up",
      body: "Pick a day that suits you and we will confirm the window. It takes about a minute.",
    },
  },

  /* ------------------------------------------------- /maintenance-plans */
  {
    path: "/maintenance-plans",
    plan: "google-ads",
    adGroups: ["AC Maintenance"],
    campaign: "Search — $89 Tune-Up",
    platform: "Google Ads",
    variant: "plans",
    adHeadline: "AC Maintenance Plans — Two Visits a Year",
    terms: [
      "ac maintenance plan",
      "ac maintenance near me",
      "annual ac service",
      "hvac maintenance naples",
    ],
    requirements: [
      "Plan tiers and pricing — PRICING NOT SET, see admin",
      "What's included",
      "Enrollment form",
    ],
    title: `AC Maintenance Plans in Naples & Bonita | ${business.name}`,
    description: `Two seasonal visits a year, priority scheduling and no overtime charges across ${adMarketLine}. Licensed ${business.license}. Call ${business.phone}.`,
    eyebrow: "Maintenance plans",
    h1: "Two visits a year, and we are the ones who remember.",
    sub: "A plan is the difference between a system that gets looked at twice a year and one that gets looked at when it stops. Priority scheduling, no overtime charges, and the same technician who knows the system.",
    proof: ["Two visits a year", "Priority scheduling", "No overtime charges"],
    lead: "book",
    steps: [
      {
        title: "Pick a plan",
        body: "One system or several. Residential plans cover the spring and autumn visits; multi-system homes are priced per unit.",
      },
      {
        title: "We book the visits",
        body: "March and October, scheduled by us rather than remembered by you. You get a call to confirm a window each time.",
      },
      {
        title: "You get the report, twice a year",
        body: "The same written condition report as the one-off service, so you can see what changed between visits — which is what actually predicts a failure.",
      },
    ],
    reasons: [
      {
        title: "Priority when the season breaks",
        body: "In July the schedule fills with emergencies. Plan members go to the front of it, which is the whole point of being on one.",
      },
      {
        title: "No overtime charges",
        body: "An after-hours call on a plan is charged at the normal rate. That is worth more than most of the discount lines on a maintenance agreement.",
      },
      {
        title: "A history, not a visit",
        body: "Two readings a year on the same system is a trend. It is how a failing capacitor or a slow refrigerant leak shows up before it strands you.",
      },
      {
        title: "It protects the manufacturer warranty",
        body: "Most manufacturer warranties require documented annual maintenance. A plan produces the paperwork automatically.",
      },
    ],
    faqs: [
      {
        q: "What does a plan cost?",
        a: "Plan pricing is being finalised. Call us and we will give you the current rate for your system, and the one-off $89 Clean & Tune is available either way.",
      },
      {
        q: "What is included in each visit?",
        a: "The same ten-point service as the one-off Clean & Tune: thermostat, filter, drain line and pan, capacitor readings, both coils, amp draws and refrigerant pressures, heater operation and a written report.",
      },
      {
        q: "Can I cover more than one system?",
        a: "Yes. Multi-system homes are priced per unit, and several addresses can sit on one agreement.",
      },
      {
        q: "What if I need a repair between visits?",
        a: "Plan members get priority scheduling and no overtime charge. Repairs themselves are quoted flat, the same as for anyone else.",
      },
    ],
    close: {
      title: "Ask about a plan",
      body: "Tell us how many systems and where. We will come back with the plan rate and the next available visit.",
    },
  },

  /* --------------------------------------------------- /ac-replacement */
  {
    path: "/ac-replacement",
    plan: "google-ads",
    adGroups: ["AC Replacement", "AC Installation"],
    campaign: "Search — AC Replacement",
    platform: "Google Ads",
    variant: "replacement",
    adHeadline: "Free AC Replacement Estimate — Financing Available",
    terms: [
      "ac replacement cost",
      "new ac unit cost",
      "ac installation near me",
      "replace air conditioner naples",
      "new ac install naples",
    ],
    requirements: [
      "Financing",
      "Brands — LIST NOT CONFIRMED, see admin",
      "Free estimate form",
      "Repair-vs-replace guidance",
    ],
    title: `AC Replacement & Installation in Naples | ${business.name}`,
    description: `A free in-home estimate, a properly sized system, permits and haul-away included, financing available. Licensed ${business.license}. Call ${business.phone}.`,
    eyebrow: "System replacement",
    h1: "A new system, priced in writing before you commit.",
    sub: "Most people replacing a system have been given a number over the phone and nothing else. You get a load calculation, two or three real options with the monthly cost of each, and the permit handled.",
    proof: ["Free in-home estimate", "Permits & haul-away included", "Financing available"],
    lead: "book",
    steps: [
      {
        title: "A visit, not a phone estimate",
        body: "Someone looks at the house: the ductwork, the electrical, where the air handler sits and how much system it actually needs. A number given over the phone is a guess.",
      },
      {
        title: "Options with monthly figures",
        body: "Usually three — a solid baseline, a mid tier and the efficient one — each with an installed price and the monthly payment beside it, so the decision is a real comparison.",
      },
      {
        title: "Installed, permitted, inspected",
        body: "The permit goes through your city's office and the job is inspected. That paperwork is what a buyer's inspector asks for years later.",
      },
    ],
    reasons: [
      {
        title: "Sized by calculation, not by habit",
        body: "An oversized system short-cycles, never pulls the humidity out and dies early — in this climate the single most common install mistake.",
      },
      {
        title: "Repair or replace? We will say which",
        body: "The rough test is the age of the system against the cost of the repair. A ten-year-old unit with a $400 fix is usually worth fixing, and we will tell you so.",
      },
      {
        title: "The quote is the price",
        body: "Flat, in writing, with what is included spelled out: equipment, labour, materials, permit, haul-away and start-up.",
      },
      {
        title: "Financing figured out before you decide",
        body: "Work the monthly number yourself on this page. Nobody should sign for a system without knowing what it does to the month.",
      },
    ],
    faqs: [
      {
        q: "What does a new system cost?",
        a: "It depends on the size, the efficiency, and what the ductwork and electrical need. That is why the estimate comes after a visit — but you get the full installed number in writing, not a range.",
      },
      {
        q: "Do I need a permit?",
        a: "Yes. Florida requires one for a system replacement and the issuing office differs by city. We pull it and meet the inspector.",
      },
      {
        q: "Can I finance it?",
        a: "Yes. Work the monthly figure on this page first, then we confirm the real terms with the application. No obligation either way.",
      },
      {
        q: "Should I repair it instead?",
        a: "Often, yes — and we will say so. If the system is under about ten years old and the repair is a few hundred dollars, replacing it is rarely the better buy.",
      },
    ],
    close: {
      title: "Get the free estimate",
      body: "Tell us about the system and the house. We will book a visit and put real numbers in front of you.",
    },
  },

  /* -------------------------------------------------------- Meta plan */
  /* Not part of the Google Ads build sheet. These belong to our own Meta
     campaigns in content/marketing.ts and stay under /lp/. */
  {
    path: "/lp/storm-ready",
    plan: "meta",
    adGroups: [],
    campaign: "Storm season readiness",
    platform: "Meta",
    variant: "storm",
    adHeadline: "Is Your AC Mounted For The Next One? Free Storm Check",
    terms: ["hurricane hvac", "elevated ac pad", "storm damage ac"],
    requirements: ["Elevation and mounting", "Wet-duct inspection", "Written report"],
    title: `Storm-Season HVAC Checks | ${business.name}`,
    description: `Elevated pads, hurricane-rated mounts and the ductwork that got wet in 2022 and never properly dried. Call ${business.phone}.`,
    eyebrow: "Storm season",
    h1: "The last one took the condenser. Where is yours sitting?",
    sub: "A great deal of the mechanical work on this coast is still storm repair that never finished — units back on the original slab, mounts that were never rated, ductwork that got wet once and was never properly dried.",
    proof: ["Elevated pads", "Hurricane-rated mounts", "Wet-duct inspection"],
    lead: "book",
    steps: [
      {
        title: "We look at where it sits",
        body: "Slab height against the flood line, the strap and mount rating, the disconnect, and whether the line set has been working loose since the last blow.",
      },
      {
        title: "And at what the water did",
        body: "Ductwork that was soaked and dried in place is the quiet one. It smells faintly, it holds humidity, and it is still in a lot of houses on this coast.",
      },
      {
        title: "You get it in writing",
        body: "What is sound, what is marginal and what should be done before the season — with prices, and no pressure to do any of it today.",
      },
    ],
    reasons: [
      {
        title: "Elevation is the cheapest insurance there is",
        body: "A condenser raised onto a proper stand survives water that writes off one sitting on the original pad, for a fraction of a replacement.",
      },
      {
        title: "Rated mounts, not whatever was there",
        body: "Hurricane-rated mounts and straps are a code requirement on new work and a sensible retrofit on old. Most pre-2022 installs on this coast do not have them.",
      },
      {
        title: "We were here for the last one",
        body: "We are still finishing work that started in 2022, which is how we know what to look for.",
      },
      {
        title: "Before the season, not during it",
        body: "Everything on this list takes an hour when it is calm and is impossible to get done in the week a storm is named.",
      },
    ],
    faqs: [
      {
        q: "What does the check cover?",
        a: "Mounting and elevation, strap and pad condition, electrical disconnect, line set and insulation, and an inspection of the ductwork for water history.",
      },
      {
        q: "My unit survived the last storm. Does it need anything?",
        a: "Possibly not. But a unit that sat in water and kept running often has corrosion in the contactor and the coil that shows up a season or two later.",
      },
      {
        q: "Can you elevate an existing condenser?",
        a: "Usually, yes. It is a stand, a new pad and a line-set adjustment — straightforward work done before the season rather than after one.",
      },
      {
        q: "Do you handle insurance paperwork?",
        a: "We give you a written condition report with photographs, which is what an adjuster asks for. The claim itself stays between you and your insurer.",
      },
    ],
    close: {
      title: "Book a storm-season check",
      body: "Tell us the city and roughly how old the system is. We will come and look before the season does.",
    },
  },
  {
    path: "/lp/commercial-hvac",
    plan: "meta",
    adGroups: [],
    campaign: "Site retargeting",
    platform: "Meta",
    variant: "commercial",
    adHeadline: "Commercial HVAC With A Real Response Time",
    terms: ["commercial hvac near me", "rooftop unit service", "hvac service contract"],
    requirements: ["Sectors served", "Service agreements", "Response time"],
    title: `Commercial HVAC | ${business.name}`,
    description: `Rooftop units, split systems and service agreements for restaurants, offices, HOAs and senior housing. Licensed ${business.license}. Call ${business.phone}.`,
    eyebrow: "Commercial",
    h1: "When the rooftop goes down, the business stops.",
    sub: "Restaurants, medical and professional offices, HOAs, retail and senior housing. Planned maintenance that keeps units running, and a response time written into the agreement rather than implied.",
    proof: ["Service agreements", "Licensed & insured", "After-hours response"],
    lead: "call",
    steps: [
      {
        title: "A walk of the equipment",
        body: "Every unit listed, aged and photographed, with its filter sizes, belt sizes and refrigerant type on file. Most buildings do not have this.",
      },
      {
        title: "An agreement with numbers in it",
        body: "Visit frequency, what each visit covers, the response window for a breakdown, and the rate. Not 'priority service'.",
      },
      {
        title: "Planned work, in your quiet hours",
        body: "Scheduled around service, trading hours or residents rather than around our van.",
      },
    ],
    reasons: [
      {
        title: "The failures are different and so is the response",
        body: "Rooftop units fail on belts, bearings, economisers and controls, not on the things a house fails on. A kitchen with no makeup air is a different problem again.",
      },
      {
        title: "One contractor, documented",
        body: "An asset list, service history and the licence details your insurer and your landlord both ask for.",
      },
      {
        title: "Multi-building and HOA work",
        body: "Several addresses on one agreement, one point of contact, one invoice, and reporting a board can actually read.",
      },
      {
        title: "Local and reachable",
        body: `Based in ${business.city} and covering the coast. The person who did the walk is the person who answers.`,
      },
    ],
    faqs: [
      {
        q: "What does a service agreement cover?",
        a: "Scheduled visits at an agreed frequency, filters and belts, coil cleaning, control checks and a written report per visit. Repairs are quoted separately unless the agreement says otherwise.",
      },
      {
        q: "What is the response time on a breakdown?",
        a: "It is written into the agreement rather than left vague, and it is what we would be held to.",
      },
      {
        q: "Do you work after hours?",
        a: "Yes, around the clock. For commercial clients the out-of-hours rate is agreed in advance rather than invented at 11pm.",
      },
      {
        q: "Can you take on several buildings?",
        a: "Yes — HOAs and multi-building sites are a large part of the commercial work, on one agreement with one contact.",
      },
    ],
    close: {
      title: "Book an equipment walk",
      body: "Tell us roughly how many units and where. We will come and put an asset list and a real number in front of you.",
    },
  },
];

export const landingByPath = (path: string) =>
  landingPages.find((p) => p.path === path);
