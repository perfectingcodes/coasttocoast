import type { ReactNode } from "react";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { Wave } from "@/components/wave";
import { cn } from "@/lib/utils";

export interface Crumb {
  name: string;
  path: string;
}

/**
 * Frame shared by every page except the home page: sticky nav, a compact
 * navy hero with breadcrumbs, the wave divider, then content and footer.
 */
export function SiteLayout({
  eyebrow,
  title,
  lead,
  crumbs,
  hero,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  crumbs?: Crumb[];
  /** Extra content inside the hero, below the lead. */
  hero?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />

      <div className="relative isolate overflow-hidden bg-navy-deep">
        <HeroBackdrop />

        <div className="shell relative pb-20 pt-10 md:pb-24 md:pt-14">
          {crumbs && crumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex flex-wrap items-center gap-1 text-sm text-white/55">
                {crumbs.map((c, i) => (
                  <li key={c.path} className="flex items-center gap-1">
                    {i > 0 && <ChevronRight className="size-3.5" aria-hidden="true" />}
                    {i === crumbs.length - 1 ? (
                      <span className="text-white/90">{c.name}</span>
                    ) : (
                      <Link href={c.path} className="transition-colors hover:text-cyan">
                        {c.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <div className="max-w-3xl">
            {eyebrow && (
              <p className="font-display text-[0.7rem] font-bold uppercase tracking-[0.24em] text-cyan md:text-xs">
                {eyebrow}
              </p>
            )}
            <h1 className={cn("mt-4 text-4xl leading-[1.06] text-white md:text-5xl")}>
              {title}
            </h1>
            {lead && (
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/75">
                {lead}
              </p>
            )}
          </div>

          {hero}
        </div>

        <Wave fill="white" swell="#22c7f2" height={64} className="relative -mb-px" />
      </div>

      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

/**
 * The same Gulf-coast photograph as the home hero, pushed further under the
 * navy wash — inner pages are text-led, so the image reads as texture rather
 * than as the subject.
 */
function HeroBackdrop() {
  return (
    <>
      <picture>
        <source media="(min-width: 640px)" srcSet="/brand/hero-coast-1200.webp" />
        <img
          src="/brand/hero-coast-760.webp"
          alt=""
          className="absolute inset-0 -z-20 size-full object-cover object-center"
        />
      </picture>
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(105deg,rgb(4_16_29/0.96)_0%,rgb(9_31_58/0.92)_45%,rgb(13_45_80/0.78)_100%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-20 -top-24 -z-10 size-96 rounded-full bg-cyan/12 blur-3xl"
        aria-hidden="true"
      />
    </>
  );
}
