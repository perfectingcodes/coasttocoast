import type { ReactNode } from "react";
import { Link } from "wouter";
import { Clock, Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { business, locations, services } from "@/content/site";
import { GoogleBadge } from "@/components/google-reviews";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="band-navy relative overflow-hidden text-white/70">
      <PalmBackdrop />

      <div className="shell relative py-14 md:py-18">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* ------------------------------------------------ brand block */}
          <div>
            <img
              src="/brand/logo-mascot.webp"
              srcSet="/brand/logo-mascot-sm.webp 480w, /brand/logo-mascot.webp 1200w"
              sizes="288px"
              alt={business.name}
              width={1200}
              height={1034}
              className="h-36 w-auto drop-shadow-[0_14px_28px_rgb(4_16_29/0.5)] md:h-40"
              loading="lazy"
            />
            <p className="mt-5 font-display text-lg font-extrabold leading-tight">
              <span className="block text-cyan">Florida Comfort.</span>
              <span className="block text-white">Coast to Coast.</span>
            </p>
            <p className="script mt-4 text-2xl text-gold">{business.promise}</p>
          </div>

          <FooterColumn title="Quick Links">
            <FooterLink href="/">Home</FooterLink>
            <FooterLink href="/services">Services</FooterLink>
            <FooterLink href="/locations">Areas We Serve</FooterLink>
            <FooterLink href="/about">About Us</FooterLink>
            <FooterLink href="/financing">Financing</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
          </FooterColumn>

          <FooterColumn title="Our Services">
            {services.map((s) => (
              <FooterLink key={s.slug} href={`/services/${s.slug}`}>
                {s.short}
              </FooterLink>
            ))}
          </FooterColumn>

          {/* ----------------------------------------------------- contact */}
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-cyan">
              Contact Us
            </p>
            <ul className="mt-5 space-y-3.5 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-cyan" aria-hidden="true" />
                <a
                  href={business.phoneHref}
                  className="font-display text-base font-bold text-white transition-colors hover:text-cyan"
                >
                  {business.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-cyan" aria-hidden="true" />
                <a
                  href={`mailto:${business.email}`}
                  className="transition-colors hover:text-white"
                >
                  {business.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-cyan" aria-hidden="true" />
                <span>
                  {business.street}
                  <span className="block">
                    {business.city}, {business.state} {business.zip}
                  </span>
                  <span className="block text-white/50">Serving all of Southwest Florida</span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-cyan" aria-hidden="true" />
                <span>
                  {business.hours}
                  <span className="block text-white/50">{business.emergency}</span>
                </span>
              </li>
            </ul>

            <GoogleBadge className="mt-6" onDark />

            <ul className="mt-4 flex items-center gap-3">
              {[
                { href: business.social.facebook, label: "Facebook", Icon: Facebook },
                { href: business.social.instagram, label: "Instagram", Icon: Instagram },
              ].map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={label}
                    className="grid size-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-cyan hover:text-navy"
                  >
                    <Icon className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ------------------------------------------------- areas + legal */}
        <div className="mt-12 border-t border-white/12 pt-8">
          <p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-cyan">
            Areas We Serve
          </p>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {locations.map((l) => (
              <li key={l.slug}>
                <Link href={`/locations/${l.slug}`} className="transition-colors hover:text-white">
                  {l.city}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/12 pt-6 text-xs text-white/55 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {business.name}. All rights reserved. · License #{business.license}
          </p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-cyan">
        {title}
      </p>
      <ul className="mt-5 space-y-2.5 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <li>
      <Link href={href} className="transition-colors hover:text-white">
        {children}
      </Link>
    </li>
  );
}

/** Palm silhouettes echoing the logo emblem, very low contrast. */
function PalmBackdrop() {
  return (
    <svg
      className="pointer-events-none absolute -right-10 bottom-0 h-64 w-auto opacity-[0.07]"
      viewBox="0 0 200 240"
      fill="none"
      aria-hidden="true"
    >
      <path d="M96 240V96" stroke="white" strokeWidth="7" strokeLinecap="round" />
      <g stroke="white" strokeWidth="7" strokeLinecap="round" fill="none">
        <path d="M96 96C74 74 44 70 24 84" />
        <path d="M96 96c22-22 52-26 72-12" />
        <path d="M96 96C82 68 84 38 104 20" />
        <path d="M96 96c18-12 48-8 62 10" />
        <path d="M96 96C78 88 50 96 38 118" />
      </g>
      <path d="M158 240V140" stroke="white" strokeWidth="5" strokeLinecap="round" />
      <g stroke="white" strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M158 140c-16-16-38-19-53-9" />
        <path d="M158 140c16-16 38-19 53-9" />
        <path d="M158 140c-10-20-8-42 6-55" />
      </g>
    </svg>
  );
}
