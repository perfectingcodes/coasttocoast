import { business, cleanAndTune, locations, region } from "./site";

/**
 * Paid landing pages.
 *
 * These are not marketing pages with a form bolted on. A landing page bought
 * with ad money has one job and is judged on one number, so each of these
 * drops the site navigation entirely, answers the exact promise the ad made
 * in the first screen, and gives the visitor two ways forward — call or
 * book — and nothing else to click.
 *
 * Every page here is noindexed on purpose. They would otherwise compete with
 * the organic city and service pages for the same terms, which is paying
 * twice to split your own ranking. They are deliberately NOT disallowed in
 * robots.txt: AdsBot has to be able to fetch a landing page or the ad is
 * disapproved.
 *
 * `campaign` ties each page back to content/marketing.ts so the dashboard can
 * show which campaign points where, and so nobody ships an ad group without a
 * page behind it.
 */

export type Variant = "emergency" | "offer" | "replacement" | "storm" | "commercial";

export interface LandingPage {
  slug: string;
  /** Matches a campaign name in marketing.ts. */
  campaign: string;
  platform: "Google Ads" | "Google LSA" | "Meta";
  variant: Variant;
  /** The headline the ad itself runs, so message match can be checked. */
  adHeadline: string;
  /** Terms this page is bought against. */
  terms: string[];
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  sub: string;
  /** Three facts above the fold. Short enough to read without stopping. */
  proof: string[];
  /** Which action the page pushes hardest. */
  lead: "call" | "book";
  steps: { title: string; body: string }[];
  reasons: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
  close: { title: string; body: string };
}

const cities = locations.map((l) => l.city);

export const landingPages: LandingPage[] = [
  /* ------------------------------------------------------------ emergency */
  {
    slug: "emergency-ac-repair",
    campaign: "Emergency AC — always on",
    platform: "Google Ads",
    variant: "emergency",
    adHeadline: "AC Out? We Answer 24/7 — Licensed Fort Myers HVAC",
    terms: [
      "emergency ac repair",
      "ac repair near me",
      "24 hour ac repair fort myers",
      "ac not cooling",
    ],
    title: `24/7 Emergency AC Repair in ${region} | ${business.name}`,
    description: `AC out? A real person answers around the clock and a licensed tech is dispatched same day across ${region}. Flat price in writing before work starts. Call ${business.phone}.`,
    eyebrow: "Emergency service",
    h1: "Your AC is out. We answer at 2am.",
    sub: `A real person picks up around the clock — not a call centre, not a voicemail box. Licensed techs, flat price agreed before anything is opened, and same-day dispatch across ${region}.`,
    proof: ["Answered 24/7", "Same-day dispatch", "Flat price before we start"],
    lead: "call",
    steps: [
      {
        title: "You call, a person answers",
        body: "Any hour. They take the address, the symptom and how urgent it is — not a message to pass on in the morning.",
      },
      {
        title: "We tell you when, not 'sometime'",
        body: "You get a window before you hang up, and a call from the tech when they are on the way.",
      },
      {
        title: "Price agreed, then the work",
        body: "The tech diagnoses it, quotes a flat price in writing, and only then opens the system. No hourly meter running while you watch.",
      },
    ],
    reasons: [
      {
        title: "Licensed and insured, with the number published",
        body: `Florida Mechanical Contractor ${business.license}. It is on every page of this site and on the side of the van, because an unlicensed install is a code problem you inherit when you sell the house.`,
      },
      {
        title: "Flat rate, not hourly",
        body: "You are quoted the job, not the clock. A tech who is slow because the attic is 140 degrees does not cost you more.",
      },
      {
        title: "We work on what is already there",
        body: "A failed capacitor is a part, not a reason to sell you a system. If replacement genuinely is the better call, you get both numbers and the reasoning.",
      },
      {
        title: "Local, and it matters here",
        body: `Salt air, canal humidity and a cooling season that never really stops. ${cities.slice(0, 4).join(", ")} and the rest of the coast — we know what fails here and why.`,
      },
    ],
    faqs: [
      {
        q: "Do you really answer at night?",
        a: "Yes — a person takes the call and dispatches, at any hour. You are not leaving a message for the morning.",
      },
      {
        q: "What does an emergency call cost?",
        a: "You are given a flat price for the repair before any work begins. The diagnostic is quoted up front too, so nothing on the invoice is a surprise.",
      },
      {
        q: "How fast can someone get here?",
        a: "Same day in most of the service area. You are given a real window on the phone rather than a promise to call back.",
      },
      {
        q: "What if it needs a part you do not have?",
        a: "Common failure parts — capacitors, contactors, motors, thermostats — are on the vans. If it is something rarer you are told what it is, what it costs and when it lands, that day.",
      },
    ],
    close: {
      title: "Call now and speak to a person",
      body: "Or send the details and we will call you straight back. Either way you get a real time, not a maybe.",
    },
  },

  /* ---------------------------------------------------------------- offer */
  {
    slug: "ac-tune-up",
    campaign: `${cleanAndTune.price} Clean & Tune — pre-season`,
    platform: "Google Ads",
    variant: "offer",
    adHeadline: `${cleanAndTune.price} AC Clean & Tune — 10-Point Service, Booked Today`,
    terms: [
      "ac tune up",
      "ac maintenance near me",
      "air conditioner service special",
      "ac tune up cost",
    ],
    title: `${cleanAndTune.price} AC Clean & Tune in ${region} | ${business.name}`,
    description: `A ${cleanAndTune.price} 10-point AC clean and tune by a licensed tech, ${cleanAndTune.unit}. Catches the failures that strand people in August. Book online or call ${business.phone}.`,
    eyebrow: "Pre-season service",
    h1: `A ${cleanAndTune.price} tune-up now, or a $2,000 call in August.`,
    sub: `Ten points, a licensed tech, and a written condition report you keep. Most summer breakdowns are something a spring service would have caught — a weak capacitor, a choked coil, a drain about to back up.`,
    proof: [`${cleanAndTune.price} ${cleanAndTune.unit}`, "10-point service", "Written condition report"],
    lead: "book",
    steps: [
      {
        title: "Book a window that suits you",
        body: "Pick a day; we confirm the window. No all-day waiting.",
      },
      {
        title: "The ten points, properly",
        body: "Not a filter change and a sticker. Electrical, refrigerant, airflow, drainage and the outdoor unit, each measured and recorded.",
      },
      {
        title: "You get the numbers",
        body: "A written report with the readings, what is fine, what is aging and what will need attention — with no obligation attached to any of it.",
      },
    ],
    reasons: [
      {
        title: "The price is the price",
        body: `${cleanAndTune.price} ${cleanAndTune.unit}, published on the site rather than quoted on the phone. If something is found that needs fixing you are told what it costs before anything is done.`,
      },
      {
        title: "It is a diagnostic, not a dusting",
        body: "The point of the visit is to find the thing that will fail. A capacitor reading low in March is a $200 part; the same capacitor in July is an emergency call and a hot house.",
      },
      {
        title: "Twice a year is right in this climate",
        body: "Systems here run close to year-round, and coastal salt shortens condenser coil life. March and October are the sensible months.",
      },
      {
        title: "No pressure to replace anything",
        body: "A condition report with real readings is more useful to you than a sales pitch, and it is what you will want in hand when the system genuinely is near the end.",
      },
    ],
    faqs: [
      {
        q: `Is ${cleanAndTune.price} really the whole price?`,
        a: `Yes — ${cleanAndTune.price} ${cleanAndTune.unit} for the ten-point service. Repairs found during the visit are quoted separately and only done with your say-so.`,
      },
      {
        q: "How long does it take?",
        a: "Usually under an hour for a single system. Longer if the drain needs clearing or the coil is badly fouled, and you are told before that work starts.",
      },
      {
        q: "What are the ten points?",
        a: "Refrigerant charge, electrical connections and amp draw, capacitor and contactor condition, coil cleaning, condensate drain, blower and airflow, thermostat calibration, safety controls, cabinet and mounts, and a full visual on the ductwork.",
      },
      {
        q: "When should I book it?",
        a: "Before the season rather than during it — March going into summer, October after it. Mid-season slots fill with emergencies.",
      },
    ],
    close: {
      title: "Book the tune-up",
      body: "Pick a day that suits you and we will confirm the window. It takes about a minute.",
    },
  },

  /* ---------------------------------------------------------- replacement */
  {
    slug: "ac-replacement",
    campaign: "Local Services Ads — Google Guaranteed",
    platform: "Google LSA",
    variant: "replacement",
    adHeadline: "New AC System, Financed — Free Quote, Licensed Installer",
    terms: [
      "ac replacement cost",
      "new ac unit price",
      "hvac installation near me",
      "ac financing",
    ],
    title: `AC Replacement & Installation in ${region} | ${business.name}`,
    description: `A written quote for a new system, a permit pulled properly, and monthly payment options worked out before you commit. Licensed ${business.license}. Call ${business.phone}.`,
    eyebrow: "System replacement",
    h1: "A new system, priced in writing before you commit.",
    sub: "Most people replacing a system have been told a number over the phone and nothing else. You get a load calculation, two or three real options with the monthly cost of each, and the permit handled.",
    proof: ["Written quote, no pressure", "Permit pulled and inspected", "Monthly options shown up front"],
    lead: "book",
    steps: [
      {
        title: "A visit, not a phone estimate",
        body: "Someone looks at the house: the ductwork, the electrical, where the air handler sits and how much system it actually needs. A quote given over the phone is a guess.",
      },
      {
        title: "Options with monthly numbers",
        body: "Usually three: a solid baseline, a mid tier, and the efficient one. Each with an installed price and the monthly payment beside it, so the decision is a real comparison.",
      },
      {
        title: "Installed, permitted, inspected",
        body: `The permit goes through your city's office and the job is inspected. That paperwork is what a buyer's inspector asks for years later.`,
      },
    ],
    reasons: [
      {
        title: "Sized by calculation, not by habit",
        body: "An oversized system short-cycles, never pulls the humidity out, and dies early — which in this climate is the single most common install mistake.",
      },
      {
        title: "The quote is the price",
        body: "Flat, in writing, with what is included spelled out: equipment, labour, materials, permit, haul-away and start-up.",
      },
      {
        title: "Financing figured out before you decide",
        body: "You can work the monthly number yourself on this page. Nobody should be signing for a system without knowing what it does to the month.",
      },
      {
        title: "Ten to fifteen years is the real window here",
        body: "Near-constant runtime and salt air shorten the life of a system on this coast. If yours is in that band, a condition report is worth more than another repair.",
      },
    ],
    faqs: [
      {
        q: "What does a new system cost?",
        a: "It depends on the size, the efficiency and what the ductwork and electrical need. That is why the quote comes after a visit — but you get the full installed number in writing, not a range.",
      },
      {
        q: "Do I need a permit?",
        a: "Yes. Florida requires one for a system replacement, and the issuing office differs by city. We pull it and meet the inspector.",
      },
      {
        q: "Can I finance it?",
        a: "Yes. Work the monthly figure on this page first, then we confirm the real terms with the application. No obligation either way.",
      },
      {
        q: "Should I repair it instead?",
        a: "Often, yes — and we will say so. The rough test is the age of the system against the cost of the repair; a ten-year-old unit with a $400 fix is usually worth fixing.",
      },
    ],
    close: {
      title: "Get the quote in writing",
      body: "Tell us about the system and the house. We will book a visit and put real numbers in front of you.",
    },
  },

  /* ---------------------------------------------------------------- storm */
  {
    slug: "storm-ready",
    campaign: "Storm season readiness",
    platform: "Meta",
    variant: "storm",
    adHeadline: "Is Your AC Mounted For The Next One? Free Storm Check",
    terms: ["hurricane hvac", "elevated ac pad", "storm damage ac", "ian ac repair"],
    title: `Storm-Season HVAC Checks in ${region} | ${business.name}`,
    description: `Elevated pads, hurricane-rated mounts and the ductwork that got wet in 2022 and never properly dried. A storm-readiness check across ${region}. Call ${business.phone}.`,
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
        body: "A condenser raised onto a proper stand survives water that writes off one sitting on the original pad. It is a fraction of a replacement.",
      },
      {
        title: "Rated mounts, not whatever was there",
        body: "Hurricane-rated mounts and straps are a code requirement on new work and a sensible retrofit on old. Most pre-2022 installs on this coast do not have them.",
      },
      {
        title: "We were here for the last one",
        body: `Storm-impacted cities across our area — ${locations.filter((l) => l.conditions.stormImpact).map((l) => l.city).slice(0, 5).join(", ")} — and we are still finishing work that started then.`,
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

  /* ----------------------------------------------------------- commercial */
  {
    slug: "commercial-hvac",
    campaign: "Site retargeting",
    platform: "Meta",
    variant: "commercial",
    adHeadline: "Commercial HVAC With A Real Response Time — Service Agreements",
    terms: [
      "commercial hvac near me",
      "commercial ac repair",
      "rooftop unit service",
      "hvac service contract",
    ],
    title: `Commercial HVAC in ${region} | ${business.name}`,
    description: `Rooftop units, split systems and service agreements for restaurants, offices, HOAs and senior housing across ${region}. Licensed ${business.license}. Call ${business.phone}.`,
    eyebrow: "Commercial",
    h1: "When the rooftop goes down, the business stops.",
    sub: "Restaurants, medical and professional offices, HOAs, retail and senior housing across the coast. Planned maintenance that keeps units running, and a response time that is written into the agreement rather than implied.",
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

export const landingBySlug = (slug: string) =>
  landingPages.find((p) => p.slug === slug);
