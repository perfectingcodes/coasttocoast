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

      <div className="shell relative py-14 md:py-16">
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

      {/* Mascot is painted *before* the wave so the water crosses his chest —
          he reads as surfacing through it rather than pasted on top. */}
      {mascot && (
        <img
          src="/brand/mascot-bust.webp"
          srcSet="/brand/mascot-bust-sm.webp 400w, /brand/mascot-bust.webp 800w"
          sizes="(min-width: 1280px) 260px, 216px"
          alt=""
          width={800}
          height={849}
          loading="lazy"
          className="pointer-events-none absolute bottom-6 left-[53%] z-0 hidden w-44 drop-shadow-[0_18px_34px_rgb(90_32_0/0.5)] xl:block 2xl:w-52"
        />
      )}

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
