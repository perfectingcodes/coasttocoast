import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Phone, X } from "lucide-react";
import { business, cleanAndTune } from "@/content/site";
import { loadCrm, track } from "@/lib/leads";
import { cn } from "@/lib/utils";

/**
 * The $89 offer, as a modal.
 *
 * Popups are hated when they are badly timed and tolerated when they are not,
 * so this one earns its place:
 *
 * - It never fires on load. It waits for one of three signals that the
 *   visitor is actually reading — twelve seconds of dwell, 40% of the page
 *   scrolled, or the pointer leaving the top of the window on desktop.
 * - Dismissing it snoozes it for two weeks in this browser.
 * - Anyone who has already sent a quote request never sees it at all.
 * - Escape closes it, focus is trapped while it is open and returned to the
 *   page when it closes, and the page behind it cannot scroll.
 *
 * It also carries no fake urgency and no struck-through "was" price. The
 * anchor price this offer discounts from is unconfirmed (see the note in
 * content/site.ts and the conflicts list in the admin), and inventing one to
 * make a popup convert is exactly the kind of thing that is hard to walk
 * back. $89 is a real published price and it is enough on its own.
 */

const STORE = "cca.offer.v1";
const SNOOZE_DAYS = 14;
const DWELL_MS = 12_000;
const SCROLL_TRIGGER = 0.4;

/** Three of the ten points — the ones a homeowner recognises. */
const HIGHLIGHTS = [
  "Capacitor readings taken and recorded",
  "Condenser and evaporator coils cleaned",
  "Drain line flushed and treated",
];

function snoozed(): boolean {
  try {
    const raw = localStorage.getItem(STORE);
    if (!raw) return false;
    const until = Number(raw);
    return Number.isFinite(until) && Date.now() < until;
  } catch {
    // Storage blocked. Better to stay quiet than to show on every page view.
    return true;
  }
}

export function OfferPopup() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const fired = useRef(false);

  const close = useCallback((remember = true) => {
    setOpen(false);
    if (!remember) return;
    try {
      localStorage.setItem(STORE, String(Date.now() + SNOOZE_DAYS * 86_400_000));
    } catch {
      /* nothing to remember it with */
    }
  }, []);

  /* --------------------------------------------------------- when to show */
  useEffect(() => {
    setMounted(true);
    if (snoozed()) return;
    // Somebody who already asked for a quote does not need the offer pushed
    // at them — they are further down the funnel than this popup.
    if (loadCrm().leads.length > 0) return;

    const show = () => {
      if (fired.current) return;
      fired.current = true;
      setOpen(true);
      track("offer");
    };

    const timer = window.setTimeout(show, DWELL_MS);

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max >= SCROLL_TRIGGER) show();
    };

    // Exit intent, desktop only. On a phone there is no pointer to leave.
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) show();
    };
    const desktop = window.matchMedia("(min-width: 1024px)").matches;

    window.addEventListener("scroll", onScroll, { passive: true });
    if (desktop) document.addEventListener("mouseout", onLeave);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseout", onLeave);
    };
  }, []);

  /* ------------------------------------------------- behaviour while open */
  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus();

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab" || !panel.current) return;
      // Keep Tab inside the dialog. Without this the focus ring walks off
      // into the page behind, which for a keyboard user is the same as the
      // dialog not closing.
      const focusable = panel.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus?.();
    };
  }, [open, close]);

  if (!mounted || !open) return null;

  return (
    <div
      // z-70: the chat launcher sits at z-60 and was floating over the dialog.
      className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="offer-title"
    >
      {/* Backdrop in the brand navy rather than neutral black. */}
      <button
        type="button"
        aria-label="Close the offer"
        onClick={() => close()}
        className="absolute inset-0 bg-abyss/82 backdrop-blur-md motion-safe:animate-[fade_200ms_ease-out]"
      />

      <div
        ref={panel}
        className={cn(
          "band-navy grain relative w-full max-w-2xl overflow-hidden rounded-t-[1.75rem] text-white shadow-[0_40px_90px_-30px_rgb(3_12_32/0.9)] ring-1 ring-white/15",
          "sm:rounded-[1.75rem]",
          "motion-safe:animate-[rise_320ms_cubic-bezier(0.22,1,0.36,1)]",
        )}
      >
        <div className="thermal-rule absolute inset-x-0 top-0 rounded-none" aria-hidden="true" />
        {/* Warm light behind the price, cool light behind the list — the same
            two lamps the Clean & Tune section on this page uses. */}
        <div
          className="pointer-events-none absolute -left-20 -top-32 size-[26rem] rounded-full bg-gold/35 blur-[80px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-28 -right-24 size-[20rem] rounded-full bg-cyan/14 blur-[90px]"
          aria-hidden="true"
        />
        <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden="true" />

        <button
          ref={closeBtn}
          type="button"
          onClick={() => close()}
          aria-label="Close"
          className="absolute right-3 top-3 z-20 grid size-11 place-items-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="size-5" aria-hidden="true" />
        </button>

        <div className="relative px-6 pb-7 pt-9 sm:px-9 sm:pb-9 sm:pt-10 lg:pr-32">
          <p className="flex items-center gap-3">
            <span className="rounded-full bg-gradient-to-b from-gold to-orange px-3 py-1.5 font-display text-[0.6rem] font-extrabold uppercase tracking-[0.18em] text-navy shadow-[0_8px_20px_-6px_rgb(255_176_32/0.8)]">
              Pre-season service
            </span>
            <span className="h-px flex-1 bg-white/20" aria-hidden="true" />
          </p>

          <div className="mt-5 flex items-end gap-5">
            <p className="poster text-[clamp(3.6rem,16vw,5.5rem)] leading-[0.8] text-white drop-shadow-[0_8px_28px_rgb(255_176_32/0.35)]">
              {cleanAndTune.price}
            </p>
            <p className="pb-2 font-mono text-[0.65rem] uppercase leading-relaxed tracking-[0.14em] text-cyan">
              {cleanAndTune.unit}
              <span className="mt-0.5 block text-white/45">10-point service</span>
            </p>
          </div>

          <h2
            id="offer-title"
            className="mt-4 max-w-sm font-display text-[1.35rem] font-extrabold leading-[1.15] tracking-[-0.025em] sm:text-[1.6rem]"
          >
            The {cleanAndTune.name}, booked before the season turns.
          </h2>
          <p className="mt-3 max-w-md text-[0.92rem] leading-relaxed text-white/72">
            Most summer breakdowns start as something a spring service would
            have caught. You get the readings in writing and no obligation to
            do anything with them.
          </p>

          <ul className="mt-5 grid gap-2">
            {HIGHLIGHTS.map((h) => (
              <li key={h} className="flex items-start gap-2.5 text-[0.88rem] text-white/85">
                <Check className="mt-0.5 size-4 shrink-0 text-cyan" aria-hidden="true" />
                {h}
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href="#clean-and-tune"
              onClick={() => {
                track("quote-open", "Offer popup");
                close();
              }}
              className="inline-flex h-[3.25rem] flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-gradient-to-b from-orange-light to-ember px-5 font-display text-[0.92rem] font-extrabold text-white shadow-[var(--shadow-orange)] ring-1 ring-inset ring-white/25 transition-transform hover:-translate-y-0.5"
            >
              Book the {cleanAndTune.price} Clean &amp; Tune
            </a>
            <a
              href={business.phoneHref}
              onClick={() => {
                track("call", "Offer popup");
                close();
              }}
              className="inline-flex h-[3.25rem] shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full border-2 border-cyan/55 px-5 font-display text-[0.88rem] font-extrabold text-white transition-colors hover:bg-cyan/12"
            >
              <Phone className="size-4 shrink-0" aria-hidden="true" />
              {business.phone}
            </a>
          </div>

          <p className="mt-4 font-mono text-[0.58rem] uppercase tracking-[0.13em] text-white/40">
            Lic. {business.license} · No obligation · {business.emergency}
          </p>
        </div>

        {/* The mascot, cropped by the card edge so it reads as part of the
            furniture rather than as a sticker dropped on top. */}
        <img
          src="/brand/mascot-bust.webp"
          srcSet="/brand/mascot-bust-sm.webp 400w, /brand/mascot-bust.webp 800w"
          sizes="150px"
          alt=""
          width={800}
          height={849}
          loading="lazy"
          className="pointer-events-none absolute -bottom-4 -right-5 hidden w-32 opacity-95 drop-shadow-[0_18px_34px_rgb(3_12_32/0.7)] lg:block"
        />
      </div>
    </div>
  );
}
