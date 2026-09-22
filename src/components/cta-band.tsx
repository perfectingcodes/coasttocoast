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
        // Always clipped: the mascot is meant to be cut by the section edge,
        // and without this his lower body reappeared over the footer.
        "overflow-hidden",
      )}
    >
      <div className="absolute inset-0" aria-hidden="true">
        <SunsetScenery />
      </div>

      <div className={cn("shell relative py-14 md:py-16", mascot && "pb-52 sm:pb-60 md:pb-64 xl:pb-72")}>
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

/**
 * The ground under the closing band.
 *
 * Drawn palms read as clip art at any size, so this is the sun on the horizon,
 * a fine chevron field standing in for moving air, and a light sweep off the
 * top-left corner — three flat gradients, no illustration.
 */
function SunsetScenery() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Sun, sitting on the bottom edge behind the mascot. */}
      <div className="absolute bottom-0 left-1/2 size-[30rem] -translate-x-1/2 translate-y-1/2 rounded-full bg-gold/45 blur-[90px]" />
      <div className="absolute bottom-0 left-1/2 size-56 -translate-x-1/2 translate-y-1/2 rounded-full bg-[#ffd98a]/45 blur-2xl" />

      {/* Airflow: one repeating chevron field, masked so it fades inward. */}
      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, rgb(255 255 255 / 0.9) 0 2px, transparent 2px 22px)",
          maskImage:
            "radial-gradient(120% 90% at 8% 0%, black 0%, transparent 62%)",
          WebkitMaskImage:
            "radial-gradient(120% 90% at 8% 0%, black 0%, transparent 62%)",
        }}
      />

      {/* Light sweep, so the band is not a flat sheet of orange. */}
      <div className="absolute -left-1/4 -top-1/2 h-[140%] w-2/3 rotate-12 bg-gradient-to-r from-white/12 to-transparent blur-2xl" />
    </div>
  );
}

/**
 * The mascot rising out of the bottom of the band.
 *
 * No mask and no drawn ripples: a masked element with a drop-shadow renders
 * the shadow of the *mask box*, which is what put a faint square behind him.
 * He simply sits on the section's bottom edge, which clips him cleanly.
 */
function SurfacingMascot() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex justify-center"
      aria-hidden="true"
    >
      <img
        src="/brand/mascot-bust.webp"
        srcSet="/brand/mascot-bust-sm.webp 400w, /brand/mascot-bust.webp 800w"
        sizes="(min-width: 1280px) 368px, (min-width: 768px) 320px, 240px"
        alt=""
        width={800}
        height={849}
        loading="lazy"
        className="w-60 translate-y-[7%] sm:w-72 md:w-80 xl:w-[23rem]"
      />
    </div>
  );
}
