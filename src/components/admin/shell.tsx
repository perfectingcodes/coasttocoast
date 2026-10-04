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
  Target,
  X,
} from "lucide-react";
import { business } from "@/content/site";
import { Seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

/**
 * Grouped, not a flat list of six. The groups are the three questions the
 * dashboard answers — where does everything stand, how do people find us, and
 * can we tell whether any of it worked — so the sidebar explains the tool
 * rather than just indexing it.
 */
const NAV: {
  group: string;
  items: {
    href: string;
    label: string;
    hint: string;
    Icon: typeof Gauge;
    end?: boolean;
  }[];
}[] = [
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
    group: "Getting found",
    items: [
      { href: "/admin/seo", label: "SEO & GEO", hint: "Live page audit", Icon: Gauge },
      {
        href: "/admin/google",
        label: "Google",
        hint: "Business Profile and local pack",
        Icon: Globe,
      },
      {
        href: "/admin/campaigns",
        label: "Campaigns",
        hint: "Paid search and Meta",
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

/**
 * Admin shell — deliberately a different visual system from the marketing
 * site: neutral slate, a fixed sidebar, dense type, no brand waves. It should
 * feel like a tool, not a page.
 *
 * NOTE: this is a static build with no server, so there is no authentication
 * here. Every admin route is noindexed, disallowed in robots.txt and kept out
 * of the sitemap, but anyone who knows the URL can open it. Treat it as a
 * working surface for the team, never as a place for credentials or customer
 * data, until a real backend and login exist.
 */
export function AdminShell({
  title,
  lead,
  children,
}: {
  title: string;
  lead?: string;
  children: ReactNode;
}) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  const isActive = (href: string, end?: boolean) =>
    end ? location === href : location.startsWith(href);

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900">
      <Seo
        title={`${title} · ${business.name} Admin`}
        description={`Internal marketing dashboard for ${business.name}. Not a public page.`}
        path="/admin"
        noindex
      />

      <div className="lg:grid lg:grid-cols-[16rem_1fr]">
        {/* ------------------------------------------------------ sidebar */}
        <aside
          className={cn(
            "border-r border-slate-200 bg-white lg:sticky lg:top-0 lg:h-dvh",
            open ? "block" : "hidden lg:block",
          )}
        >
          <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-4">
            <img
              src="/brand/logo-badge-sm.webp"
              alt=""
              width={400}
              height={369}
              className="h-9 w-auto"
            />
            <div className="leading-tight">
              <p className="font-display text-sm font-extrabold">{business.name}</p>
              <p className="text-[0.7rem] font-medium text-slate-500">
                Marketing dashboard
              </p>
            </div>
          </div>

          <nav className="p-3" aria-label="Admin">
            {NAV.map((section, gi) => (
              <div key={section.group} className={cn(gi > 0 && "mt-5")}>
                <p className="px-3 pb-1.5 font-display text-[0.58rem] font-extrabold uppercase tracking-[0.16em] text-slate-400">
                  {section.group}
                </p>
                <ul className="space-y-0.5">
                  {section.items.map(({ href, label, hint, Icon, end }) => {
                    const active = isActive(href, end);
                    return (
                      <li key={href}>
                        <Link
                          href={href}
                          onClick={() => setOpen(false)}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "group relative flex items-start gap-2.5 rounded-lg px-3 py-2 transition-colors",
                            active
                              ? "bg-slate-900 text-white"
                              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                          )}
                        >
                          {/* Ember tick on the active item, the site's own
                              mark for "you are here". */}
                          {active && (
                            <span
                              className="absolute -left-px top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-ember"
                              aria-hidden="true"
                            />
                          )}
                          <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                          <span className="min-w-0 leading-tight">
                            <span className="block text-sm font-medium">{label}</span>
                            <span
                              className={cn(
                                "mt-0.5 block text-[0.68rem]",
                                active ? "text-white/55" : "text-slate-400",
                              )}
                            >
                              {hint}
                            </span>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}

            <div className="mt-5 border-t border-slate-100 pt-4">
              <Link
                href="/"
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                <ExternalLink className="size-4 shrink-0" aria-hidden="true" />
                View live site
              </Link>
            </div>
          </nav>
        </aside>

        {/* --------------------------------------------------------- main */}
        <div className="min-w-0">
          <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white/90 px-5 py-3 backdrop-blur lg:hidden">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid size-9 place-items-center rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
            <p className="font-display text-sm font-bold">{title}</p>
          </header>

          <div className="thermal-rule h-[3px] rounded-none" aria-hidden="true" />

          <main className="mx-auto max-w-6xl px-5 py-7 md:px-8 md:py-9">
            <UnsecuredNotice />

            <div className="mt-6">
              <h1 className="font-display text-2xl font-extrabold tracking-tight md:text-3xl">
                {title}
              </h1>
              {lead && (
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
                  {lead}
                </p>
              )}
            </div>

            <div className="mt-7 space-y-6">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}

/** Permanent, deliberate. This must not quietly look like a secure system. */
function UnsecuredNotice() {
  return (
    <details className="group rounded-lg border border-amber-300 bg-amber-50 open:pb-3">
      <summary className="flex cursor-pointer list-none items-center gap-2.5 px-4 py-2.5 [&::-webkit-details-marker]:hidden">
        <Lock className="size-3.5 shrink-0 text-amber-700" aria-hidden="true" />
        <span className="text-xs font-semibold text-amber-900">
          No login on this dashboard — anyone with the URL can open it
        </span>
        <span className="ml-auto text-[0.65rem] font-semibold uppercase tracking-wide text-amber-700 group-open:hidden">
          Why
        </span>
      </summary>
      <p className="px-4 text-xs leading-relaxed text-amber-900/90">
        The site is a static build with no server, so these pages are
        noindexed, disallowed in robots.txt and excluded from the sitemap —
        but none of that is access control. Keep credentials, customer data
        and financials out until a real backend and authentication are added.
      </p>
    </details>
  );
}
