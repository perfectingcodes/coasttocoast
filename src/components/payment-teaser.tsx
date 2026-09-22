import { useId, useMemo, useState } from "react";
import { ArrowRight, Phone } from "lucide-react";
import { business } from "@/content/site";
import { money, monthlyPayment } from "@/components/payment-calculator";
import { SectionEyebrow } from "@/components/brand";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Home-page financing teaser.
 *
 * One slider and one number. The full estimator on /financing keeps the rate,
 * the term and the deposit adjustable; here the assumptions are printed
 * beside the figure instead, because a home page is the wrong place to make
 * someone set four inputs before they see anything.
 *
 * The same caveat applies as on the full calculator: this is an illustration,
 * not an offer, nothing is submitted anywhere, and the assumed rate is on
 * screen rather than buried.
 */

const TERM = 120;
const APR = 9.99;
const MIN = 4000;
const MAX = 18000;
const STEP = 500;

export function PaymentTeaser({ className }: { className?: string }) {
  const [amount, setAmount] = useState(9000);
  const id = useId();
  const payment = useMemo(() => monthlyPayment(amount, APR, TERM), [amount]);
  const pct = ((amount - MIN) / (MAX - MIN)) * 100;

  return (
    <div
      className={cn(
        "band-ocean grain relative overflow-hidden rounded-[2rem] ring-1 ring-white/12",
        className,
      )}
    >
      <div className="thermal-rule h-[3px] rounded-none" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -right-24 -top-28 size-[26rem] rounded-full bg-cyan/12 blur-[110px]"
        aria-hidden="true"
      />

      <div className="relative grid gap-8 p-6 md:p-9 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12">
        <div>
          <SectionEyebrow index={2} className="text-cyan">Financing</SectionEyebrow>
          <h2 className="poster mt-3 text-[clamp(1.7rem,3.2vw,2.35rem)] text-white">
            A new system,
            <span className="block text-chill">by the month.</span>
          </h2>
          <p className="mt-4 max-w-md leading-relaxed text-white/70">
            A replacement is rarely something you planned for. Move the slider to
            see roughly where a monthly payment lands before you talk to anyone.
          </p>

          <div className="mt-7">
            <label
              htmlFor={id}
              className="flex items-baseline justify-between gap-4 font-display text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-white/55"
            >
              System cost
              <span className="poster text-xl tracking-normal text-white">
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
              className="range-brand mt-3 w-full"
              style={{ "--pct": `${pct}%` } as React.CSSProperties}
            />
            <div className="mt-2 flex justify-between font-display text-[0.62rem] font-bold uppercase tracking-[0.14em] text-white/40">
              <span>{money(MIN)}</span>
              <span>{money(MAX)}</span>
            </div>
          </div>
        </div>

        <div className="rounded-[1.5rem] bg-white/8 p-6 ring-1 ring-white/15 backdrop-blur-sm">
          <p className="font-display text-[0.62rem] font-extrabold uppercase tracking-[0.2em] text-cyan">
            Estimated monthly payment
          </p>
          <p className="poster mt-2 text-[clamp(2.6rem,6vw,3.6rem)] leading-none text-white">
            {money(payment)}
            <span className="ml-1.5 align-middle font-display text-sm font-bold text-white/45">
              /mo
            </span>
          </p>
          <p className="mt-3 text-[0.78rem] leading-relaxed text-white/55">
            Illustration only, not an offer of credit. Assumes {APR}% APR over{" "}
            {TERM} months on approved credit through a third-party lender.
            Nothing here is an application.
          </p>

          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
            <ButtonLink href="/financing" variant="onDark" className="w-full sm:flex-1">
              See the full estimator
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
