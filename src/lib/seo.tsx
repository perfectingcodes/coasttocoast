import { Head, type HeadTag } from "./head";
import { business, locations, region } from "@/content/site";

export interface SeoProps {
  title: string;
  description: string;
  /** Path beginning with "/". */
  path: string;
  image?: string;
  type?: "website" | "article";
  jsonLd?: Record<string, unknown>[];
  noindex?: boolean;
}

const origin = business.url.replace(/\/$/, "");

export function canonical(path: string): string {
  return path === "/" ? origin + "/" : origin + path;
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
  jsonLd = [],
  noindex = false,
}: SeoProps) {
  const url = canonical(path);
  const img = absolute(image ?? business.ogImage);

  const tags: HeadTag[] = [
    { tag: "title", text: title },
    { tag: "meta", attrs: { name: "description", content: description } },
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
      attrs: { property: "og:description", content: description },
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
      attrs: { name: "twitter:description", content: description },
    },
    { tag: "meta", attrs: { name: "twitter:image", content: img } },
  ];

  for (const obj of jsonLd) {
    tags.push({
      tag: "script",
      attrs: { type: "application/ld+json" },
      text: JSON.stringify(obj),
    });
  }

  return <Head tags={tags} />;
}

// --------------------------------------------------------- JSON-LD builders

export function localBusinessJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "HVACBusiness",
    "@id": origin + "/#business",
    name: business.name,
    legalName: business.legalName,
    slogan: business.tagline,
    description: `Licensed, insured HVAC service across ${region} — heating, cooling, mechanical, indoor air quality, maintenance and 24/7 emergency response.`,
    image: absolute(business.ogImage),
    logo: absolute(business.logo),
    url: business.url,
    telephone: business.phone,
    email: business.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: business.street,
      addressLocality: business.city,
      addressRegion: business.state,
      postalCode: business.zip,
      addressCountry: "US",
    },
    areaServed: locations.map((l) => ({ "@type": "City", name: l.city })),
    // Licence numbers as published by the Florida DBPR.
    hasCredential: business.licenses.map((l) => ({
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "license",
      name: `${l.label} ${l.number}`,
    })),
    sameAs: [
      business.social.google,
      business.social.facebook,
      business.social.instagram,
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "17:00",
      },
    ],
  };
}

/** The published Clean & Tune price, as a real Offer. */
export function offerJsonLd(opts: {
  name: string;
  description: string;
  price: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: opts.name,
    description: opts.description,
    price: opts.price.replace(/[^0-9.]/g, ""),
    priceCurrency: "USD",
    availableAtOrFrom: { "@id": origin + "/#business" },
    seller: { "@id": origin + "/#business" },
  };
}

export function serviceJsonLd(opts: {
  name: string;
  description: string;
  path: string;
  areaServed?: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: opts.name,
    name: opts.name,
    description: opts.description,
    url: canonical(opts.path),
    provider: { "@id": origin + "/#business" },
    areaServed: {
      "@type": "AdministrativeArea",
      name: opts.areaServed ?? region,
    },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: canonical(it.path),
    })),
  };
}

export function faqJsonLd(
  faqs: readonly { q: string; a: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
