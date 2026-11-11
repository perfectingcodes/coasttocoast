import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "wouter";
import { ArrowRight, Check, Phone, X } from "lucide-react";
import { business } from "@/content/site";
import { landingPages } from "@/content/landing";
import { QuoteForm } from "@/components/quote-form";
import { BookingContext, useBooking, walk, type BookingIntent } from "@/lib/booking";
import { track } from "@/lib/leads";
import { cn } from "@/lib/utils";

/**
 * The form, as a pop-up.
 *
 * Every "Book a walk" button used to send people to /contact: a page load,
 * a scroll, and the thing they were reading gone. Now the form comes to
 * them — a sheet from the bottom on a phone, a centred panel on a desk.
 *
 * It is a native <dialog>, so the browser supplies the parts that are easy
 * to get wrong by hand: focus stays inside it, Escape closes it, and the
 * page behind is inert to a screen reader.
 */
export function BookingProvider({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [intent, setIntent] = useState<BookingIntent | null>(null);
  const [location] = useLocation();

  const open = useCallback((next: BookingIntent = "walk", source?: string) => {
    setIntent(next);
    track("quote-open", source ?? (next === "walk" ? "Equipment walk" : "Quote"));
  }, []);
  const value = useMemo(() => ({ open }), [open]);

  useEffect(() => {
    const el = ref.current;
    if (!intent || !el) return;
    if (!el.open) el.showModal();
    // The page behind must not scroll under a thumb that misses the sheet.
    const root = document.documentElement;
    const before = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = before;
    };
  }, [intent]);

  // A link inside the pop-up (or the back button) changes the page: let go.
  useEffect(() => setIntent(null), [location]);

  const isWalk = intent === "walk";

  return (
    <BookingContext.Provider value={value}>
      {children}

      {intent && (
        <dialog
          ref={ref}
          aria-labelledby={titleId}
          className="booking-dialog"
          onClose={() => setIntent(null)}
          // The dialog has no padding, so a click that lands on the element
          // itself can only have landed on the dimmed page around it.
          onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
        >
          <div className="sticky top-0 z-10 h-0">
            <button
              type="button"
              onClick={() => ref.current?.close()}
              aria-label="Close"
              className="absolute right-3 top-3 grid size-11 place-items-center rounded-full bg-white text-navy shadow-[0_4px_14px_-4px_rgb(5_15_38/0.5)] ring-1 ring-navy/10 transition-colors hover:bg-foam"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          <div className="grid md:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)]">
            {/* ------------------------------------------------ what it is */}
            <div className="band-navy grain relative px-5 pb-6 pt-7 text-white md:p-8">
              <p className="pr-12 font-mono text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-cyan">
                {isWalk ? "Free · No obligation" : "Request a quote"}
              </p>
              <h2
                id={titleId}
                className="poster mt-3 pr-10 text-[1.7rem] text-white md:text-[2rem]"
              >
                {isWalk ? "Book an equipment walk" : "Tell us what you need"}
              </h2>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-white/80">
                {isWalk
                  ? walk.oneLine
                  : "Two minutes on the form. You get a real price before any work starts."}
              </p>

              {isWalk && (
                <ol className="mt-6 hidden gap-4 md:grid">
                  {walk.steps.map((step, i) => (
                    <li key={step.title} className="flex gap-3.5">
                      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white/12 font-mono text-xs font-semibold text-cyan ring-1 ring-inset ring-white/20">
                        {i + 1}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-display text-sm font-extrabold text-white">
                          {step.title}
                        </span>
                        <span className="mt-0.5 block text-[0.82rem] leading-relaxed text-white/65">
                          {step.body}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              )}

              <a
                href={business.phoneHref}
                onClick={() => track("call", "Booking pop-up")}
                className="mt-5 flex min-h-12 items-center gap-3 border-t border-white/15 pt-4 md:mt-7 md:pt-5"
              >
                <Phone className="size-4 shrink-0 text-orange-light" aria-hidden="true" />
                <span className="leading-tight">
                  <span className="block text-xs text-white/60">
                    Rather talk? Answered 24/7
                  </span>
                  <span className="block font-display text-base font-extrabold text-white">
                    {business.phone}
                  </span>
                </span>
              </a>
            </div>

            {/* --------------------------------------------------- the form */}
            <div className="px-5 pb-6 pt-5 md:p-8 md:pt-14">
              <QuoteForm variant={isWalk ? "walk" : "full"} plain />
            </div>
          </div>
        </dialog>
      )}
    </BookingContext.Provider>
  );
}

/**
 * Call and book, under the thumb.
 *
 * On a desk both sit in the header the whole way down the page. On a phone
 * the header has room for an icon and a menu, so the two things a visitor
 * came to do ride along the bottom edge instead — after the first screen,
 * which already carries its own buttons.
 */
export function MobileActionBar() {
  const booking = useBooking();
  const [location] = useLocation();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const on = window.scrollY > 360;
      setShown(on);
      // The chat launcher shares this bar's row and follows the same cue.
      document.documentElement.toggleAttribute("data-scrolled", on);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Paid pages carry their own bar; the dashboard and the bio page want none.
  if (
    location.startsWith("/admin") ||
    location === "/links" ||
    landingPages.some((lp) => lp.path === location)
  ) {
    return null;
  }

  // The contact page is the form. Offering to pop it up over itself is noise.
  const canBook = booking && location !== "/contact";

  return (
    <div
      inert={!shown}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t border-navy/10 bg-white/95 pl-3 pr-[4.25rem] pt-2.5 shadow-[0_-10px_30px_-18px_rgb(5_15_38/0.55)] backdrop-blur transition-transform duration-300 ease-out print:hidden md:hidden",
        "pb-[max(0.625rem,env(safe-area-inset-bottom))]",
        shown ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="flex gap-2.5">
        <a
          href={business.phoneHref}
          onClick={() => track("call", "Mobile bar")}
          className={cn(
            "flex h-12 items-center justify-center gap-2 rounded-[0.7rem] border border-navy/15 bg-white font-display text-[0.9rem] font-extrabold text-navy active:bg-foam",
            canBook ? "w-[34%] shrink-0" : "flex-1",
          )}
        >
          <Phone className="size-4 text-orange" aria-hidden="true" />
          {canBook ? "Call" : `Call ${business.phone}`}
        </a>
        {canBook && (
          <button
            type="button"
            onClick={() => booking.open("walk", "Mobile bar")}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-[0.7rem] bg-[#f25a0b] font-display text-[0.9rem] font-extrabold text-white active:bg-[#d94e06]"
          >
            Book a free walk
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}

/** The three terms of the walk as a row of ticks. Shared by the home page. */
export function WalkTerms({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-x-5 gap-y-2", className)}>
      {walk.terms.map((t) => (
        <li key={t} className="flex items-center gap-2 text-sm font-semibold">
          <Check className="size-4 shrink-0 text-cyan" aria-hidden="true" />
          {t}
        </li>
      ))}
    </ul>
  );
}
