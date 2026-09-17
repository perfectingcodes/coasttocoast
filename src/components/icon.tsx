import {
  Building2,
  Cog,
  Flame,
  Handshake,
  Map,
  ShieldCheck,
  Snowflake,
  Star,
  Users,
  Wind,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

/**
 * Every icon referenced by name from content/site.ts resolves here, so content
 * stays free of component imports.
 */
const map = {
  // service icons
  flame: Flame,
  snowflake: Snowflake,
  cog: Cog,
  wrench: Wrench,
  building: Building2,
  wind: Wind,
  // proof / feature icons
  shield: ShieldCheck,
  star: Star,
  zap: Zap,
  users: Users,
  handshake: Handshake,
  map: Map,
} satisfies Record<string, LucideIcon>;

export type IconKey = keyof typeof map;

export function Icon({
  name,
  className,
}: {
  name: IconKey;
  className?: string;
}) {
  const Cmp = map[name];
  return <Cmp className={className} aria-hidden="true" />;
}
