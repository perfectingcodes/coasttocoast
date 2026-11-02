import { useEffect, useState } from "react";

/**
 * Settings the office types in once and the dashboard then uses everywhere.
 *
 * Same constraint as the CRM: no server, so this lives in the browser it was
 * entered in. That is fine for the review link — it is a public URL, not a
 * secret, and anyone who needs it can paste it again in ten seconds. It is
 * stated on the page rather than left to be discovered.
 */

const STORE = "cca.admin.settings.v1";
const CHANGED = "cca:settings-changed";

export interface AdminSettings {
  /** The Google review short link, from the Business Profile dashboard. */
  reviewLink: string;
  /** Who the review requests say they are from. */
  techName: string;
}

export const EMPTY_SETTINGS: AdminSettings = { reviewLink: "", techName: "" };

export function loadSettings(): AdminSettings {
  if (typeof window === "undefined") return EMPTY_SETTINGS;
  try {
    const raw = localStorage.getItem(STORE);
    return raw ? { ...EMPTY_SETTINGS, ...JSON.parse(raw) } : EMPTY_SETTINGS;
  } catch {
    return EMPTY_SETTINGS;
  }
}

export function saveSettings(next: Partial<AdminSettings>) {
  if (typeof window === "undefined") return;
  const merged = { ...loadSettings(), ...next };
  try {
    localStorage.setItem(STORE, JSON.stringify(merged));
  } catch {
    /* private browsing — it works for this session and not the next */
  }
  window.dispatchEvent(new CustomEvent(CHANGED));
}

/** Reads after mount, like everything else that touches localStorage. */
export function useSettings(): AdminSettings {
  const [settings, setSettings] = useState<AdminSettings>(EMPTY_SETTINGS);
  useEffect(() => {
    const read = () => setSettings(loadSettings());
    read();
    window.addEventListener(CHANGED, read);
    window.addEventListener("storage", read);
    return () => {
      window.removeEventListener(CHANGED, read);
      window.removeEventListener("storage", read);
    };
  }, []);
  return settings;
}

/**
 * Is this plausibly a Google review link?
 *
 * Google issues these in a few shapes — g.page/r/…/review, the search
 * ?placeid= form, and maps.app.goo.gl short links. Anything else is probably
 * the profile URL rather than the review URL, which lands people on the
 * listing instead of on the write-a-review box and costs most of the
 * conversions.
 */
export function checkReviewLink(url: string): { ok: boolean; note: string } {
  const v = url.trim();
  if (!v) return { ok: false, note: "" };
  if (!/^https?:\/\//i.test(v))
    return { ok: false, note: "Needs to start with https://" };
  if (/g\.page\/r\/.+\/review/i.test(v))
    return { ok: true, note: "Google review short link — this is the right one." };
  if (/search\.google\.com\/local\/writereview/i.test(v))
    return { ok: true, note: "Write-a-review link. Long, but it works." };
  if (/maps\.app\.goo\.gl/i.test(v))
    return {
      ok: true,
      note: "Maps short link. Check it opens the review box and not just the listing.",
    };
  if (/google\.[a-z.]+\/maps|business\.google\.com/i.test(v))
    return {
      ok: false,
      note: "That looks like the profile URL, not the review URL. In the Business Profile dashboard use Ask for reviews — it gives a g.page/r/…/review link that opens the star box directly.",
    };
  return { ok: true, note: "Saved. Open it on a phone to confirm it goes straight to the stars." };
}
