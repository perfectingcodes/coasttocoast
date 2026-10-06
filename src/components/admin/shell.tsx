import { useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import {
  BarChart3,
  ExternalLink,
  Gauge,
  Globe,
  LayoutDashboard,
  Lock,
  Megaphone,
  Menu,
  Star,
  Target,
  Users,
  X,
} from "lucide-react";
import { business, locations } from "@/content/site";
import { Seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

/**
 * Admin shell.
 *
 * The dashboard used to be a white sidebar beside a stack of identical white
 * panels, which is what every generated admin looks like. This is the house
 * instead: the deep navy ground the marketing site uses, cyan as the light
 * source on it, the thermal rule across the top edge, ember for anything
 * wrong. It should be recognisable as the same company from across the room,
 * and it should read as a tool — dense, quiet, instrument-like — rather than
 * as a page.
 *
 * NOTE: static build, no server, so there is no authentication here. Every
 * admin route is noindexed, disallowed in robots.txt and kept out of the
 * sitemap, but anyone with the URL can open it.
 */

interface NavItem {
  href: string;
  label: string;
  hint: string;
  Icon: typeof Gauge;
  end?: boolean;
}

const NAV: { group: string; items: NavItem[] }[] = [
  {
    group: "Overview",
    items: [
      {
        href: "/admin",
        label: "Home Base",
        hint: "What is live and what is blocked",
        Icon: LayoutDashboard,
        end: true,
      },
      {
        href: "/admin/marketing",
        label: "Marketing plan",
        hint: "Objectives, channels, seasonality",
        Icon: Target,
      },
    ],
  },
  {
    group: "Customers",
    items: [
      {
        href: "/admin/leads",
        label: "Leads & CRM",
        hint: "Enquiries and site traction",
        Icon: Users,
      },
      {
        href: "/admin/resources",
        label: "Resources",
        hint: "Review sequence and templates",
        Icon: Star,
      },
    ],
  },
  {
    group: "Getting found",
    items: [
      { href: "/admin/seo", label: "SEO & GEO", hint: "Live page audit", Icon: Gauge },
      {
        // `end` matters: without it /admin/google-ads would light this up too.
        href: "/admin/google",
        label: "Google",
        hint: "Business Profile and local pack",
        Icon: Globe,
        end: true,
      },
      {
        href: "/admin/google-ads",
        label: "Google Ads build",
        hint: "The build sheet being worked to",
        Icon: Megaphone,
      },
      {
        href: "/admin/campaigns",
        label: "Campaigns",
        hint: "Meta, email and the earlier draft",
        Icon: Megaphone,
      },
    ],
  },
  {
    group: "Measurement",
    items: [
      {
        href: "/admin/tracking",
        label: "Tracking",
        hint: "Analytics and conversions",
        Icon: BarChart3,
      },
    ],
  },
];

export function AdminShell({
  title,
  lead,
  actions,
  children,
}: {
  title: string;
  lead?: string;
  /** Page-level controls, rendered opposite the title. */
  actions?: ReactNode;
  children: ReactNode;
}) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  const isActive = (href: string, end?: boolean) =>
    end ? location === href : location.startsWith(href);

  const section =
    NAV.find((g) => g.items.some((i) => isActive(i.href, i.end)))?.group ?? "Overview";

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="min-h-dvh bg-[#eaf1fa] text-navy">
      <Seo
        title={`${title} · ${business.name} Admin`}
        description={`Internal marketing dashboard for ${business.name}. Not a public page.`}
        path="/admin"
        noindex
      />

      <div className="lg:grid lg:grid-cols-[17rem_1fr]">
        {/* ------------------------------------------------------ sidebar */}
        {/* The navy runs the full height of the page, not just one viewport —
            a sidebar that stops two thirds down and lets the ground show
            through is the single most common tell of a stuck-together admin.
            The column stretches; the nav inside it sticks. */}
        <aside
          className={cn(
            "band-navy grain relative z-40 text-white lg:flex lg:flex-col",
            open ? "block" : "hidden lg:block",
          )}
        >
          <div
            className="thermal-rule absolute inset-x-0 top-0 z-10 rounded-none"
            aria-hidden="true"
          />
          <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col">

          <div className="relative flex items-center gap-3 px-5 pb-5 pt-6">
            <img
              src="/brand/logo-badge-sm.webp"
              alt=""
              width={400}
              height={369}
              className="h-10 w-auto drop-shadow-[0_6px_14px_rgb(3_14_34/0.6)]"
            />
            <div className="min-w-0 leading-tight">
              <p className="font-display text-sm font-extrabold tracking-tight">
                {business.name}
              </p>
              <p className="mt-0.5 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-cyan">
                Marketing dashboard
              </p>
            </div>
          </div>

          <nav
            className="relative min-h-0 flex-1 overflow-y-auto px-3 pb-3"
            aria-label="Admin"
          >
            {NAV.map((group, gi) => (
              <div key={group.group} className={cn(gi > 0 && "mt-6")}>
                <p className="px-3 pb-2 font-display text-[0.56rem] font-extrabold uppercase tracking-[0.2em] text-white/35">
                  {group.group}
                </p>
                <ul className="space-y-0.5">
                  {group.items.map(({ href, label, hint, Icon, end }) => {
                    const active = isActive(href, end);
                    return (
                      <li key={href}>
                        <Link
                          href={href}
                          onClick={() => setOpen(false)}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "relative flex items-center gap-3 rounded-xl py-2.5 pl-4 pr-3 transition-colors",
                            active
                              ? "bg-white/12 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.12)]"
                              : "text-white/65 hover:bg-white/6 hover:text-white",
                          )}
                        >
                          {/* The brand's own mark for "you are here". */}
                          {active && (
                            <span
                              className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-cyan shadow-[0_0_12px_rgb(43_217_255/0.8)]"
                              aria-hidden="true"
                            />
                          )}
                          <Icon
                            className={cn(
                              "size-4 shrink-0",
                              active ? "text-cyan" : "text-white/45",
                            )}
                            aria-hidden="true"
                          />
                          <span className="min-w-0 leading-tight">
                            <span className="block text-[0.82rem] font-semibold">
                              {label}
                            </span>
                            {/* Only the open page explains itself. Eight hints
                                at once is noise, not guidance. */}
                            {active && (
                              <span className="mt-0.5 block text-[0.66rem] text-white/50">
                                {hint}
                              </span>
                            )}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          <div className="relative border-t border-white/10 p-3">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-[0.82rem] font-semibold text-white/65 transition-colors hover:bg-white/8 hover:text-white"
            >
              <ExternalLink className="size-4 shrink-0 text-white/45" aria-hidden="true" />
              View live site
            </Link>
            <p className="mt-2 px-4 font-mono text-[0.58rem] uppercase leading-relaxed tracking-[0.12em] text-white/30">
              Lic. {business.license}
              <br />
              {locations.length} cities · static build
            </p>
          </div>
          </div>
        </aside>

        {/* --------------------------------------------------------- main */}
        <div className="min-w-0">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-navy/8 bg-[#eaf1fa]/85 px-4 backdrop-blur-md md:px-8">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid size-9 shrink-0 place-items-center rounded-lg text-navy/70 hover:bg-navy/5 lg:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>

            <p className="flex min-w-0 items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-navy/40">
              <span className="hidden sm:inline">Admin</span>
              <span className="hidden text-navy/20 sm:inline">/</span>
              <span className="hidden sm:inline">{section}</span>
              <span className="hidden text-navy/20 sm:inline">/</span>
              <span className="truncate font-semibold text-navy/70">{title}</span>
            </p>

            <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
              <span className="hidden font-mono text-[0.62rem] uppercase tracking-[0.12em] text-navy/40 md:inline">
                {today}
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-wide text-navy/60 shadow-[0_1px_2px_rgb(7_26_61/0.06)]">
                <span
                  className="size-1.5 animate-pulse rounded-full bg-emerald-500"
                  aria-hidden="true"
                />
                Live
              </span>
            </div>
          </header>

          <main className="mx-auto max-w-[80rem] px-4 pb-16 pt-6 md:px-8 md:pt-8">
            <UnsecuredNotice />

            <div className="mt-6 flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
              <div className="min-w-0">
                <p className="flex items-center gap-2.5 font-display text-[0.58rem] font-extrabold uppercase tracking-[0.2em] text-blue">
                  {section}
                  <span
                    className="thermal-rule inline-block h-[2px] w-9"
                    aria-hidden="true"
                  />
                </p>
                <h1 className="mt-3 font-display text-[1.9rem] font-extrabold leading-none tracking-[-0.03em] md:text-[2.3rem]">
                  {title}
                </h1>
                {lead && (
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-navy/60">
                    {lead}
                  </p>
                )}
              </div>
              {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
            </div>

            <div className="mt-8 space-y-5">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}

/** Permanent, deliberate. This must not quietly look like a secure system. */
function UnsecuredNotice() {
  return (
    <details className="group overflow-hidden rounded-xl bg-gold/12 ring-1 ring-gold/40 open:pb-3">
      <summary className="flex cursor-pointer list-none items-center gap-2.5 px-4 py-2 [&::-webkit-details-marker]:hidden">
        <Lock className="size-3.5 shrink-0 text-amber-700" aria-hidden="true" />
        <span className="text-[0.72rem] font-semibold text-amber-900">
          No login on this dashboard — anyone with the URL can open it
        </span>
        <span className="ml-auto shrink-0 font-mono text-[0.6rem] font-bold uppercase tracking-[0.12em] text-amber-700 group-open:hidden">
          Why
        </span>
      </summary>
      <p className="max-w-3xl px-4 text-xs leading-relaxed text-amber-900/90">
        The site is a static build with no server, so these pages are
        noindexed, disallowed in robots.txt and excluded from the sitemap —
        but none of that is access control. Keep credentials, customer data
        and financials out until a real backend and authentication are added.
      </p>
    </details>
  );
}
