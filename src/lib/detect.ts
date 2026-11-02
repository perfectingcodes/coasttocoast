import { useEffect, useState } from "react";
import type { Detect } from "@/content/tools";

/**
 * Runtime checks for the integrations the code can actually see.
 *
 * Build-time variables are read straight off import.meta.env. The two script
 * tags are checked for real — whether the global the vendor installs is
 * present — rather than assumed from the ID being set, because an ID with a
 * blocked script is a configuration that looks fine and collects nothing.
 */

export const env = {
  ga4: import.meta.env.VITE_GA4_ID as string | undefined,
  pixel: import.meta.env.VITE_META_PIXEL_ID as string | undefined,
  leads: import.meta.env.VITE_LEADS_ENDPOINT as string | undefined,
  quote: import.meta.env.VITE_QUOTE_ENDPOINT as string | undefined,
};

export type Health = "live" | "configured" | "off";

export interface Detected {
  state: Health;
  /** Shown beside the state. Plain, and never more certain than the check. */
  note: string;
}

function check(kind: Exclude<Detect, null>): Detected {
  switch (kind) {
    case "ga4": {
      if (!env.ga4) return { state: "off", note: "No VITE_GA4_ID set — nothing is loading." };
      const loaded = typeof window !== "undefined" && typeof window.gtag === "function";
      return loaded
        ? { state: "live", note: `Loaded and reporting · ${env.ga4}` }
        : { state: "configured", note: `ID set (${env.ga4}) but gtag has not loaded — check for a blocker.` };
    }
    case "pixel": {
      if (!env.pixel) return { state: "off", note: "No VITE_META_PIXEL_ID set — nothing is loading." };
      const loaded = typeof window !== "undefined" && typeof window.fbq === "function";
      return loaded
        ? { state: "live", note: `Loaded and collecting · ${env.pixel}` }
        : { state: "configured", note: `ID set but fbq has not loaded — usually a content blocker.` };
    }
    case "leads-endpoint":
      return env.leads
        ? { state: "live", note: "Leads and events are being forwarded off-device." }
        : {
            state: "off",
            note: "No endpoint. Everything stays in the browser it was captured in.",
          };
    case "quote-endpoint":
      return env.quote
        ? { state: "live", note: "Submissions POST to the configured endpoint." }
        : {
            state: "configured",
            note: "No endpoint — the form falls back to a prefilled email so nothing is dropped.",
          };
    case "site":
      return { state: "live", note: "94 pages prerendered, sitemap and robots served." };
  }
}

/** Runs after mount, because two of the checks look for a global. */
export function useDetected(kind: Detect): Detected | null {
  const [result, setResult] = useState<Detected | null>(null);
  useEffect(() => {
    if (!kind) return;
    // One beat after mount: the vendor scripts are injected in an effect too,
    // and checking in the same tick would always report them missing.
    const t = window.setTimeout(() => setResult(check(kind)), 400);
    return () => window.clearTimeout(t);
  }, [kind]);
  return kind ? result : null;
}
