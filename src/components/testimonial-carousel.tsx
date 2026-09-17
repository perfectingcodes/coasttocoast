import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { testimonials } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * One review at a time with prev/next. The first review is in the prerendered
 * HTML, so the section reads correctly before hydration and without JS.
 */
export function TestimonialCarousel() {
  const [i, setI] = useState(0);
  const count = testimonials.length;
  const active = testimonials[i];

  const go = (delta: number) => setI((n) => (n + delta + count) % count);

  return (
    <div>
      <div className="flex items-center gap-1" aria-label="Rated 5 out of 5">
        {Array.from({ length: 5 }, (_, n) => (
          <Star key={n} className="size-6 fill-gold text-gold" aria-hidden="true" />
        ))}
      </div>

      <blockquote className="mt-6 min-h-32 text-lg italic leading-relaxed text-navy/80 md:text-xl">
        &ldquo;{active.quote}&rdquo;
      </blockquote>

      <p className="mt-5 font-display font-bold text-navy">
        — {active.name}
        <span className="font-medium text-navy/55">, {active.city}</span>
      </p>

      <div className="mt-8 flex items-center gap-3">
        <CarouselButton label="Previous review" onClick={() => go(-1)}>
          <ChevronLeft className="size-5" aria-hidden="true" />
        </CarouselButton>
        <CarouselButton label="Next review" onClick={() => go(1)}>
          <ChevronRight className="size-5" aria-hidden="true" />
        </CarouselButton>

        <ul className="ml-2 flex items-center gap-2">
          {testimonials.map((t, n) => (
            <li key={t.name}>
              <button
                type="button"
                onClick={() => setI(n)}
                aria-label={`Review ${n + 1} of ${count}`}
                aria-current={n === i}
                className={cn(
                  "block h-2 rounded-full transition-all",
                  n === i ? "w-6 bg-blue" : "w-2 bg-navy/20 hover:bg-navy/40",
                )}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function CarouselButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid size-11 place-items-center rounded-full border-2 border-navy/12 text-navy transition-colors hover:border-blue hover:bg-blue hover:text-white"
    >
      {children}
    </button>
  );
}
