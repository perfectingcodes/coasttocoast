import { cn } from "@/lib/utils";

/**
 * The asset list, drawn as the document it is.
 *
 * The first thing we do on a commercial site is build the record most
 * buildings do not have: every unit tagged, aged and photographed, with the
 * consumables on file. Describing that in a paragraph undersells it — a
 * property manager knows exactly what this sheet is worth the moment they see
 * one — so the section shows the artefact instead of talking about it.
 *
 * The rows are a SAMPLE and labelled as one, twice. They are plausible, not
 * real: no client's building is shown here, and no manufacturer is named.
 */

type Condition = "Good" | "Fair" | "Plan";

const ROWS: {
  tag: string;
  unit: string;
  spec: string;
  age: number;
  condition: Condition;
  note: string;
}[] = [
  { tag: "RTU-1", unit: "7.5-ton rooftop unit", spec: "R-410A · 20×25×2 ×4 · belt A42", age: 11, condition: "Fair", note: "Contactor pitted" },
  { tag: "RTU-2", unit: "5-ton rooftop unit", spec: "R-410A · 20×20×2 ×4 · direct drive", age: 4, condition: "Good", note: "No action" },
  { tag: "RTU-3", unit: "10-ton rooftop unit", spec: "R-22 · 20×25×2 ×6 · belt B50", age: 17, condition: "Plan", note: "Budget replacement" },
  { tag: "AHU-1", unit: "Air handler, kitchen", spec: "16×25×4 ×2 · condensate pump", age: 8, condition: "Good", note: "Drain treated" },
  { tag: "MAU-1", unit: "Make-up air unit", spec: "Belt A38 · interlocked to hood", age: 9, condition: "Fair", note: "Belt worn" },
];

const TONE: Record<Condition, { dot: string; text: string }> = {
  Good: { dot: "bg-emerald-400", text: "text-emerald-300" },
  Fair: { dot: "bg-gold", text: "text-gold" },
  Plan: { dot: "bg-ember", text: "text-orange-light" },
};

export function AssetSheet({ className }: { className?: string }) {
  return (
    <figure className={cn("relative", className)}>
      {/* Registration marks, the way a plate is positioned on a press sheet. */}
      <span
        className="pointer-events-none absolute -left-3 -top-3 size-6 border-l border-t border-ember/60"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute -bottom-3 -right-3 size-6 border-b border-r border-ember/60"
        aria-hidden="true"
      />

      <div className="glass-instrument relative overflow-hidden">
        <div className="thermal-rule absolute inset-x-0 top-0 rounded-none" aria-hidden="true" />

        <div className="flex items-center justify-between gap-4 border-b border-white/12 px-5 pb-3 pt-5">
          <p className="font-mono text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-cyan">
            Asset list
          </p>
          <p className="rounded-full bg-white/10 px-2.5 py-1 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-white/70">
            Sample sheet
          </p>
        </div>

        <ul>
          {ROWS.map((r) => (
            <li
              key={r.tag}
              className="grid grid-cols-[3.4rem_minmax(0,1fr)_auto] items-start gap-x-3 border-b border-white/8 px-5 py-3 last:border-b-0"
            >
              <span className="pt-0.5 font-mono text-[0.72rem] font-semibold text-white">
                {r.tag}
              </span>
              <span className="min-w-0">
                <span className="block text-[0.86rem] font-semibold leading-snug text-white/92">
                  {r.unit}
                </span>
                <span className="mt-0.5 block font-mono text-[0.64rem] leading-relaxed text-white/50">
                  {r.spec}
                </span>
              </span>
              <span className="text-right">
                <span className="block font-mono text-[0.72rem] tabular-nums text-white/80">
                  {r.age} yr
                </span>
                <span
                  className={cn(
                    "mt-0.5 flex items-center justify-end gap-1.5 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.08em]",
                    TONE[r.condition].text,
                  )}
                >
                  <span className={cn("size-1.5 rounded-full", TONE[r.condition].dot)} aria-hidden="true" />
                  {r.note}
                </span>
              </span>
            </li>
          ))}
        </ul>

        <figcaption className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-white/12 bg-white/[0.04] px-5 py-3 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-white/50">
          <span>{ROWS.length} units · tagged, aged, photographed</span>
          <span>Illustrative — not a real site</span>
        </figcaption>
      </div>
    </figure>
  );
}
