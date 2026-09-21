import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A direct, self-contained answer to the question the page title implies.
 *
 * Carries `data-answer`, which the page's `speakable` schema points at, so
 * voice assistants and answer engines have one unambiguous passage to quote.
 * Written to make sense lifted out of the page entirely — no "as mentioned
 * above", no pronouns pointing at earlier paragraphs.
 */
export function AnswerBlock({
  heading = "The short answer",
  children,
  className,
}: {
  heading?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <aside
      data-answer=""
      className={cn(
        "rounded-card border-l-4 border-cyan bg-foam p-6 md:p-7",
        className,
      )}
    >
      <p className="flex items-center gap-2 font-display text-[0.7rem] font-bold uppercase tracking-[0.18em] text-blue">
        <Sparkles className="size-3.5" aria-hidden="true" />
        {heading}
      </p>
      <div className="mt-3 text-[1.05rem] leading-relaxed text-navy/85">
        {children}
      </div>
    </aside>
  );
}

/**
 * Label/value rows. A real <table> rather than styled divs — it is what
 * extractors parse cleanly, and it reads correctly in a screen reader.
 */
export function FactTable({
  caption,
  rows,
  className,
}: {
  caption: string;
  rows: { label: string; value: ReactNode }[];
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-card ring-1 ring-navy/10", className)}>
      <table className="w-full border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={r.label}
              className={cn(
                "align-top",
                i % 2 === 0 ? "bg-white" : "bg-foam",
              )}
            >
              <th
                scope="row"
                className="w-2/5 px-5 py-3 font-display text-xs font-bold uppercase tracking-wide text-navy/55 md:w-1/3"
              >
                {r.label}
              </th>
              <td className="px-5 py-3 text-navy/85">{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
