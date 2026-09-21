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

const NAV = [
  { href: "/admin", label: "Home Base", Icon: LayoutDashboard, end: true },
  { href: "/admin/seo", label: "SEO & GEO", Icon: Gauge },
  { href: "/admin/marketing", label: "Marketing plan", Icon: Target },
  { href: "/admin/campaigns", label: "Campaigns", Icon: Megaphone },
  { href: "/admin/google", label: "Google", Icon: Globe },
  { href: "/admin/tracking", label: "Tracking", Icon: BarChart3 },
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
            <ul className="space-y-0.5">
              {NAV.map(({ href, label, Icon, end }) => {
                const active = isActive(href, end);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-slate-900 text-white"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                      )}
                    >
                      <Icon className="size-4 shrink-0" aria-hidden="true" />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>

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
    <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3">
      <Lock className="mt-0.5 size-4 shrink-0 text-amber-700" aria-hidden="true" />
      <p className="text-xs leading-relaxed text-amber-900">
        <strong className="font-semibold">No login on this dashboard.</strong>{" "}
        The site is a static build with no server, so these pages are
        noindexed, disallowed in robots.txt and excluded from the sitemap — but
        anyone with the URL can open them. Keep credentials, customer data and
        financials out until a real backend and authentication are added.
      </p>
    </div>
  );
}
