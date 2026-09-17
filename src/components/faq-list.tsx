import { ChevronDown } from "lucide-react";

/**
 * Native <details> accordion — works without JS, renders correctly in the
 * prerendered HTML, and stays keyboard accessible for free.
 */
export function FaqList({
  faqs,
}: {
  faqs: readonly { q: string; a: string }[];
}) {
  return (
    <div className="mt-10 divide-y divide-navy/10 rounded-card border border-navy/10 bg-white">
      {faqs.map((f) => (
        <details key={f.q} className="group px-5 py-4 md:px-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold marker:hidden">
            {f.q}
            <ChevronDown
              className="size-5 shrink-0 text-blue transition-transform group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <p className="mt-3 text-navy/70 leading-relaxed">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
