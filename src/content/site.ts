/**
 * Single source of truth for every word, number and route on the site.
 *
 * Business facts (phone, address, licenses, service areas, the Clean & Tune
 * checklist) are taken from the company's existing site, coastswfl.com.
 *
 * Items marked ⚠️ CONFIRM are not published anywhere public and were filled in
 * from the design comp — check them with the client before launch.
 */

// ------------------------------------------------------------------ business

export const business = {
  name: "Coast to Coast Air",
  formalName: "Coast to Coast Air",
  legalName: "Coast to Coast Contracting & Roofing LLC",
  tagline: "Florida Comfort. Coast to Coast.",
  promise: "Comfort Lives Here.",
  url: "https://coasttocoastair.com", // ⚠️ CONFIRM final domain
  phone: "(239) 518-5928",
  phoneHref: "tel:+12395185928",
  email: "info@coasttocoastair.com", // ⚠️ CONFIRM
  street: "7200 Bucks Ln",
  city: "Fort Myers",
  state: "FL",
  zip: "33912",
  hours: "Mon–Fri, 8am–5pm",
  emergency: "24/7 emergency service",
  /** Florida Mechanical Contractor license — the one that covers HVAC work. */
  license: "CMC1251768",
  licenses: [
    { label: "Mechanical Contractor", number: "CMC1251768" },
    { label: "Residential Contractor", number: "CRC1335475" },
    { label: "Certified Contractor", number: "CCC1336116" },
  ],
  /** Used in the schema.org `logo` field and as the OG fallback. The rest of
   *  the brand kit (badge-only mark, mascot cut-out) is built to
   *  /brand/ by scripts/brand-assets.py and is available for future pages. */
  logo: "/brand/logo-mascot.png",
  ogImage: "/og.jpg",
  social: {
    google: "https://www.google.com/search?q=Coast+to+Coast+Air+Fort+Myers",
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/coast2coast_swfl",
  },
} as const;

export const region = "Southwest Florida";

// ----------------------------------------------------------------------- nav

export const nav = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Areas We Serve", href: "/locations" },
  { label: "About", href: "/about" },
  { label: "Financing", href: "/financing" },
  { label: "Contact", href: "/contact" },
] as const;

// ------------------------------------------------------------------ services

export type IconName =
  | "flame"
  | "snowflake"
  | "cog"
  | "wrench"
  | "building"
  | "wind";

export interface Service {
  slug: string;
  name: string;
  /** Short label for cards, nav and breadcrumbs. */
  short: string;
  /** Even shorter label for <title> tags, where ~60 characters is the budget.
   *  Falls back to `short`. */
  seoShort?: string;
  /** One line under the card title. */
  blurb: string;
  /** Two or three sentences opening the service page. */
  intro: string;
  icon: IconName;
  /** Accent treatment on the service card icon. */
  accent: "orange" | "cyan" | "slate" | "blue";
  bullets: string[];
  faqs: { q: string; a: string }[];
}

export const services: Service[] = [
  {
    slug: "heating",
    name: "Heating Services",
    short: "Heating",
    blurb:
      "Stay warm and comfortable all season long with expert heating installation, repair, and maintenance.",
    intro:
      "Florida winters are short, which is exactly why heating problems go unnoticed until the first cold snap. We service heat pumps, electric strip heat and gas furnaces, and we test heating operation as part of every maintenance visit rather than waiting for January.",
    icon: "flame",
    accent: "orange",
    bullets: [
      "Heat pump repair, replacement and reversing-valve diagnostics",
      "Electric strip heat and gas furnace service",
      "Heating operation verified on every maintenance visit",
      "Safety checks on electrical connections and amp draws",
    ],
    faqs: [
      {
        q: "Do I really need heating in Southwest Florida?",
        a: "Most homes here run heat only a handful of nights a year, but those nights arrive without warning. Because the system sits idle for months, a failed heat strip or reversing valve usually shows up the first time you actually need it — which is why we test heating during maintenance.",
      },
      {
        q: "What kind of heating do most homes here use?",
        a: "The majority run a heat pump with electric strip backup. The same outdoor unit that cools in summer reverses to heat in winter, so a cooling problem and a heating problem are often the same problem.",
      },
    ],
  },
  {
    slug: "cooling",
    name: "Cooling Services",
    short: "Cooling",
    blurb:
      "Keep your home or business cool with high-performance AC systems and fast, reliable service.",
    intro:
      "Air conditioning in Southwest Florida runs close to year-round, and that runtime is why systems here last 10–15 years instead of 20. We diagnose what actually failed, quote it before we touch anything, and size replacements to the home rather than to the box that came out.",
    icon: "snowflake",
    accent: "cyan",
    bullets: [
      "Air conditioning repair on all major brands",
      "System replacement with permitting handled",
      "Refrigerant pressure and electrical amp-draw testing",
      "Evaporator and condenser coil cleaning",
    ],
    faqs: [
      {
        q: "How long do AC systems last around here?",
        a: "Most residential systems last 10–15 years given near-constant summer runtime. Coastal and canal-front homes often land at the lower end of that range because salt air accelerates coil corrosion.",
      },
      {
        q: "Do I need a permit to replace my AC system?",
        a: "Yes. Florida building code requires a permit for HVAC system replacement, and we handle permitting as part of every replacement we install.",
      },
    ],
  },
  {
    slug: "mechanical",
    name: "Mechanical Services",
    short: "Mechanical",
    blurb:
      "Expert mechanical solutions for commercial and residential systems.",
    intro:
      "Mechanical work is the part of HVAC that sits behind the equipment — ductwork, air handlers, condensate systems, electrical connections and the mounts holding it all down. We hold Florida Mechanical Contractor license CMC1251768 and do this work to code, with documentation.",
    icon: "cog",
    accent: "slate",
    bullets: [
      "Ductwork repair, replacement and sealing",
      "Air handler and condensate system service",
      "Hurricane-rated condenser mounts and elevated pads",
      "Licensed mechanical contractor — CMC1251768",
    ],
    faqs: [
      {
        q: "What counts as mechanical work?",
        a: "Anything structural or code-governed around the equipment: ductwork, air handlers, condensate drains and pans, electrical whips and disconnects, and the pads and mounts the outdoor unit sits on.",
      },
      {
        q: "Why do condenser mounts matter in Florida?",
        a: "After Hurricane Ian, many homeowners moved to hurricane-rated mounts and elevated pads. An elevated, properly strapped condenser is far less likely to be lost to surge or wind-driven debris.",
      },
    ],
  },
  {
    slug: "repairs-maintenance",
    name: "Repairs & Maintenance",
    short: "Repairs & Maintenance",
    seoShort: "AC Maintenance",
    blurb:
      "Prevent costly breakdowns with routine maintenance and fast, professional repairs.",
    intro:
      "Twice-yearly maintenance is not upselling in this climate — humidity and near-year-round cooling put more strain on equipment here than almost anywhere else in the country. Our Clean & Tune is a 10-point service, priced flat, and it catches the failures that otherwise strand you in August.",
    icon: "wrench",
    accent: "blue",
    bullets: [
      "10-point Clean & Tune, twice a year",
      "Capacitor readings taken before they fail",
      "Condensate drain vacuum, flush and treatment",
      "Flat pricing quoted before work begins",
    ],
    faqs: [
      {
        q: "How often should I get my AC serviced?",
        a: "Twice a year. Southwest Florida's humidity and near-year-round cooling season put more strain on AC systems than cooler climates, so regular maintenance matters more here than it would up north.",
      },
      {
        q: "What does the Clean & Tune include?",
        a: "A 10-point inspection and service covering the thermostat, filter, condensate drains, capacitor readings, evaporator and condenser coils, electrical amp draws, refrigerant pressures and heating operation, finished with a written condition report.",
      },
    ],
  },
  {
    slug: "commercial-hvac",
    name: "Commercial HVAC",
    short: "Commercial",
    blurb:
      "Reliable commercial HVAC service that keeps your doors open and your customers comfortable.",
    intro:
      "For a business, an HVAC failure is lost revenue, not just discomfort. We service light commercial and multi-building properties across Southwest Florida — including HOA communities and assisted living facilities — with scheduled maintenance that keeps equipment out of emergency status.",
    icon: "building",
    accent: "slate",
    bullets: [
      "Light commercial repair, replacement and maintenance",
      "Multi-building and HOA community programs",
      "Assisted living and senior housing facilities",
      "Scheduled service that works around your hours",
    ],
    faqs: [
      {
        q: "Do you work with HOAs and property managers?",
        a: "Yes. We handle multi-building properties and provide the documentation boards and managers need for budgeting, reserve studies and insurance.",
      },
      {
        q: "Can you service us outside business hours?",
        a: "Yes. For retail, restaurants and medical offices we schedule around opening hours wherever the work allows.",
      },
    ],
  },
  {
    slug: "indoor-air-quality",
    name: "Indoor Air Quality",
    short: "Air Quality",
    blurb:
      "Control humidity, dust and allergens with air quality solutions built for the Gulf Coast.",
    intro:
      "In this climate the real air quality problem is humidity. Coastal moisture clogs condensate drains faster than inland homes and feeds mold growth in ductwork, so we measure humidity and fix the cause — drainage, duct leakage, a system that short-cycles — instead of selling you a filter.",
    icon: "wind",
    accent: "cyan",
    bullets: [
      "Humidity measurement and dehumidification",
      "Condensate drain cleaning and chemical treatment",
      "Duct sealing and antimicrobial coil cleaning",
      "Media and UV filtration options",
    ],
    faqs: [
      {
        q: "What indoor humidity should I aim for?",
        a: "45–55% keeps mold growth down without making the house feel clammy. Above 60% for sustained periods is where problems start in Florida homes.",
      },
      {
        q: "Why do my drain lines clog so often?",
        a: "Coastal humidity means your system pulls far more moisture out of the air than an inland system does. That water carries dust and biological growth into the drain, which is why we vacuum, flush and chemically treat the line at every maintenance visit.",
      },
    ],
  },
];

export const serviceBySlug = (slug: string) =>
  services.find((s) => s.slug === slug);

// ------------------------------------------------------------ featured offer

/** The company's published maintenance offer, verbatim from coastswfl.com. */
export const cleanAndTune = {
  name: "AC Clean & Tune",
  price: "$89",
  unit: "per visit",
  summary:
    "A 10-point maintenance service that keeps your system efficient, catches failures early and protects your manufacturer warranty.",
  checklist: [
    "Verify thermostat operation",
    "Replace air filter (customer-supplied)",
    "Vacuum and flush condensate drain line, refill P-trap",
    "Chemically treat the condensate drain pan",
    "Verify capacitor microfarad (MFD) readings",
    "Clean evaporator coil with antimicrobial cleaner",
    "Clean condenser coil and cabinet",
    "Measure electrical amp draws and refrigerant pressures",
    "Verify heater operation (with approval)",
    "Inspect system condition and provide recommendations",
  ],
} as const;

// ----------------------------------------------------------------- locations

export type SaltExposure = "canal" | "gulf" | "inland";

export interface Location {
  slug: string;
  city: string;
  county: string;
  /** County office that issues the HVAC permit — differs per county. */
  permitAuthority: string;
  /** Approximate city-centre coordinates, used for LocalBusiness geo markup. */
  lat: number;
  lng: number;
  zips: string[];
  /** Genuinely local context, drawn from the company's own city pages. */
  intro: string;
  neighborhoods: string[];
  /** Real conditions that change how equipment is specified and serviced here. */
  conditions: {
    salt: SaltExposure;
    /** One line on the local housing stock. */
    housing: string;
    /** Significant share of seasonally occupied homes. */
    seasonal: boolean;
    /** Took direct damage in the 2022 Hurricane Ian landfall. */
    stormImpact: boolean;
  };
}

export const locations: Location[] = [
  {
    slug: "fort-myers",
    city: "Fort Myers",
    county: "Lee County",
    permitAuthority: "Lee County Department of Community Development",
    lat: 26.6406,
    lng: -81.8723,
    zips: ["33901", "33905", "33907", "33908", "33912", "33913", "33916", "33919", "33966"],
    intro:
      "Fort Myers housing runs from historic homes in the Downtown River District to newer construction south of Daniels Parkway, and the two need very different things from an HVAC system. Older neighborhoods often have original ductwork and undersized returns, which changes what a replacement actually requires.",
    neighborhoods: [
      "Downtown River District",
      "McGregor",
      "College Park",
      "Iona",
      "South Fort Myers",
      "Whiskey Creek",
      "Fort Myers Beach",
      "Centennial Park",
    ],
    conditions: {
      salt: "gulf",
      housing:
        "a wide split between pre-1970 block homes downtown and post-2000 construction south of Daniels Parkway",
      seasonal: false,
      stormImpact: true,
    },
  },
  {
    slug: "cape-coral",
    city: "Cape Coral",
    county: "Lee County",
    permitAuthority: "City of Cape Coral Building Division",
    lat: 26.5629,
    lng: -81.9495,
    zips: ["33904", "33909", "33914", "33990", "33991", "33993"],
    intro:
      "With more canal miles than any city in the world, Cape Coral's waterfront homes face humidity and salt exposure that inland Florida homes simply don't. Canal-front humidity accelerates coil corrosion and condensate drain clogs, and many homeowners have since upgraded to hurricane-rated outdoor condenser mounts and elevated pads.",
    neighborhoods: [
      "Pelican",
      "Yacht Club",
      "Southwest Cape Coral",
      "Trafalgar",
      "Burnt Store",
      "Cape Harbour",
    ],
    conditions: {
      salt: "canal",
      housing:
        "overwhelmingly single-family homes on canal lots, with condensers sited close to brackish water",
      seasonal: false,
      stormImpact: true,
    },
  },
  {
    slug: "naples",
    city: "Naples",
    county: "Collier County",
    permitAuthority: "Collier County Growth Management Department",
    lat: 26.142,
    lng: -81.7948,
    zips: ["34102", "34103", "34104", "34105", "34112", "34113"],
    intro:
      "Licensed, insured air conditioning service for Naples homes and businesses — from routine maintenance near the Naples Pier to full system replacement throughout Old Naples and Port Royal. A great many Naples homes also sit empty for months, and an unoccupied house in July is where humidity damage starts.",
    neighborhoods: [
      "Old Naples",
      "Port Royal",
      "Coquina Sands",
      "Aqualane Shores",
      "Golden Gate",
      "East Naples",
    ],
    conditions: {
      salt: "gulf",
      housing:
        "high-value coastal homes, many of them closed up for months at a time",
      seasonal: true,
      stormImpact: false,
    },
  },
  {
    slug: "north-naples",
    city: "North Naples",
    county: "Collier County",
    permitAuthority: "Collier County Growth Management Department",
    lat: 26.2637,
    lng: -81.8009,
    zips: ["34108", "34109", "34110", "34119"],
    intro:
      "North Naples' mix of high-rise condos along Vanderbilt Beach, established communities like Pelican Bay and Pelican Marsh, and the retail corridor around Mercato all place heavy, near-continuous demand on air conditioning systems. Salt air off Wiggins Pass and Barefoot Beach adds corrosion on top of that load.",
    neighborhoods: [
      "Pelican Bay",
      "Vanderbilt Beach",
      "Naples Park",
      "Pelican Marsh",
      "Tarpon Cove",
      "Wiggins Bay",
    ],
    conditions: {
      salt: "gulf",
      housing:
        "a mix of beachfront high-rise condos and established gated communities",
      seasonal: true,
      stormImpact: false,
    },
  },
  {
    slug: "bonita-springs",
    city: "Bonita Springs",
    county: "Lee County",
    permitAuthority: "City of Bonita Springs Building Department",
    lat: 26.3398,
    lng: -81.7787,
    zips: ["34134", "34135"],
    intro:
      "Licensed, insured air conditioning service for Bonita Springs homes and businesses — from routine maintenance near Barefoot Beach Preserve to full system replacement throughout Downtown Bonita Springs and Bonita Beach. Gulf-front humidity means condensate lines here need cleaning more often than inland homes.",
    neighborhoods: [
      "Downtown Bonita Springs",
      "Bonita Beach",
      "Spring Creek",
      "Bonita Farms",
      "Village Walk",
      "Worthington",
    ],
    conditions: {
      salt: "gulf",
      housing:
        "gulf-front homes and inland golf communities within a few miles of each other",
      seasonal: true,
      stormImpact: false,
    },
  },
  {
    slug: "estero",
    city: "Estero",
    county: "Lee County",
    permitAuthority: "Village of Estero Building Department",
    lat: 26.4381,
    lng: -81.8068,
    zips: ["33928", "33967"],
    intro:
      "Estero's rapid growth around Coconut Point and Miromar Outlets has brought a mix of established communities like The Brooks and Grandezza alongside newer construction in Corkscrew Shores and Copperleaf. Newer builds bring newer equipment, which makes warranty-correct maintenance worth doing properly.",
    neighborhoods: [
      "The Brooks",
      "Grandezza",
      "Breckenridge",
      "Copperleaf",
      "Corkscrew Shores",
      "Downtown Estero",
    ],
    conditions: {
      salt: "inland",
      housing:
        "predominantly post-2000 construction, much of it still inside the manufacturer warranty window",
      seasonal: false,
      stormImpact: false,
    },
  },
  {
    slug: "punta-gorda",
    city: "Punta Gorda",
    county: "Charlotte County",
    permitAuthority: "Charlotte County Community Development",
    lat: 26.8979,
    lng: -82.0454,
    zips: ["33950", "33955", "33982", "33983"],
    intro:
      "Punta Gorda's waterfront homes along Charlotte Harbor and Punta Gorda Isles, along with the historic homes near Gilchrist Park and downtown, all rely on Coast to Coast for HVAC maintenance, repair, and replacement. Storm seasons have left a lot of systems running on replaced parts rather than replaced equipment.",
    neighborhoods: [
      "Historic Downtown Punta Gorda",
      "Punta Gorda Isles",
      "Burnt Store Isles",
      "Punta Gorda Heights",
      "Trabue Woods",
    ],
    conditions: {
      salt: "canal",
      housing:
        "harbour-front and canal homes alongside a historic downtown core",
      seasonal: false,
      stormImpact: true,
    },
  },
  {
    slug: "port-charlotte",
    city: "Port Charlotte",
    county: "Charlotte County",
    permitAuthority: "Charlotte County Community Development",
    lat: 26.9762,
    lng: -82.0906,
    zips: ["33948", "33952", "33953", "33954", "33980", "33981"],
    intro:
      "Port Charlotte's canal-front homes near Port Charlotte Beach Park, the growing Deep Creek area, and neighborhoods throughout South Port Charlotte and Port Charlotte West all trust Coast to Coast for HVAC maintenance, repair, and replacement. The housing stock skews older, so original air handlers are a common find here.",
    neighborhoods: [
      "South Port Charlotte",
      "Port Charlotte West",
      "El Jobean",
      "Deep Creek",
      "Harbor Heights",
    ],
    conditions: {
      salt: "canal",
      housing:
        "an older housing stock where original air handlers and undersized electrical service are common",
      seasonal: false,
      stormImpact: true,
    },
  },
];

export const locationBySlug = (slug: string) =>
  locations.find((l) => l.slug === slug);

// --------------------------------------------------------------------- proof

/** Hero trust strip — matches the three badges in the brand design. */
export const heroBadges = [
  { icon: "shield", title: "Licensed", sub: "& Insured" },
  { icon: "star", title: "5-Star", sub: "Rated" },
  { icon: "zap", title: "24/7", sub: "Emergency Service" },
] as const;

export const whyUs = [
  {
    icon: "users",
    title: "Experienced & Certified Technicians",
    body: "Licensed mechanical contractors, not subcontracted labor. Every technician who shows up works for us.",
  },
  {
    icon: "shield",
    title: "Honest, Upfront Pricing",
    body: "You get a flat price in writing before any work starts, and it does not move because the job ran long.",
  },
  {
    icon: "handshake",
    title: "Local & Family Operated",
    body: "Based in Fort Myers and answering our own phones. No national call center, no dispatch queue in another state.",
  },
  {
    icon: "map",
    title: "Serving All of Southwest Florida",
    body: "Lee, Collier and Charlotte counties — from Port Charlotte down through Naples, coast to coast.",
  },
] as const;

/**
 * ⚠️ CONFIRM — the first review is adapted from the company's published
 * testimonials; the other two are placeholders. Replace them with real,
 * attributable Google reviews before launch.
 */
export const testimonials = [
  {
    quote:
      "They handled our HVAC installation start to finish and walked us through what we'd actually save. The energy difference showed up on the very first bill.",
    name: "James T.",
    city: "Fort Myers, FL",
  },
  {
    quote:
      "Called with no cooling and had a technician out the same day. Flat price before he opened the panel, no upsell, no drama. Exactly what you want.",
    name: "Maria S.",
    city: "Naples, FL",
  },
  {
    quote:
      "The Clean & Tune caught a failing capacitor before it left us without AC in August. Worth every penny for that alone.",
    name: "Linda K.",
    city: "Cape Coral, FL",
  },
] as const;

export const process = [
  {
    title: "Tell us what's happening",
    body: "Two minutes on the phone or the form. We ask what the system is doing, not for your life story.",
  },
  {
    title: "We diagnose and price it",
    body: "A technician finds the actual cause and gives you a flat price in writing before any work begins.",
  },
  {
    title: "The work gets done right",
    body: "Repairs finish the same visit whenever the part is on the truck, and we leave the space cleaner than we found it.",
  },
  {
    title: "We follow up",
    body: "A check-in after the work, and a reminder when your next Clean & Tune comes due.",
  },
] as const;

export const guarantees = [
  `Licensed and insured — Florida Mechanical Contractor #${business.license}`,
  "Flat-rate pricing quoted in writing before work begins",
  "Permits pulled and inspections scheduled on every replacement",
  "Locally owned and operated out of Fort Myers",
] as const;

// ---------------------------------------------------------------- financing

/** ⚠️ CONFIRM every line below with the client before launch. */
export const financing = {
  intro:
    "A system replacement is rarely something you plan for. Financing options are available on approved credit so a failed system doesn't have to become a five-figure decision made in a single afternoon.",
  points: [
    {
      title: "Apply in minutes",
      body: "A short application with a decision in most cases the same day, so you know your options before you choose equipment.",
    },
    {
      title: "Monthly payments that fit",
      body: "Terms chosen around your budget rather than around the invoice, with no prepayment penalty.",
    },
    {
      title: "Ask about current promotions",
      body: "Manufacturer rebates and seasonal promotions change through the year. Call and we will tell you what's available right now.",
    },
  ],
} as const;

// --------------------------------------------------------------------- faqs

export const generalFaqs = [
  {
    q: "What areas do you serve?",
    a: `All of ${region} — Lee, Collier and Charlotte counties, including ${locations
      .map((l) => l.city)
      .slice(0, 4)
      .join(", ")} and everywhere between.`,
  },
  {
    q: "Are you licensed and insured?",
    a: `Yes. Coast to Coast holds Florida Mechanical Contractor license ${business.license}, along with CRC1335475 and CCC1336116, and carries liability and workers' compensation coverage. Certificates are available on request.`,
  },
  {
    q: "How much does AC maintenance cost?",
    a: `Our AC Clean & Tune maintenance visit is ${cleanAndTune.price} ${cleanAndTune.unit}. It's a 10-point inspection and service covering the thermostat, filter, condensate drains, capacitor, coils and a full system diagnostic.`,
  },
  {
    q: "How often should I service my AC?",
    a: "Twice a year. Southwest Florida's humidity and near-year-round cooling season put more strain on AC systems than cooler climates, so regular maintenance matters more here than it would up north.",
  },
  {
    q: "Do you offer financing?",
    a: "Yes, on system replacements and larger repairs, with decisions in most cases the same day. Call us and we'll walk through the options.",
  },
  {
    q: "Do I need a permit to replace my AC system?",
    a: "Yes — Florida building code requires a permit for HVAC system replacement. We handle permitting as part of every replacement we install.",
  },
] as const;

// -------------------------------------------------------------------- stats

/** Verifiable facts only — nothing here is an unbacked claim. */
export const stats = [
  { value: `${locations.length}`, label: "Southwest Florida cities served" },
  { value: `${business.licenses.length}`, label: "Florida contractor licenses held" },
  { value: cleanAndTune.price, label: "AC Clean & Tune, 10-point service" },
  { value: "24/7", label: "Emergency service availability" },
] as const;
