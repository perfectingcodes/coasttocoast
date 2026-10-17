import { useEffect } from "react";

/**
 * GA4 and the Meta Pixel, both behind environment variables.
 *
 * Neither loads unless its ID is set, so a build with no IDs ships no
 * third-party script at all — which is why the site currently needs no
 * cookie banner. Set the variables, rebuild, and both start collecting.
 *
 *   VITE_GA4_ID=G-XXXXXXXXXX
 *   VITE_META_PIXEL_ID=000000000000000
 *
 * The Pixel matters on a date, not just in principle: a retargeting audience
 * needs roughly 30 days of traffic before it is large enough to run, so the
 * day this goes live is the day that clock starts.
 *
 * Loaded after mount rather than in the document head. These are measurement
 * scripts, not content — they should never block the first paint of a page
 * somebody arrived at from a paid click.
 */

const GA4 = import.meta.env.VITE_GA4_ID as string | undefined;
const PIXEL = import.meta.env.VITE_META_PIXEL_ID as string | undefined;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & { callMethod?: (...a: unknown[]) => void; queue?: unknown[][]; loaded?: boolean; version?: string; push?: unknown };
    _fbq?: unknown;
  }
}

function inject(src: string, async = true) {
  if (document.querySelector(`script[src="${src}"]`)) return;
  const s = document.createElement("script");
  s.src = src;
  s.async = async;
  document.head.appendChild(s);
}

export function Analytics() {
  useEffect(() => {
    if (!GA4) return;
    inject(`https://www.googletagmanager.com/gtag/js?id=${GA4}`);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA4);
  }, []);

  useEffect(() => {
    if (!PIXEL || window.fbq) return;
    // Meta's own loader, trimmed. The queue exists so events fired before the
    // script lands are not lost.
    const n: NonNullable<Window["fbq"]> = Object.assign(
      function (...args: unknown[]) {
        n.callMethod ? n.callMethod(...args) : n.queue!.push(args);
      } as NonNullable<Window["fbq"]>,
      { queue: [] as unknown[][], loaded: true, version: "2.0" },
    );
    window.fbq = n;
    window._fbq = n;
    inject("https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", PIXEL);
    window.fbq("track", "PageView");
  }, []);

  return null;
}
