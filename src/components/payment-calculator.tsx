import { useId, useMemo, useState } from "react";
import { ArrowRight, Info, Phone } from "lucide-react";
import { business } from "@/content/site";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Monthly payment estimator.
 *
 * This is an illustration, not an offer of credit and not a quote. Every
 * input is visible and adjustable — including the rate — because the actual
 * APR comes from a third-party lender and depends on the customer's credit.
 * Hard-coding a flattering rate and presenting the output as "your payment"
 * would be misleading, so the assumptions stay on screen and the disclosure
 * sits directly under the figure.
 *
 * Nothing is submitted anywhere; the calculation runs entirely in the browser.
 */

const TERMS = [24, 36, 60, 84, 120] as const;

/** Standard amortised payment. Returns principal/term when the rate is zero. */
function monthlyPayment(principal: number, annualRatePct: number, months: number) {
  if (principal <= 0 || months <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  if (r === 0) return principal / months;
  return (principal * r) / (1 - Math.pow(1 + r, -months));
}

const money = (n: number, dp = 0) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  });

export function PaymentCalculator({ className }: { className?: string }) {
  const [amount, setAmount] = useState(9000);
  const [term, setTerm] = useState<number>(60);
  const [apr, setApr] = useState(9.99);
  const [down, setDown] = useState(0);

  const amountId = useId();
  const downId = useId();
  const aprId = useId();

  const { payment, financed, totalPaid, totalInterest } = useMemo(() => {
    const financed = Math.max(amount - down, 0);
    const payment = monthlyPayment(financed, apr, term);
    const totalPaid = payment * term;
    return {
      financed,
      payment,
      totalPaid,
      totalInterest: Math.max(totalPaid - financed, 0),
    };
  }, [amount, down, apr, term]);

  return (
    <div className={cn("card overflow-hidden", className)}>
      <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
        {/* ------------------------------------------------------- inputs */}
        <div className="p-6 md:p-8">
          <p className="eyebrow">Estimate a payment</p>
          <h3 className="poster mt-3 text-2xl md:text-[1.9rem]">
            What would it cost per month?
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-navy/65">
            Move the sliders to see how a replacement could be structured.
            Everything is adjustable, including the rate — your actual terms
            come from the lender.
          </p>

          <div className="mt-7 space-y-6">
            <Field
              id={amountId}
              label="Project cost"
              value={money(amount)}
              min={3000}
              max={30000}
              step={250}
              current={amount}
              onChange={setAmount}
              hint="A full system replacement in this market typically lands between $6,000 and $15,000 depending on tonnage, ductwork and efficiency."
            />
            <Field
              id={downId}
              label="Down payment"
              value={money(down)}
              min={0}
              max={Math.min(amount, 15000)}
              step={250}
              current={down}
              onChange={setDown}
            />
            <Field
              id={aprId}
              label="Assumed APR"
              value={`${apr.toFixed(2)}%`}
              min={0}
              max={24}
              step={0.25}
              current={apr}
              onChange={setApr}
              hint="Set by the lender based on credit. Shown here only so you can model different scenarios."
            />

            <fieldset>
              <legend className="font-display text-xs font-bold uppercase tracking-[0.14em] text-navy/55">
                Term
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {TERMS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTerm(t)}
                    aria-pressed={term === t}
                    className={cn(
                      "rounded-full px-4 py-2 font-display text-xs font-bold transition-colors",
                      term === t
                        ? "bg-navy text-white"
                        : "text-navy/70 ring-1 ring-navy/15 hover:ring-navy/40",
                    )}
                  >
                    {t} mo
                  </button>
                ))}
              </div>
            </fieldset>
          </div>
        </div>

        {/* ------------------------------------------------------ results */}
        <div className="band-navy grain relative flex flex-col justify-center p-6 text-white md:p-8">
          <p className="font-display text-[0.65rem] font-bold uppercase tracking-[0.2em] text-cyan">
            Estimated monthly payment
          </p>
          <p className="poster mt-3 text-[clamp(2.8rem,7vw,4rem)] text-white">
            {money(payment, 0)}
            <span className="ml-1 align-middle font-display text-base font-bold text-white/50">
              /mo
            </span>
          </p>

          <dl className="mt-6 space-y-2.5 border-t border-white/15 pt-5 text-sm">
            {[
              ["Amount financed", money(financed)],
              ["Term", `${term} months`],
              ["Assumed APR", `${apr.toFixed(2)}%`],
              ["Total interest", money(totalInterest)],
              ["Total repaid", money(totalPaid)],
            ].map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-4">
                <dt className="text-white/55">{k}</dt>
                <dd className="font-display font-bold text-white">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 flex items-start gap-2.5 rounded-xl bg-white/8 p-3.5 ring-1 ring-white/15">
            <Info className="mt-0.5 size-4 shrink-0 text-cyan" aria-hidden="true" />
            <p className="text-xs leading-relaxed text-white/70">
              <strong className="font-semibold text-white">
                An illustration, not an offer.
              </strong>{" "}
              Financing is provided by third-party lenders on approved credit.
              Your rate, term and payment are set by the lender and may differ
              from the figures above. Nothing here is an application, and
              nothing you enter is sent anywhere.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/contact" className="flex-1">
              Get a real quote
              <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href={business.phoneHref} variant="outline" className="flex-1">
              <Phone className="size-4" aria-hidden="true" />
              Talk it through
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  min,
  max,
  step,
  current,
  onChange,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  min: number;
  max: number;
  step: number;
  current: number;
  onChange: (n: number) => void;
  hint?: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label
          htmlFor={id}
          className="font-display text-xs font-bold uppercase tracking-[0.14em] text-navy/55"
        >
          {label}
        </label>
        <output htmlFor={id} className="font-display text-lg font-extrabold text-navy">
          {value}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={current}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2.5 h-2 w-full cursor-pointer appearance-none rounded-full bg-mist accent-orange"
      />
      {hint && <p className="mt-2 text-xs leading-relaxed text-navy/50">{hint}</p>}
    </div>
  );
}
