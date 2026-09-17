import { ArrowRight, Phone } from "lucide-react";
import { business } from "@/content/site";
import { ButtonLink } from "@/components/ui/button";
import { Wave } from "@/components/wave";

/**
 * Full-bleed sunset band that closes every page, lifted from the brand sheet:
 * sun on the horizon, palms at the edges, one action and one phone number.
 */
export function CtaBand({
  eyebrow = "Ready for a more comfortable tomorrow?",
  title = "Let's Get Your Comfort Back on Track.",
  cta = "Schedule Service",
  href = "/contact",
}: {
  eyebrow?: string;
  title?: string;
  cta?: string;
  href?: string;
}) {
  return (
    <section className="band-sunset relative overflow-hidden">
      <SunsetScenery />

      <div className="shell relative py-14 md:py-16">
        <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="font-display text-[0.7rem] font-bold uppercase tracking-[0.22em] text-white/80">
              {eyebrow}
            </p>
            <h2 className="mt-3 text-3xl leading-tight text-white drop-shadow-[0_2px_10px_rgb(120_40_0/0.35)] md:text-[2.6rem]">
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

      {/* Water line into the footer. */}
      <Wave fill="#123a63" swell="#22c7f2" height={56} className="relative" />
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
