import { Link } from "wouter";
import {
  ArrowUpRight,
  CalendarCheck,
  Globe,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Star,
  Wallet,
  Wrench,
} from "lucide-react";
import {
  business,
  cleanAndTune,
  countyList,
  locations,
  region,
} from "@/content/site";
import { reviewLink } from "@/content/reviews";
import { Seo } from "@/lib/seo";
import { track } from "@/lib/leads";
import { cn } from "@/lib/utils";

/**
 * The link-in-bio page.
 *
 * Lives at /links because that is short enough to type into an Instagram
 * bio and obvious enough that nobody has to explain it.
 *
 * Built for one context and no other: a phone, held in one hand, two seconds
 * after somebody tapped a profile link. So it is a single centred column,
 * every target is at least 56px tall, the phone number is the first thing
 * under the name, and there is no navigation to get lost in. White ground
 * because a bio page that fights the app it opened from looks like an advert.
 *
 * Noindexed on purpose. It is thin by design and would only compete with the
 * home page for the brand term while saying less.
 */

interface BioLink {
  label: string;
  sub: string;
  href: string;
  Icon: typeof Phone;
  /** The one action the page is really for. */
  primary?: boolean;
  external?: boolean;
  onClick?: () => void;
}

export default function LinksPage() {
  const links: BioLink[] = [
    {
      label: `Book the ${cleanAndTune.price} Clean & Tune`,
      sub: "Ten points, written report, no upsell",
      href: "/#clean-and-tune",
      Icon: CalendarCheck,
      primary: true,
    },
    {
      label: "Request a quote",
      sub: "Tell us what it is doing and we will call back",
      href: "/contact",
      Icon: Wrench,
    },
    {
      label: "What we do",
      sub: "Repair, replacement, maintenance, air quality",
      href: "/services",
      Icon: Wrench,
    },
    {
      label: "Where we work",
      sub: `${locations.length} towns across ${countyList}`,
      href: "/locations",
      Icon: MapPin,
    },
    {
      label: "Financing",
      sub: "Work out the monthly figure before you commit",
      href: "/financing",
      Icon: Wallet,
    },
    ...(reviewLink.url
      ? [
          {
            label: "Leave us a Google review",
            sub: "Thirty seconds, and it genuinely helps",
            href: reviewLink.url,
            Icon: Star,
            external: true,
          } satisfies BioLink,
        ]
      : []),
    {
      label: "Full website",
      sub: business.url.replace(/^https?:\/\//, ""),
      href: "/",
      Icon: Globe,
    },
  ];

  return (
    <>
      <Seo
        title={`${business.name} — HVAC in ${region}`}
        description={`Licensed HVAC across ${region}. Call ${business.phone} for same-day repair, or book the ${cleanAndTune.price} Clean & Tune.`}
        path="/links"
        noindex
      />

      <main className="grid-lines-light relative min-h-dvh bg-white px-5 pb-16 pt-10">
        {/* A single warm wash behind the header, so a white page still reads
            as this company's white page. */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(70%_100%_at_50%_0%,rgb(43_217_255/0.14),transparent_70%)]"
          aria-hidden="true"
        />

        <div className="relative mx-auto w-full max-w-[26rem]">
          {/* ------------------------------------------------- identity */}
          <header className="text-center">
            <img
              src="/brand/logo-badge.webp"
              srcSet="/brand/logo-badge-sm.webp 400w, /brand/logo-badge.webp 800w"
              sizes="112px"
              alt={business.name}
              width={800}
              height={738}
              className="mx-auto h-28 w-auto drop-shadow-[0_12px_28px_rgb(7_26_61/0.22)]"
            />
            <h1 className="poster mt-5 text-[1.9rem] text-navy">
              {business.name}
            </h1>
            <p className="mt-2 text-[0.92rem] leading-relaxed text-navy/65">
              Licensed HVAC across {region}. Repair, replacement and
              maintenance — with a real person on the phone at any hour.
            </p>
            <div
              className="thermal-rule mx-auto mt-5 h-[3px] w-24"
              aria-hidden="true"
            />
          </header>

          {/* --------------------------------------------- call, first */}
          <a
            href={business.phoneHref}
            onClick={() => track("call", "Link in bio")}
            className="mt-7 flex min-h-[4.5rem] items-center gap-4 rounded-2xl bg-gradient-to-b from-orange-light to-ember px-5 text-white shadow-[var(--shadow-orange)] ring-1 ring-inset ring-white/25 transition-transform active:scale-[0.99]"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/20">
              <Phone className="size-5" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1 text-left">
              <span className="block font-display text-[1.25rem] font-extrabold leading-none">
                {business.phone}
              </span>
              <span className="mt-1 block text-[0.78rem] font-semibold text-white/85">
                Tap to call · {business.emergency}
              </span>
            </span>
          </a>

          {/* ------------------------------------------------ the links */}
          <nav className="mt-3 grid gap-3" aria-label="Quick links">
            {links.map((l) => {
              const inner = (
                <>
                  <span
                    className={cn(
                      "grid size-10 shrink-0 place-items-center rounded-xl",
                      l.primary ? "bg-blue text-white" : "bg-navy/5 text-navy/55",
                    )}
                  >
                    <l.Icon className="size-[1.1rem]" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1 text-left">
                    <span className="block font-display text-[0.95rem] font-extrabold leading-tight text-navy">
                      {l.label}
                    </span>
                    <span className="mt-0.5 block text-[0.78rem] leading-snug text-navy/55">
                      {l.sub}
                    </span>
                  </span>
                  <ArrowUpRight
                    className="size-4 shrink-0 text-navy/25"
                    aria-hidden="true"
                  />
                </>
              );

              const cls = cn(
                "flex min-h-[4.25rem] items-center gap-4 rounded-2xl bg-white px-4 ring-1 transition-all active:scale-[0.99]",
                l.primary
                  ? "shadow-[0_2px_4px_rgb(7_26_61/0.06),0_14px_30px_-16px_rgb(22_112_224/0.55)] ring-blue/30"
                  : "shadow-[0_1px_2px_rgb(7_26_61/0.05)] ring-navy/10",
              );

              return l.external ? (
                <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className={cls}>
                  {inner}
                </a>
              ) : (
                <Link key={l.label} href={l.href} className={cls}>
                  {inner}
                </Link>
              );
            })}
          </nav>

          {/* --------------------------------------------------- social */}
          <div className="mt-6 flex justify-center gap-3">
            <a
              href={business.social.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="grid size-12 place-items-center rounded-full bg-navy/5 text-navy/60 transition-colors hover:bg-navy/10 hover:text-navy"
            >
              <Instagram className="size-5" aria-hidden="true" />
            </a>
            <a
              href={`mailto:${business.email}`}
              aria-label="Email us"
              className="grid size-12 place-items-center rounded-full bg-navy/5 text-navy/60 transition-colors hover:bg-navy/10 hover:text-navy"
            >
              <Mail className="size-5" aria-hidden="true" />
            </a>
            <a
              href={business.sister.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`${business.sister.name} — ${business.sister.trade}`}
              className="grid size-12 place-items-center rounded-full bg-navy/5 text-navy/60 transition-colors hover:bg-navy/10 hover:text-navy"
            >
              <Globe className="size-5" aria-hidden="true" />
            </a>
          </div>

          {/* ----------------------------------------------------- facts */}
          <section className="mt-8 rounded-2xl bg-foam p-5 ring-1 ring-navy/8">
            <dl className="grid gap-2.5 text-[0.8rem]">
              {[
                ["Hours", `${business.hours} · ${business.emergency}`],
                ["Based in", `${business.street}, ${business.city}, ${business.state} ${business.zip}`],
                ["Email", business.email],
                ["Counties", countyList],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-3">
                  <dt className="w-[4.5rem] shrink-0 font-display text-[0.58rem] font-extrabold uppercase tracking-[0.14em] text-navy/40">
                    {k}
                  </dt>
                  <dd className="min-w-0 flex-1 leading-relaxed text-navy/70">{v}</dd>
                </div>
              ))}
            </dl>

            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-navy/10 pt-3.5">
              {business.licenses.map((l) => (
                <li key={l.number} className="leading-tight">
                  <span className="block font-display text-[0.52rem] font-extrabold uppercase tracking-[0.14em] text-navy/35">
                    {l.label}
                  </span>
                  <span className="mt-0.5 flex items-center gap-1.5">
                    <span
                      className="h-2.5 w-[2px] rounded-full bg-gradient-to-b from-cyan to-blue"
                      aria-hidden="true"
                    />
                    <span className="font-mono text-[0.72rem] font-semibold text-navy">
                      {l.number}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* The sister brand, named rather than left as an unlabelled icon. */}
          <p className="mt-5 text-center text-[0.76rem] leading-relaxed text-navy/45">
            Roofing or contracting instead?{" "}
            <a
              href={business.sister.url}
              target="_blank"
              rel="noreferrer"
              className="inline-block px-1 py-3 font-semibold text-blue"
            >
              {business.sister.name}
            </a>{" "}
            is the same company.
          </p>

          <p className="mt-6 text-center font-mono text-[0.56rem] uppercase tracking-[0.14em] text-navy/25">
            {business.lat.toFixed(3)}°N {Math.abs(business.lng).toFixed(3)}°W
          </p>
        </div>
      </main>
    </>
  );
}
