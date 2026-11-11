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

/**
 * Rounded rectangles with a flat fill. The previous buttons were pills with a
 * gradient, a coloured glow and a sheen that swept across on hover — three
 * effects on one control, which is the texture of a template. A button on a
 * contractor's site should look like something you press, once.
 */
const base =
  "relative inline-flex items-center justify-center gap-2 rounded-[0.7rem] " +
  "font-[var(--font-display)] font-bold " +
  "transition-[transform,box-shadow,color,border-color,background-color] duration-150 " +
  "active:translate-y-px disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  /** Orange — the primary conversion action everywhere on the site. */
  primary:
    "bg-[#f25a0b] text-white shadow-[var(--shadow-orange)] hover:bg-[#dd4d05]",
  secondary: "bg-blue text-white shadow-[var(--shadow-cyan)] hover:bg-[#1259c4]",
  /** Hairline on dark grounds. */
  outline:
    "border border-white/45 text-white hover:border-white hover:bg-white/10",
  onDark: "bg-white text-navy shadow-[0_1px_2px_rgb(5_15_38/0.25)] hover:bg-foam",
  ghost: "text-navy border border-navy/20 hover:border-navy/45 hover:bg-navy/[0.03]",
  /** Secondary offers. */
  gold: "bg-gold text-navy hover:bg-[#f5a40f]",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-[0.82rem]",
  md: "h-12 px-5 text-[0.88rem]",
  lg: "h-[3.25rem] px-6 text-[0.95rem]",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md") {
  return cn(base, variants[variant], sizes[size]);
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
  const external = /^https?:/i.test(href);
  return (
    <a
      href={href}
      className={cls}
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
    >
      {children}
    </a>
  );
}
