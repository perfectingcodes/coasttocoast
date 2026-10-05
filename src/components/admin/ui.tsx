import type { ReactNode } from "react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import type { Status } from "@/content/marketing";

/* ------------------------------------------------------------------ status */

const STATUS: Record<Status, { label: string; className: string; dot: string }> = {
  live: { label: "Live", className: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  ready: { label: "Ready", className: "bg-cyan/12 text-sky-700", dot: "bg-cyan" },
  draft: { label: "Draft", className: "bg-gold/15 text-amber-700", dot: "bg-gold" },
  blocked: { label: "Blocked", className: "bg-ember/10 text-ember", dot: "bg-ember" },
  "not-connected": {
    label: "Not connected",
    className: "bg-slate-100 text-slate-500",
    dot: "bg-slate-400",
  },
};

export function StatusPill({ status, className }: { status: Status; className?: string }) {
  const s = STATUS[status];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold",
        s.className,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", s.dot)} aria-hidden="true" />
      {s.label}
    </span>
  );
}

/* ------------------------------------------------------------------ panels */

export function Panel({
  title,
  subtitle,
  action,
  children,
  className,
}: {
  title?: string;
  subtitle?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "min-w-0 rounded-2xl bg-white shadow-[0_1px_2px_rgb(10_35_82/0.04),0_12px_28px_-18px_rgb(10_35_82/0.35)]",
        className,
      )}
    >
      {(title || action) && (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            {title && (
              <h2 className="font-display text-sm font-bold tracking-tight text-slate-900">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-1 text-xs leading-relaxed text-slate-500">{subtitle}</p>
            )}
          </div>
          {action}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function StatCard({
  label,
  value,
  hint,
  tone = "default",
  icon,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: "default" | "good" | "warn" | "bad";
  icon?: ReactNode;
}) {
  const tones = {
    default: { text: "text-slate-900", tile: "bg-blue/10 text-blue" },
    good: { text: "text-emerald-600", tile: "bg-emerald-50 text-emerald-600" },
    warn: { text: "text-amber-600", tile: "bg-gold/15 text-amber-600" },
    bad: { text: "text-ember", tile: "bg-ember/10 text-ember" },
  }[tone];

  return (
    <div className="min-w-0 rounded-2xl bg-white p-5 shadow-[0_1px_2px_rgb(10_35_82/0.04),0_12px_28px_-18px_rgb(10_35_82/0.35)]">
      <div className="flex items-start gap-3">
        {icon && (
          <span className={cn("grid size-9 shrink-0 place-items-center rounded-full", tones.tile)}>
            {icon}
          </span>
        )}
        <div className="min-w-0">
          <p className="text-[0.72rem] font-semibold text-slate-500">{label}</p>
          <p className={cn("mt-1 font-display text-[1.75rem] font-extrabold leading-none", tones.text)}>
            {value}
          </p>
        </div>
      </div>
      {hint && <p className="mt-3 text-xs leading-snug text-slate-500">{hint}</p>}
    </div>
  );
}

/**
 * The one card on a screen that is not white — a brand-blue panel for the
 * thing the reader should do next. Modelled on the feature cell in a good
 * dashboard: it is how a flat grid of white cards gets a focal point.
 */
export function FeatureCard({
  eyebrow,
  title,
  body,
  action,
  href,
  className,
}: {
  eyebrow?: string;
  title: string;
  body: string;
  action: string;
  href: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "band-ocean grain relative flex min-w-0 flex-col overflow-hidden rounded-2xl p-6 text-white",
        className,
      )}
    >
      <div className="thermal-rule absolute inset-x-0 top-0 h-[3px] rounded-none" aria-hidden="true" />
      {eyebrow && (
        <p className="font-display text-[0.6rem] font-extrabold uppercase tracking-[0.2em] text-cyan">
          {eyebrow}
        </p>
      )}
      <p className="mt-3 font-display text-lg font-extrabold leading-tight">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-white/72">{body}</p>
      <Link
        href={href}
        className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-cyan-light"
      >
        {action}
      </Link>
    </div>
  );
}

/* ------------------------------------------------------------------ tables */

export function Table({
  columns,
  children,
}: {
  columns: string[];
  children: ReactNode;
}) {
  return (
    <div className="-mx-5 overflow-x-auto" data-wide="">
      <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            {columns.map((c) => (
              <th
                key={c}
                scope="col"
                className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">{children}</tbody>
      </table>
    </div>
  );
}

export function Td({
  children,
  className,
  muted = false,
}: {
  children: ReactNode;
  className?: string;
  muted?: boolean;
}) {
  return (
    <td
      className={cn(
        "px-5 py-3 align-top",
        muted ? "text-slate-500" : "text-slate-700",
        className,
      )}
    >
      {children}
    </td>
  );
}

/* ------------------------------------------------------------- empty state */

/**
 * Shown wherever a panel needs a live account the site does not have. Says
 * plainly that there is no data rather than inventing a number.
 */
export function NotConnected({
  service,
  what,
  steps,
}: {
  service: string;
  what: string;
  steps: string[];
}) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50/60 p-6">
      <p className="font-display text-sm font-bold text-slate-900">
        {service} is not connected
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{what}</p>
      <ol className="mt-4 space-y-1.5">
        {steps.map((s, i) => (
          <li key={s} className="flex gap-2.5 text-sm text-slate-600">
            <span className="grid size-5 shrink-0 place-items-center rounded-full bg-white text-[0.65rem] font-bold text-slate-500 ring-1 ring-slate-300">
              {i + 1}
            </span>
            {s}
          </li>
        ))}
      </ol>
    </div>
  );
}
