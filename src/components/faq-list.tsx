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
 * Rows are hairlines rather than boxes: a stack of bordered cards competes
 * with the cards everywhere else on the page, and the question is the only
 * thing here that needs to be seen from across the room. The open row gets an
 * ember tick down its left edge, which is the same mark the reasons band and
 * the service cards use.
 */
export function FaqList({
  faqs,
  className,
}: {
  faqs: readonly Faq[];
  className?: string;
}) {
  // Preserve source order; start a new heading whenever the group changes.
  const groups: { name?: string; items: readonly Faq[] }[] = [];
  for (const f of faqs) {
    const last = groups[groups.length - 1];
    if (last && last.name === f.group) {
      (last.items as Faq[]).push(f);
    } else {
      groups.push({ name: f.group, items: [f] });
    }
  }

  return (
    <div className={cn("mt-8", className)}>
      {groups.map((g, gi) => (
        <div key={g.name ?? gi} className={cn(gi > 0 && "mt-10")}>
          {g.name && (
            <p className="flex items-center gap-3 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-navy/45">
              <span
                className="h-px w-6 shrink-0 bg-ember"
                aria-hidden="true"
              />
              {g.name}
            </p>
          )}

          <div className={cn("border-t border-navy/12", g.name && "mt-3")}>
            {g.items.map((f) => (
              <details
                key={f.q}
                className="group relative border-b border-navy/12 [&_summary::-webkit-details-marker]:hidden"
              >
                {/* Ember tick on the open row. */}
                <span
                  className="pointer-events-none absolute -left-px top-0 h-full w-[3px] origin-top scale-y-0 bg-ember transition-transform duration-300 group-open:scale-y-100"
                  aria-hidden="true"
                />

                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-4 pl-0 pr-1 font-display text-[1.02rem] font-extrabold text-navy transition-[padding,color] duration-300 group-open:text-blue group-hover:pl-3 group-open:pl-4">
                  {f.q}
                  {/* A plus that becomes a minus. One glyph, two states, no
                      icon swap. */}
                  <span
                    className="relative grid size-8 shrink-0 place-items-center rounded-full ring-1 ring-navy/15 transition-colors duration-300 group-hover:ring-navy/40 group-open:bg-blue group-open:ring-blue"
                    aria-hidden="true"
                  >
                    <span className="absolute h-[2px] w-3 rounded-full bg-navy transition-colors duration-300 group-open:bg-white" />
                    <span className="absolute h-[2px] w-3 rotate-90 rounded-full bg-navy transition-[transform,background-color] duration-300 group-open:rotate-0 group-open:bg-white" />
                  </span>
                </summary>

                <p className="max-w-2xl pb-5 pl-0 pr-10 leading-relaxed text-navy/70 transition-[padding] duration-300 group-open:pl-4">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
