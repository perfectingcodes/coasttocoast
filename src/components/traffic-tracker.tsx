import { useEffect } from "react";
import { useLocation } from "wouter";
import { startSession, track } from "@/lib/leads";

/**
 * Records what a visitor does on the public site so the dashboard has
 * something real to show. Page views on every navigation, plus three clicks
 * that matter commercially: tapping the phone number, reaching a quote form,
 * and opening the chat.
 *
 * It writes to this browser's own storage (see lib/leads.ts) and, if
 * VITE_LEADS_ENDPOINT is configured, forwards a copy. No cookies, no third
 * party, nothing that needs a consent banner.
 *
 * Mounted once, on public routes only — the dashboard counting its own
 * traffic would make every number meaningless.
 */
export function TrafficTracker() {
  const [location] = useLocation();

  useEffect(() => {
    startSession();
  }, []);

  useEffect(() => {
    if (location.startsWith("/admin")) return;
    track("view");
  }, [location]);

  useEffect(() => {
    // One delegated listener rather than a prop threaded through forty
    // components. Capture phase so it still fires when a handler inside
    // stops propagation.
    function onClick(event: MouseEvent) {
      const el = (event.target as HTMLElement | null)?.closest?.(
        "a[href], button",
      ) as HTMLAnchorElement | HTMLButtonElement | null;
      if (!el) return;

      const href = el.getAttribute("href") ?? "";
      const label = (el.textContent ?? "").trim().slice(0, 60);

      if (href.startsWith("tel:")) {
        track("call", label);
        return;
      }
      if (href.includes("#quote") || href === "/contact") {
        track("quote-open", label);
      }
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
