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
 * Hero colour treatments. The photograph underneath is the same on every page;
 * what changes is the wash over it and the colour of the glow, which is enough
 * to make a heating page and a cooling page read as different places.
 */
const TONES = {
  default: {
    wash: "bg-[linear-gradient(105deg,rgb(5_15_38/0.94)_0%,rgb(10_35_82/0.9)_45%,rgb(14_47_107/0.8)_100%)]",
    glow: "bg-cyan/20",
  },
  /** Heating — sunset warmth over the blue. */
  warm: {
    wash: "bg-[linear-gradient(105deg,rgb(26_12_4/0.95)_0%,rgb(66_24_6/0.88)_42%,rgb(168_66_14/0.72)_100%)]",
    glow: "bg-orange/35",
  },
  /** Cooling — the coldest, most electric treatment on the site. */
  cool: {
    wash: "bg-[linear-gradient(105deg,rgb(3_20_52/0.95)_0%,rgb(8_52_120/0.88)_45%,rgb(16_110_190/0.7)_100%)]",
    glow: "bg-cyan/40",
  },
  /** Mechanical — desaturated steel. */
  steel: {
    wash: "bg-[linear-gradient(105deg,rgb(12_16_24/0.96)_0%,rgb(28_38_54/0.92)_45%,rgb(56_74_98/0.82)_100%)]",
    glow: "bg-slateish/35",
  },
  /** Maintenance — the offer page, gold accent. */
  offer: {
    wash: "bg-[linear-gradient(105deg,rgb(5_15_38/0.95)_0%,rgb(14_47_107/0.88)_42%,rgb(130_70_14/0.7)_100%)]",
    glow: "bg-gold/35",
  },
  /** Commercial — darkest and flattest, least consumer. */
  deep: {
    wash: "bg-[linear-gradient(105deg,rgb(3_8_18/0.97)_0%,rgb(6_22_48/0.94)_50%,rgb(12_44_92/0.88)_100%)]",
    glow: "bg-blue/30",
  },
  /** Air quality — green-leaning aqua. */
  aqua: {
    wash: "bg-[linear-gradient(105deg,rgb(2_28_36/0.95)_0%,rgb(6_60_74/0.88)_45%,rgb(12_120_136/0.7)_100%)]",
    glow: "bg-cyan-light/35",
  },
} as const;

export type HeroTone = keyof typeof TONES;

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
  aside,
  tone = "default",
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  crumbs?: Crumb[];
  /** Extra content inside the hero, below the lead. */
  hero?: ReactNode;
  /** Panel beside the hero copy; splits the hero into two columns. */
  aside?: ReactNode;
  tone?: HeroTone;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />

      <div className="band-navy grain grid-lines relative isolate overflow-hidden">
        <HeroBackdrop tone={tone} />

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

          <div
            className={cn(
              aside && "grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center",
            )}
          >
            <div className={cn(!aside && "max-w-3xl")}>
              {eyebrow && (
                <p className="font-display text-[0.7rem] font-bold uppercase tracking-[0.24em] text-cyan md:text-xs">
                  {eyebrow}
                </p>
              )}
              <h1 className="poster mt-5 text-[clamp(2.5rem,6.2vw,4.5rem)] text-white">
                {title}
              </h1>
              {lead && (
                <>
                  <div className="thermal-rule mt-6 w-24" aria-hidden="true" />
                  <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">
                    {lead}
                  </p>
                </>
              )}
              {hero}
            </div>

            {aside}
          </div>
        </div>

        <Wave fill="white" swell="#2bd9ff" height={64} className="relative -mb-px" />
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
function HeroBackdrop({ tone }: { tone: HeroTone }) {
  const t = TONES[tone];
  return (
    <>
      <picture>
        <source media="(min-width: 640px)" srcSet="/brand/hero-coast-1200.webp" />
        <img
          src="/brand/hero-coast-760.webp"
          alt=""
          className="absolute inset-0 -z-20 size-full object-cover object-center opacity-30 mix-blend-luminosity"
        />
      </picture>
      <div className={cn("absolute inset-0 -z-10", t.wash)} aria-hidden="true" />
      <div
        className={cn(
          "pointer-events-none absolute -right-20 -top-24 -z-10 size-96 rounded-full blur-3xl",
          t.glow,
        )}
        aria-hidden="true"
      />
    </>
  );
}
