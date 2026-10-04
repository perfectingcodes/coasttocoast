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
        "relative overflow-hidden rounded-card bg-foam p-6 ring-1 ring-navy/10 md:p-8",
        className,
      )}
    >
      {/* The thermal rule caps it, the way it caps every other panel on the
          site — this is the passage answer engines quote, so it should look
          like the most considered thing on the page. */}
      <div className="thermal-rule absolute inset-x-0 top-0 h-[3px] rounded-none" aria-hidden="true" />

      <p className="flex items-center gap-2.5 font-display text-[0.62rem] font-extrabold uppercase tracking-[0.2em] text-navy/55">
        <Sparkles className="size-3.5 text-ember" aria-hidden="true" />
        {heading}
      </p>
      <div className="mt-3.5 text-[1.05rem] leading-relaxed text-navy/85 md:text-[1.12rem]">
        {children}
      </div>
    </aside>
  );
}

/**
 * Label/value rows. A real <table> rather than styled divs — it is what
 * extractors parse cleanly, and it reads correctly in a screen reader — but
 * set as a spec sheet rather than a zebra-striped default: hairline rows, the
 * label in display caps, the value in mono.
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
    <div className={cn("overflow-hidden rounded-card bg-white ring-1 ring-navy/10", className)}>
      <table className="w-full border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="group align-top border-b border-navy/8 last:border-b-0">
              <th
                scope="row"
                className="relative w-2/5 py-3.5 pl-6 pr-4 font-display text-[0.6rem] font-extrabold uppercase tracking-[0.16em] text-navy/50 md:w-[34%]"
              >
                <span
                  className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-r-full bg-ember/0 transition-colors duration-300 group-hover:bg-ember"
                  aria-hidden="true"
                />
                {r.label}
              </th>
              <td className="py-3.5 pr-6 font-mono text-[0.82rem] leading-relaxed text-navy/85">
                {r.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
