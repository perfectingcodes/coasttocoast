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
    wash: "bg-[linear-gradient(105deg,rgb(10_44_107/0.92)_0%,rgb(16_74_174/0.86)_45%,rgb(22_104_227/0.74)_100%)]",
    glow: "bg-cyan/28",
  },
  /** Heating — sunset warmth over the blue. */
  warm: {
    wash: "bg-[linear-gradient(105deg,rgb(74_28_8/0.94)_0%,rgb(134_50_12/0.88)_42%,rgb(190_76_16/0.74)_100%)]",
    glow: "bg-orange/42",
  },
  /** Cooling — the coldest, most electric treatment on the site. */
  cool: {
    wash: "bg-[linear-gradient(105deg,rgb(8_48_120/0.93)_0%,rgb(14_84_186/0.86)_45%,rgb(28_128_226/0.72)_100%)]",
    glow: "bg-cyan/45",
  },
  /** Mechanical — desaturated steel. */
  steel: {
    wash: "bg-[linear-gradient(105deg,rgb(30_44_70/0.94)_0%,rgb(50_74_114/0.9)_45%,rgb(76_106_152/0.8)_100%)]",
    glow: "bg-slateish/45",
  },
  /** Maintenance — the offer page, gold accent. */
  offer: {
    wash: "bg-[linear-gradient(105deg,rgb(12_46_110/0.93)_0%,rgb(24_78_168/0.86)_42%,rgb(160_96_22/0.72)_100%)]",
    glow: "bg-gold/42",
  },
  /** Commercial — darkest and flattest, least consumer. */
  deep: {
    wash: "bg-[linear-gradient(105deg,rgb(6_26_62/0.95)_0%,rgb(10_46_106/0.92)_50%,rgb(18_74_152/0.86)_100%)]",
    glow: "bg-blue/38",
  },
  /** Air quality — green-leaning aqua. */
  aqua: {
    wash: "bg-[linear-gradient(105deg,rgb(6_62_82/0.93)_0%,rgb(10_96_118/0.86)_45%,rgb(12_116_132/0.74)_100%)]",
    glow: "bg-cyan-light/45",
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

        <div className="shell relative pb-20 pt-10 md:pb-24 md:pt-14 lg:pt-20">
          {crumbs && crumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex flex-wrap items-center gap-1 text-sm text-white/55">
                {crumbs.map((c, i) => (
                  <li key={c.path} className="flex items-center gap-1">
                    {i > 0 && <ChevronRight className="size-3.5" aria-hidden="true" />}
                    {i === crumbs.length - 1 ? (
                      <span className="flex min-h-9 items-center text-white/90">{c.name}</span>
                    ) : (
                      <Link
                        href={c.path}
                        className="flex min-h-9 items-center transition-colors hover:text-cyan"
                      >
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
                  <p className="mt-5 max-w-2xl leading-relaxed text-white/80 md:text-lg">
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
