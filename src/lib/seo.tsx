import { Head, type HeadTag } from "./head";
import {
  business,
  cleanAndTune,
  googleReviews,
  hasReviewData,
  locations,
  region,
  services,
} from "@/content/site";

export interface SeoProps {
  title: string;
  description: string;
  /** Path beginning with "/". */
  path: string;
  image?: string;
  type?: "website" | "article";
  /** Page-specific @graph nodes; the business/site/page nodes are added here. */
  nodes?: Record<string, unknown>[];
  /** Extra geo meta for city pages — helps local search disambiguate. */
  geo?: { lat: number; lng: number; city: string; county: string };
  noindex?: boolean;
}

const origin = business.url.replace(/\/$/, "");

export function canonical(path: string): string {
  return path === "/" ? origin + "/" : origin + path;
}

/**
 * Google renders roughly 155 characters of a description. Anything past that
 * is invisible, so trim on a word boundary rather than shipping a long one and
 * hoping. Templates aim short; this is the backstop.
 */
export function clampDescription(text: string, max = 158): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const at = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf(" "));
  return cut.slice(0, at > 60 ? at : max).replace(/[,;:\s]+$/, "") + "\u2026";
}

function absolute(src: string): string {
  return src.startsWith("http") ? src : origin + src;
}

export function Seo({
  title,
  description,
  path,
  image,
  type = "website",
  nodes = [],
  geo,
  noindex = false,
}: SeoProps) {
  const url = canonical(path);
  const img = absolute(image ?? business.ogImage);
  const desc = clampDescription(description);

  const tags: HeadTag[] = [
    { tag: "title", text: title },
    { tag: "meta", attrs: { name: "description", content: desc } },
    { tag: "link", attrs: { rel: "canonical", href: url } },
    {
      tag: "meta",
      attrs: {
        name: "robots",
        content: noindex ? "noindex,nofollow" : "index,follow",
      },
    },
    { tag: "meta", attrs: { property: "og:type", content: type } },
    {
      tag: "meta",
      attrs: { property: "og:site_name", content: business.formalName },
    },
    { tag: "meta", attrs: { property: "og:title", content: title } },
    {
      tag: "meta",
      attrs: { property: "og:description", content: desc },
    },
    { tag: "meta", attrs: { property: "og:url", content: url } },
    { tag: "meta", attrs: { property: "og:image", content: img } },
    {
      tag: "meta",
      attrs: { name: "twitter:card", content: "summary_large_image" },
    },
    { tag: "meta", attrs: { name: "twitter:title", content: title } },
    {
      tag: "meta",
      attrs: { name: "twitter:description", content: desc },
    },
    { tag: "meta", attrs: { name: "twitter:image", content: img } },
  ];

  // Legacy geo meta. Modern crawlers read the JSON-LD instead, but several
  // local directories and aggregators still parse these.
  if (geo) {
    tags.push(
      { tag: "meta", attrs: { name: "geo.region", content: `US-${business.state}` } },
      { tag: "meta", attrs: { name: "geo.placename", content: geo.city } },
      { tag: "meta", attrs: { name: "geo.position", content: `${geo.lat};${geo.lng}` } },
      { tag: "meta", attrs: { name: "ICBM", content: `${geo.lat}, ${geo.lng}` } },
    );
  }

  if (!noindex) {
    tags.push({
      tag: "script",
      attrs: { type: "application/ld+json" },
      text: JSON.stringify(
        buildGraph({ title, description: desc, path, image: img, nodes }),
      ),
    });
  }

  return <Head tags={tags} />;
}

// ------------------------------------------------------------ JSON-LD graph
//
// Every page emits ONE script containing a linked @graph rather than a pile of
// disconnected blocks. Nodes reference each other by @id, so a crawler reads
// "this Service is provided by that HVACBusiness, described on this WebPage,
// which is part of this WebSite" instead of four unrelated assertions.

export const ID = {
  business: origin + "/#business",
  website: origin + "/#website",
  page: (path: string) => canonical(path) + "#webpage",
  breadcrumb: (path: string) => canonical(path) + "#breadcrumb",
  service: (path: string) => canonical(path) + "#service",
  faq: (path: string) => canonical(path) + "#faq",
} as const;

/** 50 miles from the Fort Myers office reaches every city we list. */
const SERVICE_RADIUS_M = 80467;

export function businessNode(): Record<string, unknown> {
  return {
    "@type": ["HVACBusiness", "LocalBusiness", "Organization"],
    "@id": ID.business,
    name: business.name,
    legalName: business.legalName,
    slogan: business.tagline,
    description: `Licensed, insured HVAC contractor serving ${region} — heating, cooling, mechanical, indoor air quality, maintenance and 24/7 emergency response.`,
    url: business.url,
    telephone: business.phone,
    email: business.email,
    priceRange: "$$",
    currenciesAccepted: "USD",
    image: { "@id": origin + "/#logo" },
    logo: { "@id": origin + "/#logo" },
    address: {
      "@type": "PostalAddress",
      streetAddress: business.street,
      addressLocality: business.city,
      addressRegion: business.state,
      postalCode: business.zip,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 26.5628,
      longitude: -81.8226,
    },
    areaServed: [
      {
        "@type": "GeoCircle",
        geoMidpoint: {
          "@type": "GeoCoordinates",
          latitude: 26.5628,
          longitude: -81.8226,
        },
        geoRadius: SERVICE_RADIUS_M,
      },
      ...locations.map((l) => ({
        "@type": "City",
        name: l.city,
        address: {
          "@type": "PostalAddress",
          addressLocality: l.city,
          addressRegion: business.state,
          addressCountry: "US",
        },
        geo: { "@type": "GeoCoordinates", latitude: l.lat, longitude: l.lng },
      })),
      ...[...new Set(locations.map((l) => l.county))].map((c) => ({
        "@type": "AdministrativeArea",
        name: c,
      })),
    ],
    hasCredential: business.licenses.map((l) => ({
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "license",
      name: `${l.label} ${l.number}`,
      recognizedBy: {
        "@type": "Organization",
        name: "Florida Department of Business and Professional Regulation",
      },
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `HVAC services in ${region}`,
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.name,
          description: s.blurb,
          url: canonical(`/services/${s.slug}`),
        },
      })),
    },
    makesOffer: {
      "@type": "Offer",
      name: cleanAndTune.name,
      description: cleanAndTune.summary,
      price: cleanAndTune.price.replace(/[^0-9.]/g, ""),
      priceCurrency: "USD",
      category: "HVAC maintenance",
    },
    knowsAbout: [
      "air conditioning repair",
      "HVAC replacement",
      "heat pumps",
      "indoor air quality",
      "ductwork",
      "commercial HVAC",
    ],
    sameAs: [
      business.social.google,
      business.social.facebook,
      business.social.instagram,
    ],
    // Emitted only when real Google figures have been supplied in
    // content/site.ts. Never invent these — fabricated ratings are a Google
    // policy violation and a manual-action risk.
    ...(hasReviewData()
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: googleReviews.rating,
            reviewCount: googleReviews.count,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "17:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday"],
        opens: "00:00",
        closes: "23:59",
        description: "Emergency service only",
      },
    ],
  };
}

function logoNode(): Record<string, unknown> {
  return {
    "@type": "ImageObject",
    "@id": origin + "/#logo",
    url: absolute(business.logo),
    contentUrl: absolute(business.logo),
    caption: business.name,
  };
}

function websiteNode(): Record<string, unknown> {
  return {
    "@type": "WebSite",
    "@id": ID.website,
    url: business.url,
    name: business.name,
    inLanguage: "en-US",
    publisher: { "@id": ID.business },
  };
}

function webPageNode(opts: {
  title: string;
  description: string;
  path: string;
  image: string;
  hasBreadcrumb: boolean;
}): Record<string, unknown> {
  return {
    "@type": "WebPage",
    "@id": ID.page(opts.path),
    url: canonical(opts.path),
    name: opts.title,
    description: opts.description,
    inLanguage: "en-US",
    isPartOf: { "@id": ID.website },
    about: { "@id": ID.business },
    primaryImageOfPage: { "@id": origin + "/#logo" },
    ...(opts.hasBreadcrumb
      ? { breadcrumb: { "@id": ID.breadcrumb(opts.path) } }
      : {}),
    // Answer engines and voice assistants read these first.
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "[data-answer]"],
    },
  };
}

// ------------------------------------------------------------- page helpers

export function breadcrumbNode(
  path: string,
  items: { name: string; path: string }[],
): Record<string, unknown> {
  return {
    "@type": "BreadcrumbList",
    "@id": ID.breadcrumb(path),
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: canonical(it.path),
    })),
  };
}

export function serviceNode(opts: {
  name: string;
  description: string;
  path: string;
  /** Omit for region-wide; pass a city for a local landing page. */
  city?: { city: string; lat: number; lng: number; county: string };
  offers?: boolean;
}): Record<string, unknown> {
  return {
    "@type": "Service",
    "@id": ID.service(opts.path),
    serviceType: opts.name,
    name: opts.name,
    description: opts.description,
    url: canonical(opts.path),
    provider: { "@id": ID.business },
    areaServed: opts.city
      ? {
          "@type": "City",
          name: opts.city.city,
          address: {
            "@type": "PostalAddress",
            addressLocality: opts.city.city,
            addressRegion: business.state,
            addressCountry: "US",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: opts.city.lat,
            longitude: opts.city.lng,
          },
          containedInPlace: {
            "@type": "AdministrativeArea",
            name: opts.city.county,
          },
        }
      : { "@type": "AdministrativeArea", name: region },
    ...(opts.offers
      ? {
          offers: {
            "@type": "Offer",
            name: cleanAndTune.name,
            price: cleanAndTune.price.replace(/[^0-9.]/g, ""),
            priceCurrency: "USD",
          },
        }
      : {}),
  };
}

export function faqNode(
  path: string,
  faqs: readonly { q: string; a: string }[],
): Record<string, unknown> {
  return {
    "@type": "FAQPage",
    "@id": ID.faq(path),
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/**
 * Assemble the full graph for one page: the shared business/site/logo nodes
 * plus whatever this page contributes.
 */
export function buildGraph(opts: {
  title: string;
  description: string;
  path: string;
  image: string;
  nodes: Record<string, unknown>[];
}): Record<string, unknown> {
  const hasBreadcrumb = opts.nodes.some((n) => n["@type"] === "BreadcrumbList");
  return {
    "@context": "https://schema.org",
    "@graph": [
      businessNode(),
      logoNode(),
      websiteNode(),
      webPageNode({ ...opts, hasBreadcrumb }),
      ...opts.nodes,
    ],
  };
}
