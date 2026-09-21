import { ArrowRight, Phone } from "lucide-react";
import { business } from "@/content/site";
import { ButtonLink } from "@/components/ui/button";
import { Wave } from "@/components/wave";
import { cn } from "@/lib/utils";

/**
 * Full-bleed sunset band that closes every page, lifted from the brand sheet:
 * sun on the horizon, palms at the edges, one action and one phone number.
 */
export function CtaBand({
  eyebrow = "Ready for a more comfortable tomorrow?",
  title = "Let's Get Your Comfort Back on Track.",
  cta = "Schedule Service",
  href = "/contact",
  mascot = false,
}: {
  eyebrow?: string;
  title?: string;
  cta?: string;
  href?: string;
  /** Let the mascot climb out of the bottom edge. One page at a time — it is
   *  a signature moment, not a motif to repeat on all 76. */
  mascot?: boolean;
}) {
  return (
    <section
      className={cn(
        "band-sunset relative",
        // The section must stay overflow-visible for the break-out, so the
        // decorative scenery clips in its own wrapper instead.
        mascot ? "z-10" : "overflow-hidden",
      )}
    >
      <div className={cn("absolute inset-0", mascot && "overflow-hidden")} aria-hidden="true">
        <SunsetScenery />
      </div>

      <div className={cn("shell relative py-14 md:py-16", mascot && "pb-36 sm:pb-40 md:pb-44")}>
        <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="font-display text-[0.7rem] font-bold uppercase tracking-[0.22em] text-white/80">
              {eyebrow}
            </p>
            <h2 className="poster mt-4 text-[clamp(2.1rem,5.2vw,3.75rem)] text-white drop-shadow-[0_3px_14px_rgb(120_40_0/0.4)]">
              {title}
            </h2>
          </div>

          <div className="shrink-0 lg:text-right">
            <ButtonLink href={href} variant="onDark" size="lg">
              {cta}
              <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
            <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-white lg:justify-end">
              <Phone className="size-4" aria-hidden="true" />
              Or call{" "}
              <a href={business.phoneHref} className="underline underline-offset-4 hover:text-navy">
                {business.phone}
              </a>
            </p>
          </div>
        </div>
      </div>

      {mascot && <SurfacingMascot />}

      {/* Water line into the footer. */}
      <Wave
        fill="#0e2f6b"
        swell="#2bd9ff"
        height={56}
        className="relative z-10"
      />
    </section>
  );
}

/** Low-contrast sun + palm silhouettes, drawn rather than photographed. */
function SunsetScenery() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div className="absolute bottom-0 left-1/2 size-72 -translate-x-1/2 translate-y-1/3 rounded-full bg-gold/45 blur-2xl" />
      <svg
        className="absolute -left-6 bottom-0 h-44 w-auto opacity-25 md:h-56"
        viewBox="0 0 160 200"
        fill="none"
      >
        <path d="M78 200V78" stroke="#7a2c05" strokeWidth="7" strokeLinecap="round" />
        <g stroke="#7a2c05" strokeWidth="7" strokeLinecap="round">
          <path d="M78 78C58 58 30 55 12 68" />
          <path d="M78 78c20-20 48-23 66-10" />
          <path d="M78 78C65 52 67 25 85 8" />
          <path d="M78 78c16-11 44-7 57 9" />
        </g>
      </svg>
      <svg
        className="absolute -right-4 bottom-0 h-52 w-auto opacity-25 md:h-64"
        viewBox="0 0 160 200"
        fill="none"
      >
        <path d="M82 200V78" stroke="#7a2c05" strokeWidth="7" strokeLinecap="round" />
        <g stroke="#7a2c05" strokeWidth="7" strokeLinecap="round">
          <path d="M82 78c20-20 48-23 66-10" />
          <path d="M82 78C62 58 34 55 16 68" />
          <path d="M82 78C69 52 71 25 89 8" />
          <path d="M82 78c-16-11-44-7-57 9" />
        </g>
      </svg>
    </div>
  );
}


/**
 * The mascot surfacing out of the bottom of the band.
 *
 * His lower edge is masked into a set of drawn ripples rather than simply
 * cropped, so he reads as coming *up through* the surface. Centred and sized
 * by breakpoint, with the band carrying matching bottom padding, so he never
 * collides with the copy or the button at any width.
 */
function SurfacingMascot() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex justify-center"
      aria-hidden="true"
    >
      <div className="relative w-36 sm:w-40 md:w-48 xl:w-56">
        <img
          src="/brand/mascot-bust.webp"
          srcSet="/brand/mascot-bust-sm.webp 400w, /brand/mascot-bust.webp 800w"
          sizes="(min-width: 1280px) 224px, (min-width: 768px) 192px, 144px"
          alt=""
          width={800}
          height={849}
          loading="lazy"
          className="w-full drop-shadow-[0_16px_30px_rgb(90_32_0/0.45)]"
          style={{
            maskImage:
              "linear-gradient(to bottom, black 62%, rgba(0,0,0,0.65) 78%, transparent 92%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 62%, rgba(0,0,0,0.65) 78%, transparent 92%)",
          }}
        />

        {/* Ripples he is rising through. */}
        <svg
          viewBox="0 0 240 54"
          className="absolute inset-x-[-28%] bottom-[2%] w-[156%]"
          fill="none"
        >
          {[
            { d: "M4 14c26-9 52 9 78 0s52-9 78 0 52 9 76 0", o: 0.9, w: 4 },
            { d: "M0 29c28-9 56 9 84 0s56-9 84 0 52 9 72 0", o: 0.6, w: 3.5 },
            { d: "M8 43c24-8 48 8 72 0s48-8 72 0 48 8 88 0", o: 0.35, w: 3 },
          ].map((l, i) => (
            <path
              key={i}
              d={l.d}
              stroke="white"
              strokeOpacity={l.o}
              strokeWidth={l.w}
              strokeLinecap="round"
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
