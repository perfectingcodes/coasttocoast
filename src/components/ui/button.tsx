import { Link } from "wouter";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "onDark" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold " +
  "font-[var(--font-display)] tracking-wide transition-[transform,background-color,box-shadow,color,border-color] " +
  "duration-200 active:translate-y-px disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  /** Sunset orange — the primary conversion action everywhere on the site. */
  primary:
    "bg-orange text-white shadow-[var(--shadow-orange)] hover:bg-orange-light",
  secondary: "bg-blue text-white hover:bg-blue-bright",
  /** Cyan hairline on dark grounds, as in the hero. */
  outline:
    "border-2 border-cyan/70 text-white hover:bg-cyan/15 hover:border-cyan",
  onDark: "bg-white text-navy hover:bg-cyan-light",
  ghost: "text-navy border-2 border-navy/15 hover:border-navy/35 hover:bg-navy/5",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-sm",
  lg: "h-14 px-8 text-base",
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
  return (
    <a href={href} className={cls}>
      {children}
    </a>
  );
}
