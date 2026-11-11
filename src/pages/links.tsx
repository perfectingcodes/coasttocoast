import { Link } from "wouter";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarCheck,
  ChevronRight,
  ClipboardList,
  Facebook,
  Globe,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Star,
  Wrench,
} from "lucide-react";
import { business, countyList, locations, region } from "@/content/site";
import { reviewLink } from "@/content/reviews";
import { useBooking, type BookingIntent } from "@/lib/booking";
import { Seo } from "@/lib/seo";
import { track } from "@/lib/leads";

/**
 * The link-in-bio page.
 *
 * Lives at /links because that is short enough to type into an Instagram
 * bio and obvious enough that nobody has to explain it.
 *
 * Built for one context: a phone, in one hand, two seconds after somebody
 * tapped a profile link. That person will do one of two things — call, or
 * look at the website — so those are the two buttons, at full width, before
 * anything else. Everything after them is for the few who want something
 * more specific, and is set smaller so it cannot be mistaken for the point.
 *
 * White ground on purpose: a bio page that fights the app it opened from
 * looks like an advert. The brand is carried by the badge, the thermal rule,
 * the type and three photographs of real work.
 *
 * Noindexed. It is thin by design and would only compete with the home page
 * for the brand term while saying less.
 */

const site = business.url.replace(/^https?:\/\//, "");

/** Real jobs, so the page shows the work before the visitor has to go and
 *  look for it. Square crops of the photographs the site already carries. */
const FIELD = [
  {
    src: "/brand/photo-rtu-service-640.webp",
    alt: "A technician servicing a commercial rooftop unit",
    focus: "object-[58%_50%]",
  },
  {
    src: "/brand/photo-controls-640.webp",
    alt: "An open HVAC control panel with controllers and wiring",
    focus: "object-center",
  },
  {
    src: "/brand/photo-unit-tagged-640.webp",
    alt: "A rooftop condenser labelled with its unit number",
    focus: "object-[50%_30%]",
  },
] as const;

export default function LinksPage() {
  const booking = useBooking();

  /** Open the form over this page; fall back to the contact page if the
   *  pop-up is not available. */
  const popup = (intent: BookingIntent, source: string) => (e: React.MouseEvent) => {
    if (!booking) return;
    e.preventDefault();
    booking.open(intent, source);
  };

  return (
    <>
      <Seo
        title={`${business.name} — HVAC in ${region}`}
        description={`Commercial and mechanical HVAC across ${region}. Call ${business.phone}, or book a free equipment walk.`}
        path="/links"
        noindex
      />

      <main className="min-h-dvh bg-white text-navy">
        {/* The brand's own rule along the top edge: the one stripe of colour
            a white page needs to belong to somebody. */}
        <div className="thermal-rule h-1 w-full rounded-none" aria-hidden="true" />

        <div className="mx-auto w-full max-w-[27rem] px-5 pb-10 pt-9">
          {/* ------------------------------------------------- identity */}
          <header className="text-center">
            <img
              src="/brand/logo-badge.webp"
              srcSet="/brand/logo-badge-sm.webp 400w, /brand/logo-badge.webp 1000w"
              sizes="128px"
              alt={business.name}
              width={1000}
              height={922}
              fetchPriority="high"
              className="mx-auto h-[7.5rem] w-auto drop-shadow-[0_10px_22px_rgb(7_26_61/0.2)]"
            />
            <h1 className="poster mt-5 text-[1.85rem] text-navy">{business.name}</h1>
            <p className="mt-2 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-blue">
              Commercial &amp; mechanical HVAC
            </p>
            <p className="mt-1.5 text-[0.9rem] text-navy/60">
              {business.city}, Florida · {countyList} counties
            </p>

            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-foam px-3.5 py-1.5 text-[0.78rem] font-semibold text-navy ring-1 ring-navy/8">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500/60 motion-reduce:hidden" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              A person answers, 24/7
            </p>
          </header>

          {/* ------------------------------------------ the two actions */}
          <div className="mt-7 grid gap-3">
            <a
              href={business.phoneHref}
              onClick={() => track("call", "Link in bio")}
              className="flex min-h-[4.75rem] items-center gap-4 rounded-2xl bg-[#f25a0b] px-5 text-white shadow-[0_14px_28px_-14px_rgb(242_90_11/0.75)] transition-transform active:scale-[0.985]"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/18 ring-1 ring-inset ring-white/25">
                <Phone className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[0.78rem] font-semibold text-white/85">
                  Tap to call
                </span>
                <span className="block font-display text-[1.4rem] font-extrabold leading-tight">
                  {business.phone}
                </span>
              </span>
              <ArrowRight className="size-5 shrink-0 text-white/80" aria-hidden="true" />
            </a>

            <Link
              href="/"
              className="flex min-h-[4.75rem] items-center gap-4 rounded-2xl bg-navy px-5 text-white shadow-[0_14px_28px_-16px_rgb(7_26_61/0.8)] transition-transform active:scale-[0.985]"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10 ring-1 ring-inset ring-white/20">
                <Globe className="size-5 text-cyan" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[0.78rem] font-semibold text-white/70">
                  Visit the website
                </span>
                <span className="block font-display text-[1.15rem] font-extrabold leading-tight">
                  {site}
                </span>
              </span>
              <ArrowRight className="size-5 shrink-0 text-white/70" aria-hidden="true" />
            </Link>
          </div>

          {/* ---------------------------------------------- the rest */}
          <p className="mt-8 font-mono text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-navy/40">
            Or go straight to
          </p>
          <nav
            aria-label="More links"
            className="mt-2.5 divide-y divide-navy/8 overflow-hidden rounded-2xl bg-white ring-1 ring-navy/10"
          >
            <Row
              href="/contact"
              onClick={popup("walk", "Link in bio")}
              Icon={ClipboardList}
              label="Book a free equipment walk"
              sub="Every unit checked. You keep the list"
              accent
            />
            <Row
              href="/contact"
              onClick={popup("quote", "Link in bio")}
              Icon={CalendarCheck}
              label="Request a quote"
              sub="Two minutes. We call you back"
            />
            <Row
              href="/services"
              Icon={Wrench}
              label="What we do"
              sub="Rooftop units, air handlers, agreements"
            />
            <Row
              href="/locations"
              Icon={MapPin}
              label="Where we work"
              sub={`${locations.length} cities across Southwest Florida`}
            />
            <Row
              href={`mailto:${business.email}`}
              Icon={Mail}
              label="Email us"
              sub={business.email}
              external
            />
            {reviewLink.url && (
              <Row
                href={reviewLink.url}
                Icon={Star}
                label="Leave a Google review"
                sub="Thirty seconds, and it helps"
                external
                newTab
              />
            )}
          </nav>

          {/* ------------------------------------------------ the work */}
          <Link href="/" className="group mt-8 block" aria-label="See our work on the website">
            <div className="flex items-end justify-between">
              <p className="font-mono text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-navy/40">
                From the field
              </p>
              <span className="flex items-center gap-1 text-[0.78rem] font-bold text-blue">
                See more
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </span>
            </div>
            <div className="mt-2.5 grid grid-cols-3 gap-2">
              {FIELD.map((f) => (
                <img
                  key={f.src}
                  src={f.src}
                  alt={f.alt}
                  width={640}
                  height={640}
                  className={`aspect-square w-full rounded-xl object-cover ring-1 ring-navy/10 ${f.focus}`}
                />
              ))}
            </div>
          </Link>

          {/* --------------------------------------------------- facts */}
          <dl className="mt-8 grid gap-3 border-t border-navy/10 pt-6 text-[0.84rem]">
            {[
              ["Hours", `${business.hours} · ${business.emergency}`],
              ["Office", `${business.street}, ${business.city}, ${business.state} ${business.zip}`],
              ["Licence", `Florida Mechanical Contractor ${business.license}`],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-4">
                <dt className="w-16 shrink-0 pt-0.5 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-navy/40">
                  {k}
                </dt>
                <dd className="min-w-0 flex-1 leading-relaxed text-navy/75">{v}</dd>
              </div>
            ))}
          </dl>

          {/* -------------------------------------------------- social */}
          <div className="mt-7 flex items-center justify-center gap-3">
            {[
              { href: business.social.instagram, label: "Instagram", Icon: Instagram },
              { href: business.social.facebook, label: "Facebook", Icon: Facebook },
            ]
              // A profile, not a platform's front page: an address with no
              // handle on the end is a placeholder and goes nowhere useful.
              .filter((s) => new URL(s.href).pathname.length > 1)
              .map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={label}
                  className="grid size-12 place-items-center rounded-full text-navy/55 ring-1 ring-navy/12 transition-colors hover:bg-foam hover:text-navy"
                >
                  <Icon className="size-5" aria-hidden="true" />
                </a>
              ))}
          </div>

          {/* The sister brand, named rather than left as an unlabelled icon. */}
          <p className="mt-6 text-center text-[0.78rem] leading-relaxed text-navy/50">
            Roofing or contracting instead?{" "}
            <a
              href={business.sister.url}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-block py-2 font-semibold text-blue"
            >
              {business.sister.name}
            </a>{" "}
            is the same company.
          </p>

          <p className="mt-4 text-center font-mono text-[0.58rem] uppercase tracking-[0.14em] text-navy/30">
            © {new Date().getFullYear()} {business.name}
          </p>
        </div>
      </main>
    </>
  );
}

function Row({
  href,
  label,
  sub,
  Icon,
  onClick,
  accent,
  external,
  newTab,
}: {
  href: string;
  label: string;
  sub: string;
  Icon: typeof Phone;
  onClick?: (e: React.MouseEvent) => void;
  /** The one secondary action worth a little colour. */
  accent?: boolean;
  external?: boolean;
  newTab?: boolean;
}) {
  const cls =
    "flex min-h-[4rem] items-center gap-3.5 px-4 py-2.5 transition-colors active:bg-foam";
  const inner = (
    <>
      <span
        className={
          accent
            ? "grid size-10 shrink-0 place-items-center rounded-xl bg-blue text-white"
            : "grid size-10 shrink-0 place-items-center rounded-xl bg-foam text-blue"
        }
      >
        <Icon className="size-[1.1rem]" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-[0.95rem] font-extrabold leading-tight text-navy">
          {label}
        </span>
        <span className="mt-0.5 block truncate text-[0.78rem] text-navy/55">{sub}</span>
      </span>
      <ChevronRight className="size-4 shrink-0 text-navy/30" aria-hidden="true" />
    </>
  );
  return external ? (
    <a
      href={href}
      className={cls}
      {...(newTab ? { target: "_blank", rel: "noreferrer noopener" } : {})}
    >
      {inner}
    </a>
  ) : (
    <Link href={href} onClick={onClick} className={cls}>
      {inner}
    </Link>
  );
}
