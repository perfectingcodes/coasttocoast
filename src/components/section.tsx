import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Standard vertical rhythm + optional heading block for a page section. */
export function Section({
  eyebrow,
  title,
  lead,
  children,
  className,
  center = false,
  id,
}: {
  eyebrow?: string;
  title?: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
  className?: string;
  center?: boolean;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-16 md:py-24", className)}>
      <div className="shell">
        {(eyebrow || title || lead) && (
          <div className={cn("max-w-2xl", center && "mx-auto text-center")}>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {title && (
              <h2 className="mt-3 text-3xl md:text-4xl leading-tight">{title}</h2>
            )}
            {lead && (
              <p className="mt-4 text-lg text-navy/70 leading-relaxed">{lead}</p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
