import { useId, useMemo, useState } from "react";
import { ArrowRight, Phone } from "lucide-react";
import { business } from "@/content/site";
import { money, monthlyPayment } from "@/components/payment-calculator";
import { SectionEyebrow } from "@/components/brand";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Home-page financing teaser, built as an instrument rather than a panel.
 *
 * A light card carrying a dark readout: the controls sit on white where they
 * are obviously controls, and the figure sits on navy where it can be struck
 * in the same gold the Clean & Tune price uses. Money reads as metal
 * everywhere on this site, and it should be the same metal each time.
 *
 * The full estimator on /financing still owns the rate and the deposit. Here
 * the two inputs that actually move the number are exposed — what it costs and
 * how long you spread it over — and every assumption behind the figure is
 * printed next to it. It is an illustration, not an offer, and nothing is
 * submitted anywhere.
 */

const APR = 9.99;
const TERMS = [60, 84, 120] as const;
const MIN = 4000;
const MAX = 18000;
const STEP = 500;
/** Where the scale is marked. Real numbers, not decoration. */
const TICKS = [4000, 8000, 12000, 18000];

export function PaymentTeaser({ className }: { className?: string }) {
  const [amount, setAmount] = useState(9000);
  const [term, setTerm] = useState<number>(120);
  const id = useId();

  const payment = useMemo(
    () => monthlyPayment(amount, APR, term),
    [amount, term],
  );
  const pct = ((amount - MIN) / (MAX - MIN)) * 100;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[2rem] bg-white shadow-[0_40px_80px_-34px_rgb(5_15_38/0.45)] ring-1 ring-navy/10",
        className,
      )}
    >
      <div className="thermal-rule h-[3px] rounded-none" aria-hidden="true" />

      <div className="grid gap-8 p-6 md:p-9 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch lg:gap-12">
        {/* ------------------------------------------------------ controls */}
        <div className="flex flex-col">
          <SectionEyebrow index={2}>Financing</SectionEyebrow>
          <h2 className="poster mt-4 text-[clamp(1.7rem,3.2vw,2.35rem)]">
            A new system,
            <span className="block text-ember">by the month.</span>
          </h2>
          <p className="mt-4 max-w-md leading-relaxed text-navy/65">
            A replacement is rarely something you planned for. Move the two
            things that actually change the number and see where a payment
            lands before you talk to anyone.
          </p>

          <div className="mt-8">
            <label
              htmlFor={id}
              className="flex items-baseline justify-between gap-4 font-display text-[0.62rem] font-extrabold uppercase tracking-[0.2em] text-navy/45"
            >
              System cost
              <span className="poster text-xl tracking-normal text-navy">
                {money(amount)}
              </span>
            </label>

            <input
              id={id}
              type="range"
              min={MIN}
              max={MAX}
              step={STEP}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="range-brand range-brand-light mt-3 w-full"
              style={{ "--pct": `${pct}%` } as React.CSSProperties}
            />

            {/* Marked scale, so the slider reads as a measuring device. */}
            <div className="relative mt-2 h-5" aria-hidden="true">
              {TICKS.map((t) => {
                const left = ((t - MIN) / (MAX - MIN)) * 100;
                return (
                  <span
                    key={t}
                    className="absolute top-0 -translate-x-1/2 text-center"
                    style={{ left: `${left}%` }}
                  >
                    <span className="mx-auto block h-1.5 w-px bg-navy/20" />
                    <span className="mt-1 block font-mono text-[0.6rem] text-navy/40">
                      {t / 1000}k
                    </span>
                  </span>
                );
              })}
            </div>
          </div>

          <fieldset className="mt-7">
            <legend className="font-display text-[0.62rem] font-extrabold uppercase tracking-[0.2em] text-navy/45">
              Spread over
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {TERMS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTerm(t)}
                  aria-pressed={term === t}
                  className={cn(
                    "min-h-10 rounded-full px-4 font-display text-xs font-extrabold transition-colors",
                    term === t
                      ? "bg-navy text-white ring-1 ring-navy"
                      : "text-navy/65 ring-1 ring-navy/15 hover:ring-navy/40",
                  )}
                >
                  {t} mo
                </button>
              ))}
            </div>
          </fieldset>

          {/* Straight off the financing page, so the column carries its weight
              beside the readout and the two pages say the same thing. */}
          <ul className="mt-auto flex flex-col gap-2 border-t border-navy/10 pt-6 sm:flex-row sm:flex-wrap sm:gap-x-6">
            {["Decision in most cases the same day", "No prepayment penalty"].map(
              (t) => (
                <li
                  key={t}
                  className="flex items-center gap-2 font-display text-[0.7rem] font-bold text-navy/55"
                >
                  <span
                    className="size-1.5 shrink-0 rounded-full bg-ember"
                    aria-hidden="true"
                  />
                  {t}
                </li>
              ),
            )}
          </ul>
        </div>

        {/* ------------------------------------------------------- readout */}
        <div className="band-navy grain relative flex flex-col overflow-hidden rounded-[1.5rem] p-6 ring-1 ring-navy/15 md:p-7">
          <div
            className="pointer-events-none absolute -right-20 -top-24 size-80 rounded-full bg-gold/20 blur-[90px]"
            aria-hidden="true"
          />

          <div className="relative">
            <p className="font-display text-[0.6rem] font-extrabold uppercase tracking-[0.2em] text-cyan">
              Estimated monthly payment
            </p>
            <p className="poster text-bullion mt-2 text-[clamp(2.8rem,6.5vw,4rem)] leading-[0.85] drop-shadow-[0_10px_28px_rgb(255_140_20/0.25)]">
              {money(payment)}
              <span className="ml-1.5 align-middle font-display text-sm font-bold text-white/58">
                /mo
              </span>
            </p>

            <dl className="mt-5 border-t border-white/12 pt-4 font-mono text-[0.72rem] uppercase tracking-[0.08em]">
              {[
                ["Financed", money(amount)],
                ["Term", `${term} months`],
                ["Assumed APR", `${APR.toFixed(2)}%`],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-baseline justify-between gap-4 border-b border-white/8 py-1.5 last:border-b-0"
                >
                  <dt className="text-white/55">{k}</dt>
                  <dd className="text-white/85">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <p className="relative mt-5 text-[0.72rem] leading-relaxed text-white/50">
            An illustration, not an offer of credit. Your rate and term are set
            by a third-party lender on approved credit. Nothing here is an
            application.
          </p>

          <div className="relative mt-auto flex flex-col gap-2.5 pt-6 sm:flex-row">
            <ButtonLink
              href="/financing"
              variant="onDark"
              className="w-full sm:flex-1"
            >
              Full estimator
              <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink
              href={business.phoneHref}
              variant="outline"
              className="w-full sm:flex-1"
            >
              <Phone className="size-4" aria-hidden="true" />
              Talk it through
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
