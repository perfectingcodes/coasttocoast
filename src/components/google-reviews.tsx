import { ArrowUpRight, Star } from "lucide-react";
import { business, googleReviews, hasReviewData } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * Google's four-colour "G", used only to label links to the company's own
 * Google Business Profile — the ordinary "review us on Google" use.
 */
export function GoogleGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  );
}

function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            "size-4",
            i < Math.round(value) ? "fill-gold text-gold" : "text-navy/20",
          )}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

/**
 * Compact trust chip. Shows a real rating only when the client has supplied
 * one; otherwise it is an honest link to the profile.
 */
export function GoogleBadge({
  className,
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  const real = hasReviewData();
  return (
    <a
      href={googleReviews.profileUrl}
      target="_blank"
      rel="noreferrer noopener"
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full px-4 py-2 transition-colors",
        onDark
          ? "bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/15"
          : "bg-white text-navy ring-1 ring-navy/12 hover:ring-navy/25",
        className,
      )}
    >
      <GoogleGlyph className="size-4 shrink-0" />
      {real ? (
        <>
          <Stars value={googleReviews.rating!} />
          <span className="text-sm font-semibold">
            {googleReviews.rating!.toFixed(1)}
            <span className={cn("ml-1 font-medium", onDark ? "text-white/60" : "text-navy/55")}>
              ({googleReviews.count} reviews)
            </span>
          </span>
        </>
      ) : (
        <span className="text-sm font-semibold">Reviews on Google</span>
      )}
    </a>
  );
}

/**
 * The same link as `GoogleBadge`, built as a badge rather than a pill so it
 * can stand in a row of proof marks beside the locally-owned seal. Shows a
 * real rating only when one has been supplied.
 */
export function GoogleSeal({ className }: { className?: string }) {
  const real = hasReviewData();
  return (
    <a
      href={googleReviews.profileUrl}
      target="_blank"
      rel="noreferrer noopener"
      className={cn(
        "group flex items-center gap-2.5 transition-opacity hover:opacity-90",
        className,
      )}
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white shadow-[0_8px_18px_-8px_rgb(3_18_48/0.7)] ring-1 ring-white/50 transition-transform duration-300 group-hover:-translate-y-0.5">
        <GoogleGlyph className="size-5" />
      </span>
      <span className="leading-tight">
        {real ? (
          <>
            <span className="poster block text-[1.15rem] leading-none text-white">
              {googleReviews.rating!.toFixed(1)}
            </span>
            <span className="mt-1 block font-display text-[0.55rem] font-extrabold uppercase tracking-[0.16em] text-cyan-light">
              {googleReviews.count} Google reviews
            </span>
          </>
        ) : (
          <>
            <span className="block font-display text-[0.6rem] font-extrabold uppercase tracking-[0.16em] text-white/70">
              Reviews on
            </span>
            <span className="block font-display text-sm font-extrabold uppercase tracking-[0.06em] text-white">
              Google
            </span>
          </>
        )}
      </span>
    </a>
  );
}

/**
 * Larger card for the testimonials section and the contact page — invites the
 * customer to leave a review, which is the part that actually builds the
 * profile over time.
 */
export function GoogleReviewCard({ className }: { className?: string }) {
  const real = hasReviewData();
  return (
    <div className={cn("card flex flex-col gap-4 p-6 sm:flex-row sm:items-center", className)}>
      <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-foam ring-1 ring-navy/10">
        <GoogleGlyph className="size-7" />
      </span>

      <div className="flex-1">
        {real ? (
          <>
            <p className="flex items-center gap-2">
              <Stars value={googleReviews.rating!} />
              <span className="font-display font-extrabold text-navy">
                {googleReviews.rating!.toFixed(1)}
              </span>
            </p>
            <p className="mt-1 text-sm text-navy/60">
              from {googleReviews.count} Google reviews of {business.name}
            </p>
          </>
        ) : (
          <>
            <p className="font-display font-extrabold text-navy">
              Read our reviews on Google
            </p>
            <p className="mt-1 text-sm leading-relaxed text-navy/60">
              Every review on our profile is from a real {business.city}-area
              customer. Worked with us? Leaving one takes a minute and helps
              your neighbours choose.
            </p>
          </>
        )}
      </div>

      <div className="flex shrink-0 flex-col gap-2">
        <a
          href={googleReviews.profileUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-navy px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-soft"
        >
          Read reviews
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </a>
        <a
          href={googleReviews.reviewUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold text-navy ring-1 ring-navy/15 transition-colors hover:ring-navy/35"
        >
          Leave a review
        </a>
      </div>
    </div>
  );
}
