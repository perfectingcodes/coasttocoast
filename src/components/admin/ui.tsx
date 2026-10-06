import type { ReactNode } from "react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import type { Status } from "@/content/marketing";

/**
 * Dashboard primitives.
 *
 * Two rules hold this together. Neutrals are mixed from the brand navy, never
 * from Tailwind's grey — a dashboard built on slate looks like a different
 * company's product sitting inside this one. And a panel is allowed to be
 * more than a white box: the dark instrument card and the metric tile below
 * exist so a page can have a focal point instead of eight identical
 * rectangles stacked down the screen.
 */

/* ------------------------------------------------------------------ status */

const STATUS: Record<Status, { label: string; className: string; dot: string }> = {
  live: {
    label: "Live",
    className: "bg-emerald-500/12 text-emerald-700 ring-emerald-500/25",
    dot: "bg-emerald-500",
  },
  ready: { label: "Ready", className: "bg-cyan/18 text-[#0a5b7d] ring-cyan/40", dot: "bg-cyan" },
  draft: { label: "Draft", className: "bg-gold/20 text-amber-800 ring-gold/40", dot: "bg-gold" },
  blocked: { label: "Blocked", className: "bg-ember/10 text-ember ring-ember/25", dot: "bg-ember" },
  "not-connected": {
    label: "Not connected",
    className: "bg-navy/6 text-navy/55 ring-navy/12",
    dot: "bg-navy/35",
  },
};

export function StatusPill({ status, className }: { status: Status; className?: string }) {
  const s = STATUS[status];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.68rem] font-bold ring-1 ring-inset",
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
  /** Drop the inner padding when the content manages its own. */
  flush = false,
}: {
  title?: string;
  subtitle?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  flush?: boolean;
}) {
  return (
    <section
      className={cn(
        "min-w-0 overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgb(7_26_61/0.05),0_16px_36px_-22px_rgb(7_26_61/0.4)]",
        className,
      )}
    >
      {(title || action) && (
        <header className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3 px-5 pb-3.5 pt-4.5">
          <div className="min-w-0">
            {title && (
              <h2 className="flex items-center gap-2.5 font-display text-[0.95rem] font-extrabold tracking-[-0.015em] text-navy">
                <span
                  className="h-3.5 w-[3px] shrink-0 rounded-full bg-blue"
                  aria-hidden="true"
                />
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-1.5 max-w-prose pl-[1.4rem] text-[0.76rem] leading-relaxed text-navy/50">
                {subtitle}
              </p>
            )}
          </div>
          {action}
        </header>
      )}
      <div className={cn(flush ? "" : "px-5 pb-5", !title && !action && "pt-5")}>
        {children}
      </div>
    </section>
  );
}

/**
 * A metric tile. The number is the graphic — display weight, tabular figures,
 * tight tracking — and the accent bar down the left is the only colour, so a
 * row of these reads at a glance instead of needing to be parsed.
 */
export function StatCard({
  label,
  value,
  hint,
  tone = "default",
  icon,
  className,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: "default" | "good" | "warn" | "bad";
  icon?: ReactNode;
  className?: string;
}) {
  const tones = {
    default: { bar: "bg-blue", text: "text-navy", ghost: "text-blue/15" },
    good: { bar: "bg-emerald-500", text: "text-emerald-600", ghost: "text-emerald-500/15" },
    warn: { bar: "bg-gold", text: "text-amber-600", ghost: "text-gold/20" },
    bad: { bar: "bg-ember", text: "text-ember", ghost: "text-ember/15" },
  }[tone];

  return (
    <div
      className={cn(
        "relative min-w-0 overflow-hidden rounded-2xl bg-white px-5 py-4.5 shadow-[0_1px_2px_rgb(7_26_61/0.05),0_16px_36px_-22px_rgb(7_26_61/0.4)]",
        className,
      )}
    >
      <span
        className={cn("absolute inset-y-4 left-0 w-[3px] rounded-r-full", tones.bar)}
        aria-hidden="true"
      />
      {icon && (
        <span className={cn("absolute right-4 top-4 [&>svg]:size-7", tones.ghost)}>
          {icon}
        </span>
      )}
      <p className="font-display text-[0.6rem] font-extrabold uppercase tracking-[0.16em] text-navy/40">
        {label}
      </p>
      <p
        className={cn(
          "mt-2 font-display text-[2rem] font-extrabold leading-none tracking-[-0.035em] tabular-nums",
          tones.text,
        )}
      >
        {value}
      </p>
      {hint && (
        <p className="mt-2.5 text-[0.72rem] leading-snug text-navy/45">{hint}</p>
      )}
    </div>
  );
}

/**
 * The one card on a screen that is not white. Every page gets at most one —
 * it is how a grid of white tiles acquires a focal point and how the brand
 * gets into a tool that is otherwise all data.
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
        "band-navy grain edge-lit relative flex min-w-0 flex-col overflow-hidden rounded-2xl p-6 text-white shadow-[0_20px_44px_-24px_rgb(7_26_61/0.8)]",
        className,
      )}
    >
      <div
        className="grid-lines pointer-events-none absolute inset-0"
        aria-hidden="true"
      />
      <div className="relative">
        {eyebrow && (
          <p className="font-display text-[0.58rem] font-extrabold uppercase tracking-[0.2em] text-cyan">
            {eyebrow}
          </p>
        )}
        <p className="mt-3 font-display text-[1.35rem] font-extrabold leading-[1.1] tracking-[-0.025em]">
          {title}
        </p>
        <p className="mt-2.5 text-[0.82rem] leading-relaxed text-white/70">{body}</p>
        <Link
          href={href}
          className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[0.8rem] font-bold text-navy transition-colors hover:bg-cyan-light"
        >
          {action}
        </Link>
      </div>
    </div>
  );
}

/**
 * Dark instrument card — a readout, not a call to action. Used where a figure
 * needs to carry weight on its own.
 */
export function Instrument({
  label,
  value,
  footnote,
  children,
  className,
}: {
  label: string;
  value?: ReactNode;
  footnote?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "band-abyss grain edge-lit relative min-w-0 overflow-hidden rounded-2xl p-5 text-white shadow-[0_20px_44px_-24px_rgb(7_26_61/0.8)]",
        className,
      )}
    >
      <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative">
        <p className="font-display text-[0.58rem] font-extrabold uppercase tracking-[0.2em] text-cyan">
          {label}
        </p>
        {value !== undefined && (
          <p className="mt-3 font-display text-[2.4rem] font-extrabold leading-none tracking-[-0.04em] tabular-nums">
            {value}
          </p>
        )}
        {children}
        {footnote && (
          <p className="mt-3 font-mono text-[0.6rem] uppercase leading-relaxed tracking-[0.1em] text-white/45">
            {footnote}
          </p>
        )}
      </div>
    </div>
  );
}

/** Small uppercase label for a group of things inside a panel. */
export function Micro({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "font-display text-[0.58rem] font-extrabold uppercase tracking-[0.18em] text-navy/35",
        className,
      )}
    >
      {children}
    </p>
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
          <tr className="border-y border-navy/8 bg-navy/[0.02]">
            {columns.map((c) => (
              <th
                key={c}
                scope="col"
                className="px-5 py-2.5 font-display text-[0.58rem] font-extrabold uppercase tracking-[0.16em] text-navy/40"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-navy/6">{children}</tbody>
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
        "px-5 py-3 align-top text-[0.82rem]",
        muted ? "text-navy/55" : "text-navy/80",
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
    <div className="rounded-xl bg-navy/[0.03] p-5 ring-1 ring-inset ring-navy/8">
      <p className="flex items-center gap-2 font-display text-[0.88rem] font-extrabold text-navy">
        <span className="size-1.5 rounded-full bg-ember" aria-hidden="true" />
        {service} is not connected
      </p>
      <p className="mt-2 max-w-prose text-[0.82rem] leading-relaxed text-navy/60">
        {what}
      </p>
      <ol className="mt-4 space-y-2">
        {steps.map((s, i) => (
          <li key={s} className="flex gap-3 text-[0.8rem] text-navy/70">
            <span className="grid size-5 shrink-0 place-items-center rounded-full bg-white font-mono text-[0.6rem] font-bold text-navy/45 ring-1 ring-navy/10">
              {i + 1}
            </span>
            {s}
          </li>
        ))}
      </ol>
    </div>
  );
}
