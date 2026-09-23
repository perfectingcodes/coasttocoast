import { cn } from "@/lib/utils";

export interface Faq {
  q: string;
  a: string;
  /** Optional heading the question sits under. Rows without one are ungrouped. */
  group?: string;
}

/**
 * Native `<details>` accordion — works without JS, renders correctly in the
 * prerendered HTML, and stays keyboard accessible for free.
 *
 * Each question is a card with its own edge and its own shadow, not a row in a
 * divided box. Hairlines disappear on a busy page; a card has presence, lifts
 * under the cursor, and can carry an accent spine and a tinted answer panel
 * when it opens. The question is set large enough to be the thing you read
 * first, with the index in mono beside it.
 */
export function FaqList({
  faqs,
  className,
}: {
  faqs: readonly Faq[];
  className?: string;
}) {
  // Preserve source order; start a new heading whenever the group changes.
  const groups: { name?: string; items: Faq[] }[] = [];
  for (const f of faqs) {
    const last = groups[groups.length - 1];
    if (last && last.name === f.group) last.items.push(f);
    else groups.push({ name: f.group, items: [f] });
  }

  let n = 0;

  return (
    <div className={cn("mt-8", className)}>
      {groups.map((g, gi) => (
        <div key={g.name ?? gi} className={cn(gi > 0 && "mt-12")}>
          {g.name && (
            <div className="mb-4 flex items-center gap-4">
              <p className="font-display text-[0.66rem] font-extrabold uppercase tracking-[0.22em] text-navy">
                {g.name}
              </p>
              <span
                className="h-px flex-1 bg-gradient-to-r from-ember/60 to-transparent"
                aria-hidden="true"
              />
              <span className="font-mono text-[0.62rem] text-navy/40">
                {String(g.items.length).padStart(2, "0")}
              </span>
            </div>
          )}

          <div className="grid gap-3">
            {g.items.map((f) => {
              n += 1;
              const index = String(n).padStart(2, "0");
              return (
                <details
                  key={f.q}
                  className={cn(
                    "group relative overflow-hidden rounded-card bg-white ring-1 ring-navy/10",
                    "shadow-[0_1px_2px_rgb(7_26_61/0.04)] transition-shadow duration-300",
                    "hover:shadow-[var(--shadow-soft)] open:shadow-[var(--shadow-lift)] open:ring-navy/15",
                    "[&_summary::-webkit-details-marker]:hidden",
                  )}
                >
                  {/* Accent spine, drawn top-down as the card opens. */}
                  <span
                    className="pointer-events-none absolute left-0 top-0 h-full w-1 origin-top scale-y-0 bg-gradient-to-b from-orange-light to-ember transition-transform duration-500 group-open:scale-y-100"
                    aria-hidden="true"
                  />

                  <summary className="flex cursor-pointer list-none items-start gap-4 px-5 py-5 md:gap-6 md:px-7">
                    <span className="mt-1 font-mono text-[0.72rem] tabular-nums text-navy/35 transition-colors duration-300 group-hover:text-ember group-open:text-ember">
                      {index}
                    </span>

                    <span className="flex-1 font-display text-[1.05rem] font-extrabold leading-snug text-navy transition-colors duration-300 group-open:text-blue md:text-[1.15rem]">
                      {f.q}
                    </span>

                    {/* A plus that becomes a minus. One glyph, two states. */}
                    <span
                      className="relative mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-foam ring-1 ring-navy/10 transition-colors duration-300 group-hover:ring-navy/30 group-open:bg-blue group-open:ring-blue"
                      aria-hidden="true"
                    >
                      <span className="absolute h-[2px] w-3.5 rounded-full bg-navy transition-colors duration-300 group-open:bg-white" />
                      <span className="absolute h-[2px] w-3.5 rotate-90 rounded-full bg-navy transition-[transform,background-color] duration-300 group-open:rotate-0 group-open:bg-white" />
                    </span>
                  </summary>

                  <div className="border-t border-navy/8 bg-foam/70 px-5 py-5 md:px-7 md:pl-[4.1rem]">
                    <p className="max-w-2xl leading-relaxed text-navy/72">{f.a}</p>
                  </div>
                </details>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
