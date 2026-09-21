/**
 * Local content derivation.
 *
 * The 48 service × city pages would otherwise be the same page with a city
 * name swapped in — which search engines treat as doorway content and which
 * gives an answer engine nothing worth citing. Everything here derives page
 * copy from facts that genuinely differ between these cities: which office
 * issues the permit, whether condensers sit on brackish water, how old the
 * housing stock is, whether homes sit empty for months, and whether the area
 * took a direct hit in 2022.
 *
 * Nothing here invents a claim. Each branch restates a documented condition
 * from `Location.conditions`, the county permitting authority, or the
 * company's own published service description.
 */
import type { Location, SaltExposure, Service } from "./site";
import { business, cleanAndTune } from "./site";

// ------------------------------------------------------------- salt context

const SALT: Record<SaltExposure, { short: string; detail: string; cadence: string }> = {
  canal: {
    short: "canal-front salt exposure",
    detail:
      "Condensers here sit close to brackish water, and salt in the air pits condenser coils and fin stock years earlier than it would inland.",
    cadence:
      "We rinse and coat coastal coils on maintenance visits for exactly that reason.",
  },
  gulf: {
    short: "gulf-front salt air",
    detail:
      "Salt carried in off the Gulf settles on outdoor coils and shortens their service life, and the same humidity loads the condensate system harder than an inland home.",
    cadence:
      "That moves the useful maintenance interval closer to twice a year than once.",
  },
  inland: {
    short: "inland humidity rather than salt",
    detail:
      "Set back from open water, equipment here escapes the worst of the salt corrosion — humidity and runtime are what wear these systems out.",
    cadence:
      "Coil life runs closer to the top of the 10–15 year range as a result.",
  },
};

export const saltNote = (loc: Location) => SALT[loc.conditions.salt];

// ------------------------------------------------- per-service local angles

/**
 * Two or three sentences of genuinely local context for one service in one
 * city, composed from that city's documented conditions.
 */
export function cityServiceAngle(loc: Location, service: Service): string {
  const salt = saltNote(loc);
  const { seasonal, stormImpact, housing } = loc.conditions;

  switch (service.slug) {
    case "heating":
      return seasonal
        ? `Heat runs a handful of nights a year in ${loc.city}, and in a neighbourhood of ${housing} it often runs in a house nobody is standing in. A failed heat strip in an empty home goes unnoticed until someone arrives to a cold house, which is why we test heating operation during maintenance rather than waiting for a call.`
        : `${loc.city} homes run heat only a few nights each winter, so a failed reversing valve or heat strip usually announces itself on the first genuinely cold night. Because the same outdoor unit both heats and cools, a heating fault here is frequently a cooling fault you have not met yet.`;

    case "cooling":
      return `Cooling runs close to year-round in ${loc.county}, which is why systems here last 10–15 years rather than twenty. With ${salt.short}, ${loc.city} sits at the shorter end of that range — ${salt.detail.charAt(0).toLowerCase()}${salt.detail.slice(1)}`;

    case "mechanical":
      return stormImpact
        ? `${loc.city} took direct damage in 2022, and a great deal of the mechanical work here is still catching up: elevated pads, hurricane-rated condenser mounts, and ductwork that was wet at some point and never properly dried. Permits for that work go through ${loc.permitAuthority}.`
        : `Mechanical work in ${loc.city} means the parts nobody photographs — ductwork, air handlers, condensate systems, disconnects and the pad the condenser stands on. In a housing stock of ${housing}, duct condition is usually the thing limiting what a new system can actually deliver. Permits run through ${loc.permitAuthority}.`;

    case "repairs-maintenance":
      return `Maintenance earns its keep faster in ${loc.city} than almost anywhere. ${salt.detail} ${salt.cadence} Our ${cleanAndTune.price} ${cleanAndTune.name} is the same 10-point service everywhere we work — what changes here is how quickly the coils and drain line need attention.`;

    case "commercial-hvac":
      return seasonal
        ? `Commercial work in ${loc.city} follows the season. Restaurants, retail and medical offices carry their heaviest load exactly when the population peaks, so we schedule the service that keeps equipment out of emergency status for the shoulder months instead.`
        : `For a ${loc.city} business an HVAC failure is lost revenue, not discomfort. We cover light commercial, HOA communities and assisted living across ${loc.county}, and we schedule around opening hours wherever the work allows.`;

    case "indoor-air-quality":
      return seasonal
        ? `The air quality problem in ${loc.city} is humidity, and it is worst in the homes nobody is living in. A closed-up house in July is where mould in the ductwork starts, so we measure humidity and fix the cause — drainage, duct leakage, a system short-cycling — rather than selling a filter.`
        : `Humidity, not dust, is the real air quality issue in ${loc.city}. ${salt.detail} That same moisture load clogs condensate drains faster than an inland home, which is where mould growth in a duct system usually begins.`;

    default:
      return loc.intro;
  }
}

/**
 * The one-sentence direct answer that opens a service × city page — written to
 * be quotable on its own by a search snippet or an answer engine.
 */
export function cityServiceAnswer(loc: Location, service: Service): string {
  const label = service.short.toLowerCase();
  return `${business.name} provides ${label} in ${loc.city}, ${business.state} and across ${loc.county}, serving ${loc.neighborhoods.slice(0, 3).join(", ")} and ZIP codes ${loc.zips.slice(0, 3).join(", ")}. We are licensed under Florida Mechanical Contractor #${business.license}, quote flat rates before work begins, and answer 24/7 for emergencies at ${business.phone}.`;
}

/** The same, for a city landing page covering every service. */
export function cityAnswer(loc: Location): string {
  return `${business.name} is a licensed HVAC contractor serving ${loc.city}, ${business.state} — heating, cooling, mechanical, indoor air quality and 24/7 emergency service across ${loc.county}. We cover ${loc.neighborhoods.slice(0, 4).join(", ")} and ZIP codes ${loc.zips.join(", ")}, hold Florida Mechanical Contractor licence #${business.license}, and charge ${cleanAndTune.price} for the ${cleanAndTune.name}.`;
}

// ------------------------------------------------------ city-specific FAQs

/**
 * FAQs whose answers actually change city to city — permitting office, salt
 * cadence, ZIP coverage. Reusing one generic FAQ set across eight city pages
 * produces eight identical FAQPage blocks, which is worth nothing.
 */
export function cityFaqs(loc: Location): { q: string; a: string }[] {
  const salt = saltNote(loc);
  const faqs = [
    {
      q: `Do you need a permit to replace an AC system in ${loc.city}?`,
      a: `Yes. Florida building code requires a permit for HVAC system replacement, and in ${loc.city} that permit is issued by ${loc.permitAuthority}. We pull it and schedule the inspection as part of every replacement we install.`,
    },
    {
      q: `How often should an AC be serviced in ${loc.city}?`,
      a: `Twice a year. ${salt.detail} ${salt.cadence} Our ${cleanAndTune.name} is ${cleanAndTune.price} per visit and covers a 10-point inspection of the thermostat, filter, condensate drains, capacitor, coils and full system diagnostics.`,
    },
    {
      q: `Which ${loc.city} ZIP codes do you cover?`,
      a: `We cover ${loc.zips.join(", ")}, along with ${loc.neighborhoods.slice(0, 4).join(", ")} and the addresses in between. If you are not sure whether you are in range, call ${business.phone} and ask.`,
    },
    {
      q: `How long does an AC system last in ${loc.city}?`,
      a: `Most residential systems in ${loc.county} last 10–15 years given near-constant summer runtime. With ${salt.short}, ${loc.city} tends toward ${loc.conditions.salt === "inland" ? "the upper" : "the lower"} end of that range.`,
    },
  ];

  if (loc.conditions.stormImpact) {
    faqs.push({
      q: `Can you document HVAC damage for an insurance claim in ${loc.city}?`,
      a: `Yes. ${loc.city} took direct damage in 2022 and a lot of equipment here is still running on replaced parts rather than replaced systems. We document system condition in writing on every visit, which is what carriers ask for.`,
    });
  }

  if (loc.conditions.seasonal) {
    faqs.push({
      q: `What should I set the thermostat to in a ${loc.city} home that sits empty?`,
      a: `Hold indoor humidity between 45% and 55% rather than chasing a temperature. An unoccupied ${loc.city} house in July is where humidity damage starts, and a system left fully off will do more expensive harm than the runtime would have cost.`,
    });
  }

  return faqs;
}

/** Fact rows rendered as a table — the shape answer engines extract cleanly. */
export function cityFacts(loc: Location): { label: string; value: string }[] {
  return [
    { label: "County", value: loc.county },
    { label: "Permit authority", value: loc.permitAuthority },
    { label: "ZIP codes served", value: loc.zips.join(", ") },
    { label: "Neighborhoods", value: loc.neighborhoods.join(", ") },
    { label: "Coastal exposure", value: saltNote(loc).short },
    { label: "Typical system life", value: "10–15 years" },
    { label: "Maintenance", value: `${cleanAndTune.name} — ${cleanAndTune.price} per visit` },
    { label: "Licence", value: `Florida Mechanical Contractor #${business.license}` },
    { label: "Emergency service", value: `24/7 — ${business.phone}` },
  ];
}
