import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  ArrowRight,
  ChevronDown,
  Clock,
  Facebook,
  Instagram,
  Menu,
  Phone,
  X,
} from "lucide-react";
import { business, cleanAndTune, locations, nav, services } from "@/content/site";
import { Icon } from "@/components/icon";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Circled "G" for the Google reviews link — deliberately not Google's mark. */
function GoogleG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <path
        d="M21 12.2c0 5-3.4 8.5-8.6 8.5A8.7 8.7 0 1 1 18.4 5.3l-2.5 2.4a5.2 5.2 0 1 0-3.5 9.1 4.5 4.5 0 0 0 4.7-3.5h-4.7v-3.2H21c.1.6.1 1.3 0 2.1Z"
        fill="currentColor"
      />
    </svg>
  );
}

const socials = [
  { href: business.social.facebook, label: "Facebook", Icon: Facebook },
  { href: business.social.instagram, label: "Instagram", Icon: Instagram },
  { href: business.social.google, label: "Google reviews", Icon: GoogleG },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Navbar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  // Close the mobile sheet on navigation.
  useEffect(() => setOpen(false), [location]);

  // Lock body scroll behind the mobile sheet.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-[70]">
      {/* ---------------------------------------------------- utility bar */}
      <div className="bg-navy-deep text-white">
        <div className="shell flex h-10 items-center justify-between gap-4">
          <p className="hidden text-xs font-semibold text-white/60 sm:block">
            Serving Lee, Collier &amp; Charlotte counties
          </p>
          <div className="flex flex-1 items-center justify-end gap-4">
            <span className="inline-flex items-center gap-2">
              <Clock className="size-3.5 text-orange" aria-hidden="true" />
              <span className="font-display text-[0.7rem] font-bold uppercase tracking-[0.16em] text-orange">
                24/7 Emergency Service
              </span>
            </span>
            <span className="hidden h-4 w-px bg-white/20 sm:block" aria-hidden="true" />
            <ul className="hidden items-center gap-3 sm:flex">
              {socials.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={label}
                    className="block text-white/65 transition-colors hover:text-cyan"
                  >
                    <Icon className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------- main bar */}
      <div className="bg-white shadow-[0_1px_0_rgb(11_37_69/0.08),0_8px_24px_-16px_rgb(11_37_69/0.35)]">
        <div className="shell flex h-20 items-center justify-between gap-4 lg:h-24">
          {/* The lockup deliberately overhangs the bar, as in the brand sheet. */}
          <Link href="/" aria-label={`${business.name} — home`} className="shrink-0">
            {/* Badge lockup, no mascot — the mascot has its own moments further
                down the page and the header reads cleaner without it. */}
            <img
              src="/brand/logo-badge.webp"
              srcSet="/brand/logo-badge-sm.webp 400w, /brand/logo-badge.webp 1000w"
              sizes="(min-width: 1280px) 168px, (min-width: 1024px) 150px, 108px"
              alt={`${business.name} — heating, cooling and mechanical`}
              width={1000}
              height={922}
              fetchPriority="high"
              className="h-[4.75rem] w-auto drop-shadow-[0_8px_18px_rgb(11_37_69/0.3)] sm:h-24 lg:h-[8.5rem] lg:-mb-12 lg:drop-shadow-[0_16px_30px_rgb(11_37_69/0.45)] xl:h-[9.5rem] xl:-mb-14"
            />
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
            {nav.map((item) =>
              item.href === "/services" ? (
                <ServicesMenu key={item.href} active={isActive(location, item.href)} />
              ) : (
                <NavLink
                  key={item.href}
                  href={item.href}
                  active={isActive(location, item.href)}
                >
                  {item.label}
                </NavLink>
              ),
            )}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={business.phoneHref}
              className="hidden items-center gap-2 pr-1 leading-tight xl:flex"
            >
              <Phone className="size-3.5 shrink-0 text-orange" aria-hidden="true" />
              <span>
                <span className="block font-display text-[0.58rem] font-extrabold uppercase tracking-[0.16em] text-navy/45">
                  24/7 · Call now
                </span>
                <span className="block font-display text-sm font-extrabold text-navy">
                  {business.phone}
                </span>
              </span>
            </a>

            <ButtonLink href="/contact" className="hidden md:inline-flex">
              Schedule Service
              <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>

            <a
              href={business.phoneHref}
              aria-label={`Call ${business.phone}`}
              className="grid size-11 place-items-center rounded-full bg-gradient-to-b from-orange-light to-ember text-white shadow-[var(--shadow-orange)] ring-1 ring-inset ring-white/25 md:hidden"
            >
              <Phone className="size-5" aria-hidden="true" />
            </a>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid size-11 place-items-center rounded-full text-navy transition-colors hover:bg-navy/5 lg:hidden"
            >
              {open ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------- mobile menu */}
      {open && (
        <div className="max-h-[calc(100dvh-7.5rem)] overflow-y-auto bg-white lg:hidden">
          {/* Same thermal hairline that caps the desktop mega-menu. */}
          <div className="thermal-rule h-[3px] rounded-none" aria-hidden="true" />

          <nav className="shell py-4" aria-label="Mobile">
            <ul className="divide-y divide-navy/8">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex min-h-12 items-center justify-between font-display font-extrabold",
                      isActive(location, item.href) ? "text-blue" : "text-navy",
                    )}
                  >
                    {item.label}
                    <ArrowRight
                      className="size-4 text-navy/25"
                      aria-hidden="true"
                    />
                  </Link>

                  {/* The services list is the reason most people open this
                      sheet, so it gets the icon chips off the desktop panel
                      rather than an indented run of plain text links. */}
                  {item.href === "/services" && (
                    <ul className="grid gap-1 pb-3">
                      {services.map((sv) => (
                        <li key={sv.slug}>
                          <Link
                            href={`/services/${sv.slug}`}
                            className="flex min-h-12 items-center gap-3 rounded-xl px-2 py-2 transition-colors active:bg-foam"
                          >
                            <span
                              className={cn(
                                "grid size-9 shrink-0 place-items-center rounded-lg text-white shadow-[0_6px_14px_-6px_rgb(10_35_82/0.8)] ring-1 ring-inset ring-white/25",
                                MENU_ACCENT[sv.accent],
                              )}
                            >
                              <Icon name={sv.icon} className="size-4" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block font-display text-[0.85rem] font-extrabold text-navy">
                                {sv.name}
                              </span>
                              <span className="mt-0.5 block text-[0.72rem] leading-snug text-navy/55">
                                {sv.menuLine}
                              </span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>

            {/* The live offer, carried over from the desktop panel. */}
            <Link
              href="/services/repairs-maintenance"
              className="band-navy grain mt-5 flex items-center gap-4 overflow-hidden rounded-card p-4 text-white"
            >
              <span className="poster shrink-0 text-3xl">{cleanAndTune.price}</span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-[0.55rem] font-extrabold uppercase tracking-[0.2em] text-gold">
                  Limited-time offer
                </span>
                <span className="mt-0.5 block font-display text-sm font-extrabold">
                  {cleanAndTune.name}
                </span>
              </span>
              <ArrowRight className="size-4 shrink-0 text-cyan" aria-hidden="true" />
            </Link>

            <div className="mt-4 grid gap-2.5 pb-2">
              <ButtonLink href="/contact" size="lg">
                Schedule Service
                <ArrowRight className="size-4" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href={business.phoneHref} variant="ghost" size="lg">
                <Phone className="size-4 text-orange" aria-hidden="true" />
                24/7 · {business.phone}
              </ButtonLink>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      data-active={active}
      className={cn(
        "nav-underline whitespace-nowrap px-2.5 py-2 font-display text-[0.76rem] font-extrabold uppercase tracking-tight transition-colors xl:px-3 xl:text-[0.82rem]",
        active ? "text-blue" : "text-navy/80 hover:text-blue",
      )}
    >
      {children}
    </Link>
  );
}

/**
 * Services mega-menu.
 *
 * Hover- and focus-driven with no JS state, so it works before hydration and
 * for keyboard users. Two columns of services with their icons and blurbs,
 * plus the live offer as a featured cell — a plain list of six links was
 * doing none of the selling the dropdown is well placed to do.
 */
function ServicesMenu({ active }: { active: boolean }) {
  return (
    <div className="group relative">
      <Link
        href="/services"
        data-active={active}
        className={cn(
          "nav-underline flex items-center gap-1 whitespace-nowrap px-2.5 py-2 font-display text-[0.76rem] font-extrabold uppercase tracking-tight transition-colors xl:px-3 xl:text-[0.82rem]",
          active ? "text-blue" : "text-navy/80 hover:text-blue",
        )}
      >
        Services
        <ChevronDown
          className="size-3.5 transition-transform duration-300 group-hover:rotate-180"
          aria-hidden="true"
        />
      </Link>

      <div
        className={cn(
          "invisible absolute left-1/2 top-full z-50 w-[46rem] -translate-x-1/2 translate-y-1 pt-4 opacity-0",
          "transition-[opacity,transform] duration-200 ease-out",
          "group-hover:visible group-hover:translate-y-0 group-hover:opacity-100",
          "group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100",
        )}
      >
        <div className="overflow-hidden rounded-card border border-navy/10 bg-white shadow-[0_32px_70px_-24px_rgb(5_15_38/0.45)]">
          {/* Thermal hairline ties the panel to the rest of the system. */}
          <div className="thermal-rule h-[3px] rounded-none" aria-hidden="true" />

          <div className="grid grid-cols-[1.45fr_1fr]">
            <ul className="grid grid-cols-2 gap-1 p-3">
              {services.map((sv) => (
                <li key={sv.slug}>
                  <Link
                    href={`/services/${sv.slug}`}
                    className="group/item flex gap-3 rounded-xl p-3 transition-colors hover:bg-foam"
                  >
                    <span
                      className={cn(
                        "mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg text-white shadow-[0_6px_14px_-6px_rgb(10_35_82/0.8)] ring-1 ring-inset ring-white/25",
                        MENU_ACCENT[sv.accent],
                      )}
                    >
                      <Icon name={sv.icon} className="size-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-display text-[0.82rem] font-extrabold text-navy transition-colors group-hover/item:text-blue">
                        {sv.name}
                      </span>
                      <span className="mt-0.5 block text-[0.72rem] leading-snug text-navy/55">
                        {sv.menuLine}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Featured offer */}
            <Link
              href="/services/repairs-maintenance"
              className="band-navy grain group/offer relative flex flex-col justify-center overflow-hidden p-6 text-white"
            >
              <span className="font-display text-[0.58rem] font-extrabold uppercase tracking-[0.2em] text-gold">
                Limited-time offer
              </span>
              <span className="poster mt-2 text-4xl text-white">
                {cleanAndTune.price}
              </span>
              <span className="mt-1 font-display text-sm font-extrabold text-white">
                {cleanAndTune.name}
              </span>
              <span className="mt-2 text-xs leading-relaxed text-white/60">
                A 10-point service, twice a year.
              </span>
              <span className="mt-4 inline-flex items-center gap-1.5 font-display text-[0.65rem] font-extrabold uppercase tracking-[0.14em] text-cyan">
                Book a visit
                <ArrowRight
                  className="size-3.5 transition-transform group-hover/offer:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
              <img
                src="/brand/mascot-service.webp"
                srcSet="/brand/mascot-service-sm.webp 450w, /brand/mascot-service.webp 900w"
                sizes="120px"
                alt=""
                width={900}
                height={904}
                className="pointer-events-none absolute -bottom-3 -right-4 w-28 opacity-90"
              />
            </Link>
          </div>

          <div className="flex items-center justify-between border-t border-navy/8 bg-foam px-5 py-3">
            <span className="font-display text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-navy/45">
              Serving {locations.length} cities · Lee, Collier &amp; Charlotte
            </span>
            <Link href="/services" className="link-arrow">
              All services
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const MENU_ACCENT: Record<string, string> = {
  orange: "bg-gradient-to-br from-orange-light to-ember",
  cyan: "bg-gradient-to-br from-cyan to-blue",
  slate: "bg-gradient-to-br from-slateish to-navy",
  blue: "bg-gradient-to-br from-blue-bright to-blue",
  gold: "bg-gradient-to-br from-gold to-orange",
};
