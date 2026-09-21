import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Status } from "@/content/marketing";

/* ------------------------------------------------------------------ status */

const STATUS: Record<Status, { label: string; className: string }> = {
  live: { label: "Live", className: "bg-emerald-50 text-emerald-700 ring-emerald-600/20" },
  ready: { label: "Ready", className: "bg-sky-50 text-sky-700 ring-sky-600/20" },
  draft: { label: "Draft", className: "bg-amber-50 text-amber-700 ring-amber-600/20" },
  blocked: { label: "Blocked", className: "bg-rose-50 text-rose-700 ring-rose-600/20" },
  "not-connected": {
    label: "Not connected",
    className: "bg-slate-100 text-slate-600 ring-slate-500/20",
  },
};

export function StatusPill({ status, className }: { status: Status; className?: string }) {
  const s = STATUS[status];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        s.className,
        className,
      )}
    >
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
        "rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgb(15_23_42/0.04)]",
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
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: "default" | "good" | "warn" | "bad";
}) {
  const tones = {
    default: "text-slate-900",
    good: "text-emerald-600",
    warn: "text-amber-600",
    bad: "text-rose-600",
  };
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className={cn("mt-2 font-display text-2xl font-extrabold", tones[tone])}>
        {value}
      </p>
      {hint && <p className="mt-1 text-xs leading-snug text-slate-500">{hint}</p>}
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
    <div className="-mx-5 overflow-x-auto">
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
