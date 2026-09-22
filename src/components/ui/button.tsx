import { Link } from "wouter";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "onDark"
  | "ghost"
  | "gold";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full " +
  "font-[var(--font-display)] font-extrabold tracking-wide " +
  "transition-[transform,box-shadow,color,border-color,background-color] duration-200 " +
  "hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  /** Electric orange — the primary conversion action everywhere on the site. */
  primary:
    "bg-gradient-to-b from-orange-light to-ember text-white shadow-[var(--shadow-orange)] " +
    "ring-1 ring-inset ring-white/25 hover:shadow-[0_16px_40px_-8px_rgb(255_106_19/0.7)]",
  secondary:
    "bg-gradient-to-b from-blue-bright to-blue text-white shadow-[var(--shadow-cyan)] ring-1 ring-inset ring-white/20",
  /** Cyan hairline on dark grounds. */
  outline:
    "border-2 border-cyan/60 text-white hover:border-cyan hover:bg-cyan/12 hover:shadow-[var(--shadow-cyan)]",
  onDark: "bg-white text-navy shadow-[0_12px_30px_-12px_rgb(5_15_38/0.7)] hover:bg-cyan-light",
  ghost: "text-navy border-2 border-navy/15 hover:border-blue/45 hover:bg-blue/5",
  /** Financing and secondary offers. */
  gold: "bg-gradient-to-b from-gold to-orange text-navy ring-1 ring-inset ring-white/30 shadow-[0_10px_28px_-10px_rgb(255_176_32/0.7)]",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-[0.8rem]",
  md: "h-12 px-6 text-[0.85rem]",
  lg: "h-14 px-8 text-[0.95rem]",
};

/** Sheen that sweeps across a filled button on hover. */
const SHEEN =
  "before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r " +
  "before:from-transparent before:via-white/25 before:to-transparent before:transition-transform " +
  "before:duration-700 hover:before:translate-x-full motion-reduce:before:hidden";

const FILLED: Variant[] = ["primary", "secondary", "gold", "onDark"];

export function buttonClass(variant: Variant = "primary", size: Size = "md") {
  return cn(base, variants[variant], sizes[size], FILLED.includes(variant) && SHEEN);
}

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant,
  size,
  className,
  children,
  ...rest
}: CommonProps & ComponentProps<"button">) {
  return (
    <button className={cn(buttonClass(variant, size), className)} {...rest}>
      {children}
    </button>
  );
}

/** Renders an internal route through wouter, anything else as a plain anchor. */
export function ButtonLink({
  href,
  variant,
  size,
  className,
  children,
}: CommonProps & { href: string }) {
  const cls = cn(buttonClass(variant, size), className);
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={cls}>
      {children}
    </a>
  );
}
