import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { ChevronDown, Clock, Facebook, Instagram, Menu, Phone, X } from "lucide-react";
import { business, nav, services } from "@/content/site";
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
    <header className="sticky top-0 z-50">
      {/* ---------------------------------------------------- utility bar */}
      <div className="bg-navy-deep text-white">
        <div className="shell flex h-10 items-center justify-between gap-4">
          <a
            href={business.phoneHref}
            className="hidden text-xs font-semibold text-white/70 transition-colors hover:text-white sm:block lg:hidden xl:block"
          >
            {business.street}, {business.city}, {business.state} {business.zip}
          </a>
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
        <div className="shell flex h-24 items-center justify-between gap-4 lg:h-26">
          {/* The lockup deliberately overhangs the bar, as in the brand sheet. */}
          <Link href="/" aria-label={`${business.name} — home`} className="shrink-0">
            <img
              src="/brand/logo-mascot-sm.webp"
              srcSet="/brand/logo-mascot-sm.webp 480w, /brand/logo-mascot.webp 1200w"
              sizes="(min-width: 1280px) 168px, (min-width: 1024px) 150px, 96px"
              alt={`${business.name} — heating, cooling and mechanical`}
              width={480}
              height={413}
              fetchPriority="high"
              className="h-[4.5rem] w-auto drop-shadow-[0_6px_14px_rgb(11_37_69/0.25)] sm:h-24 lg:h-32 lg:-mb-9 lg:drop-shadow-[0_14px_26px_rgb(11_37_69/0.35)] xl:h-36 xl:-mb-11"
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
              className={cn(
                "hidden items-center gap-2 rounded-full bg-orange px-5 py-3 font-display text-sm",
                "font-bold text-white shadow-[var(--shadow-orange)] transition-colors hover:bg-orange-light md:inline-flex",
              )}
            >
              <Phone className="size-4" aria-hidden="true" />
              {business.phone}
            </a>

            <a
              href={business.phoneHref}
              aria-label={`Call ${business.phone}`}
              className="grid size-11 place-items-center rounded-full bg-orange text-white md:hidden"
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
        <div className="max-h-[calc(100dvh-7.5rem)] overflow-y-auto border-t border-navy/10 bg-white lg:hidden">
          <nav className="shell py-4" aria-label="Mobile">
            <ul className="divide-y divide-navy/8">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "block py-3.5 font-display font-bold",
                      isActive(location, item.href) ? "text-blue" : "text-navy",
                    )}
                  >
                    {item.label}
                  </Link>
                  {item.href === "/services" && (
                    <ul className="pb-3 pl-4">
                      {services.map((s) => (
                        <li key={s.slug}>
                          <Link
                            href={`/services/${s.slug}`}
                            className="block py-2 text-sm font-medium text-navy/65"
                          >
                            {s.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            <a
              href={business.phoneHref}
              className="mt-5 flex h-13 items-center justify-center gap-2 rounded-full bg-orange font-display font-bold text-white"
            >
              <Phone className="size-4" aria-hidden="true" />
              {business.phone}
            </a>
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
      className={cn(
        "relative px-3.5 py-2 font-display text-[0.82rem] font-bold uppercase tracking-wide transition-colors xl:text-sm",
        active ? "text-blue" : "text-navy/80 hover:text-blue",
      )}
    >
      {children}
      <span
        className={cn(
          "absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-blue transition-opacity",
          active ? "opacity-100" : "opacity-0",
        )}
        aria-hidden="true"
      />
    </Link>
  );
}

/** Hover/focus dropdown — no JS state, so it works before hydration. */
function ServicesMenu({ active }: { active: boolean }) {
  return (
    <div className="group relative">
      <Link
        href="/services"
        className={cn(
          "relative flex items-center gap-1 px-3.5 py-2 font-display text-[0.82rem] font-bold uppercase tracking-wide transition-colors xl:text-sm",
          active ? "text-blue" : "text-navy/80 hover:text-blue",
        )}
      >
        Services
        <ChevronDown
          className="size-3.5 transition-transform group-hover:rotate-180"
          aria-hidden="true"
        />
        <span
          className={cn(
            "absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-blue transition-opacity",
            active ? "opacity-100" : "opacity-0",
          )}
          aria-hidden="true"
        />
      </Link>

      <div
        className={cn(
          "invisible absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-3 opacity-0 transition",
          "group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100",
        )}
      >
        <ul className="card overflow-hidden p-2">
          {services.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/services/${s.slug}`}
                className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-navy/80 transition-colors hover:bg-foam hover:text-blue"
              >
                {s.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
