import type { ReactNode } from "react";
import { Link } from "wouter";
import { ArrowRight, Check, Phone, ShieldCheck } from "lucide-react";
import { business, cleanAndTune, locations, type Service } from "@/content/site";
import { GoogleSeal } from "@/components/google-reviews";
import type { HeroTone } from "@/components/layout/site-layout";
import { AnswerBlock, FactTable } from "@/components/answer";
import { QuoteForm } from "@/components/quote-form";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { FaqList } from "@/components/faq-list";
import { cn } from "@/lib/utils";

/**
 * The body of a service page, one component per `detail.kind`.
 *
 * These deliberately do not share a skeleton. Maintenance is sold on a price
 * and a checklist, commercial on property type, air quality on symptoms — so
 * the column structure, the presence of a sticky form, and the order of
 * sections all differ. Only the hero, the city matrix and the closing CTA are
 * common, because those are navigation rather than content.
 */

interface BodyProps {
  service: Service;
  answer: string;
}

/* ------------------------------------------------------ heating: seasonal */

export function SeasonalBody({ service, answer }: BodyProps) {
  if (service.detail.kind !== "seasonal") return null;
  const d = service.detail;

  return (
    <>
      {/* Single wide column — no sidebar. The point of this page is the
          four failure modes, so nothing competes with them. */}
      <section className="shell max-w-4xl py-14 md:py-18">
        <AnswerBlock>{answer}</AnswerBlock>
        <p className="mt-8 leading-relaxed text-navy/80 md:text-lg">{service.intro}</p>
      </section>

      <section className="band-navy py-14 text-white md:py-18">
        <div className="shell">
          <h2 className="text-2xl text-white md:text-3xl">{d.heading}</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-white/70">{d.lead}</p>
          <ol className="mt-10 grid gap-6 md:grid-cols-2">
            {d.items.map((it, i) => (
              <li key={it.title} className="flex gap-5">
                <span className="display shrink-0 text-4xl text-cyan/70">
                  0{i + 1}
                </span>
                <div>
                  <h3 className="text-base text-white">{it.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">
                    {it.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="shell max-w-4xl py-14 md:py-18">
        <h2 className="text-2xl">What is included</h2>
        <ul className="mt-5 space-y-2.5">
          {service.bullets.map((b) => (
            <li key={b} className="flex items-start gap-3">
              <Check className="mt-1 size-4 shrink-0 text-cyan" aria-hidden="true" />
              <span className="leading-relaxed text-navy/80">{b}</span>
            </li>
          ))}
        </ul>
        <h2 className="mt-12 text-2xl">Common questions</h2>
        <FaqList faqs={service.faqs} />
        <div id="quote" className="mt-12 scroll-mt-28">
          <QuoteForm defaultService={service.name} />
        </div>
      </section>
    </>
  );
}

/**
 * Numbered section heading, the running spine the home page and the city
 * pages both use. Shared here so the service bodies stop inventing their own.
 */
export function ServiceHead({
  index,
  children,
}: {
  index: number;
  children: ReactNode;
}) {
  return (
    <div className="mt-12 first:mt-0">
      <p className="flex items-center gap-3 font-display text-[0.6rem] font-extrabold uppercase tracking-[0.2em] text-navy/45">
        <span className="tabular-nums text-ember">
          {String(index).padStart(2, "0")}
        </span>
        <span className="h-px w-7 bg-ember/60" aria-hidden="true" />
      </p>
      <h2 className="poster mt-3 text-[clamp(1.4rem,2.4vw,1.85rem)]">{children}</h2>
    </div>
  );
}

/* ------------------------------------------------------ cooling: lifespan */

/**
 * The life of a system in this climate, drawn to scale.
 *
 * This page is about why equipment here lasts 10–15 years instead of twenty,
 * and that number was buried in a stat line. It is the page's subject, so it
 * gets to be the page's picture: a twenty-year scale with the typical range
 * marked on it and the phases named. Same figure the home page's readout
 * uses, from the same place in the content.
 */
function LifespanScale({ from, to, max = 20 }: { from: number; to: number; max?: number }) {
  const phases = [
    { at: 0, label: "Install", note: "Commissioned and balanced" },
    { at: 3, label: "Maintenance years", note: "Twice-yearly service" },
    { at: from, label: "Typical range ends", note: "Where systems here land" },
    { at: to + 2, label: "Past the range", note: "Second opinion territory" },
  ];
  const pct = (y: number) => (y / max) * 100;

  return (
    <figure className="band-navy grain edge-lit relative overflow-hidden rounded-card p-7 text-white md:p-9">
      <figcaption className="font-display text-[0.62rem] font-extrabold uppercase tracking-[0.2em] text-cyan">
        The life of a system here
      </figcaption>
      <p className="poster mt-3 text-[clamp(1.6rem,3vw,2.2rem)]">
        {from}–{to} years
        <span className="ml-3 align-middle font-display text-sm font-bold text-white/55">
          not twenty
        </span>
      </p>

      <div className="relative mt-9">
        <div className="h-2.5 w-full rounded-full bg-white/15" aria-hidden="true">
          <div
            className="absolute top-0 h-2.5 rounded-full bg-gradient-to-r from-cyan to-cyan-light"
            style={{ width: `${pct(from)}%` }}
          />
          <div
            className="absolute top-0 h-2.5 rounded-full bg-gradient-to-r from-gold to-orange"
            style={{ left: `${pct(from)}%`, width: `${pct(to) - pct(from)}%` }}
          />
        </div>

        {/* Year ticks, so the band is read as a measurement. */}
        <div className="relative mt-2 h-4" aria-hidden="true">
          {[0, 5, 10, 15, 20].map((y) => (
            <span
              key={y}
              className="absolute top-0 -translate-x-1/2 text-center"
              style={{ left: `${pct(y)}%` }}
            >
              <span className="mx-auto block h-1.5 w-px bg-white/30" />
              <span className="mt-1 block font-mono text-[0.6rem] text-white/50">{y}</span>
            </span>
          ))}
        </div>
      </div>

      <ol className="mt-7 grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
        {phases.map((ph, i) => (
          <li key={ph.label} className="border-t border-white/15 pt-3.5">
            <p className="font-mono text-[0.62rem] tabular-nums text-cyan">
              {ph.at === 0 ? "YR 0" : `YR ${ph.at}+`}
            </p>
            <p className="mt-1.5 font-display text-[0.92rem] font-extrabold leading-tight text-white">
              {ph.label}
            </p>
            <p className="mt-1 text-[0.78rem] leading-snug text-white/65">{ph.note}</p>
            <span className="sr-only">Phase {i + 1}</span>
          </li>
        ))}
      </ol>
    </figure>
  );
}

export function LifespanBody({ service, answer }: BodyProps) {
  if (service.detail.kind !== "lifespan") return null;
  const d = service.detail;

  return (
    <>
      <section className="shell py-14 md:py-18">
        <div className="grid items-start gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div className="min-w-0">
            <AnswerBlock>{answer}</AnswerBlock>

            <ServiceHead index={1}>{d.heading}</ServiceHead>
            <p className="mt-5 leading-relaxed text-navy/80 md:text-lg">{d.lead}</p>
            <p className="mt-4 leading-relaxed text-navy/75">{service.intro}</p>

            <ServiceHead index={2}>What is included</ServiceHead>
            <ul className="mt-6 grid gap-x-8 sm:grid-cols-2">
              {service.bullets.map((b, i) => (
                <li
                  key={b}
                  className="flex items-start gap-3 border-t border-navy/10 py-3.5 first:border-t-0 sm:[&:nth-child(2)]:border-t-0"
                >
                  <span className="mt-0.5 font-mono text-[0.7rem] font-semibold tabular-nums text-ember">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[0.95rem] leading-relaxed text-navy/80">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Symptom checklist rather than a form — the form comes later. */}
          <aside className="card overflow-hidden lg:sticky lg:top-28">
            <div className="thermal-rule h-[3px] rounded-none" aria-hidden="true" />
            <div className="px-6 pb-2 pt-6">
              <p className="font-display text-[0.6rem] font-extrabold uppercase tracking-[0.2em] text-ember">
                Check for these
              </p>
              <h2 className="poster mt-2.5 text-xl">{d.signsHeading}</h2>
            </div>
            <ul className="mt-3">
              {d.signs.map((sign, i) => (
                <li
                  key={sign}
                  className="flex items-start gap-3 border-t border-navy/8 px-6 py-3"
                >
                  <span className="mt-0.5 font-mono text-[0.65rem] tabular-nums text-ember/80">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[0.88rem] leading-relaxed text-navy/80">
                    {sign}
                  </span>
                </li>
              ))}
            </ul>
            <div className="border-t border-navy/8 bg-foam/70 p-6">
              <p className="text-sm leading-relaxed text-navy/68">
                Any of these means the system is telling you something. A
                diagnostic gives you a flat price before anything is opened.
              </p>
              <ButtonLink href={business.phoneHref} className="mt-4 w-full">
                <Phone className="size-4" aria-hidden="true" />
                {business.phone}
              </ButtonLink>
            </div>
          </aside>
        </div>

        {/* The page's own number, at the size the page's argument deserves. */}
        <div className="mt-16">
          <LifespanScale from={10} to={15} />
        </div>
      </section>

      <section className="bg-foam py-14 md:py-18">
        <div className="shell grid items-start gap-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="text-2xl">Common questions</h2>
            <FaqList faqs={service.faqs} />
          </div>
          <div id="quote" className="scroll-mt-28">
            <QuoteForm defaultService={service.name} />
          </div>
        </div>
      </section>
    </>
  );
}

/* -------------------------------------------------- mechanical: credential */

export function CredentialBody({ service, answer }: BodyProps) {
  if (service.detail.kind !== "credential") return null;
  const d = service.detail;

  return (
    <>
      {/* Licences are established in the hero on this page. */}
      <section className="shell max-w-4xl py-14 md:py-18">
        <AnswerBlock>{answer}</AnswerBlock>
        <h2 className="mt-10 text-2xl md:text-3xl">{d.heading}</h2>
        <p className="mt-4 leading-relaxed text-navy/80 md:text-lg">{d.lead}</p>
      </section>

      {/* Alternating rows, one per component — visually unlike the card grids
          used elsewhere on the site. */}
      <div>
        {d.components.map((c, i) => (
          <section
            key={c.name}
            className={cn("py-9", i % 2 === 1 ? "bg-foam" : "bg-white")}
          >
            <div className="shell max-w-4xl">
              <Reveal>
                <div className="grid gap-4 md:grid-cols-[0.4fr_1fr] md:gap-10">
                  <h3 className="flex items-baseline gap-3 text-xl">
                    <span className="font-display text-sm font-bold text-blue">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {c.name}
                  </h3>
                  <p className="leading-relaxed text-navy/75">{c.body}</p>
                </div>
              </Reveal>
            </div>
          </section>
        ))}
      </div>

      <section className="shell py-14 md:py-18">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="text-2xl">Who issues the permit</h2>
            <p className="mt-3 leading-relaxed text-navy/70">
              Mechanical work is inspected work, and the office that signs it
              off depends on where you live. We pull the permit either way.
            </p>
            <FactTable
              className="mt-6"
              caption="Permitting authority by city"
              rows={locations.map((l) => ({
                label: l.city,
                value: l.permitAuthority,
              }))}
            />
          </div>
          <div>
            <h2 className="text-2xl">Common questions</h2>
            <FaqList faqs={service.faqs} />
            <div id="quote" className="mt-10 scroll-mt-28">
              <QuoteForm defaultService={service.name} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------- maintenance: the offer */

export function OfferBody({ service, answer }: BodyProps) {
  return (
    <>
      {/* The published price is the page. It leads, at full width. */}
      <section className="shell py-14 md:py-18">
        <div className="card overflow-hidden lg:grid lg:grid-cols-[0.8fr_1.2fr]">
          <div className="band-navy flex flex-col justify-center p-8 text-white md:p-10">
            <p className="font-display text-[0.7rem] font-bold uppercase tracking-[0.22em] text-cyan">
              Published price
            </p>
            <p className="mt-4 flex items-baseline gap-2">
              <span className="display text-6xl text-white md:text-7xl">
                {cleanAndTune.price}
              </span>
              <span className="text-sm font-semibold text-white/60">
                {cleanAndTune.unit}
              </span>
            </p>
            <h2 className="mt-3 text-2xl text-white md:text-3xl">
              {cleanAndTune.name}
            </h2>
            <p className="mt-4 leading-relaxed text-white/70">
              {cleanAndTune.summary}
            </p>
            <div className="mt-7 flex flex-col gap-3">
              <ButtonLink href="#quote">Book a visit</ButtonLink>
              <ButtonLink href={business.phoneHref} variant="outline">
                <Phone className="size-4" aria-hidden="true" />
                {business.phone}
              </ButtonLink>
            </div>
          </div>

          <div className="p-8 md:p-10">
            <p className="eyebrow">Every visit, all ten points</p>
            <ol className="mt-6 grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
              {cleanAndTune.checklist.map((item, i) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-blue/10 font-display text-[0.7rem] font-bold text-blue">
                    {i + 1}
                  </span>
                  <span className="text-sm leading-relaxed text-navy/80">
                    {item}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="bg-foam py-14 md:py-18">
        <div className="shell max-w-4xl">
          <AnswerBlock className="bg-white">{answer}</AnswerBlock>
          <p className="mt-8 leading-relaxed text-navy/80 md:text-lg">
            {service.intro}
          </p>
          <ul className="mt-8 grid gap-2.5 sm:grid-cols-2">
            {service.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2.5">
                <Check className="mt-1 size-4 shrink-0 text-cyan" aria-hidden="true" />
                <span className="text-sm leading-relaxed text-navy/75">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="shell max-w-4xl py-14 md:py-18">
        <h2 className="text-2xl">Common questions</h2>
        <FaqList faqs={service.faqs} />
        <div id="quote" className="mt-12 scroll-mt-28">
          <QuoteForm defaultService={service.name} />
        </div>
      </section>
    </>
  );
}

/* --------------------------------------------------- commercial: segments */

export function SegmentsBody({ service, answer }: BodyProps) {
  if (service.detail.kind !== "segments") return null;
  const d = service.detail;

  return (
    <>
      <section className="shell max-w-4xl py-14 md:py-16">
        <AnswerBlock>{answer}</AnswerBlock>
        <h2 className="mt-10 text-2xl md:text-3xl">{d.heading}</h2>
        <p className="mt-4 leading-relaxed text-navy/80 md:text-lg">{d.lead}</p>
      </section>

      {/* Two wide segment panels per row, each with its own bullet list —
          nothing else on the site uses this shape. */}
      <section className="pb-4">
        <div className="shell grid gap-6 lg:grid-cols-2">
          {d.segments.map((seg, i) => (
            <Reveal key={seg.name} delay={i * 0.05}>
              <div className="card h-full border-t-4 border-t-blue p-7">
                <h3 className="text-xl">{seg.name}</h3>
                <p className="mt-3 leading-relaxed text-navy/70">{seg.body}</p>
                <ul className="mt-5 space-y-2 border-t border-navy/8 pt-5">
                  {seg.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2.5">
                      <Check
                        className="mt-1 size-4 shrink-0 text-cyan"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-navy/75">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="shell max-w-4xl py-14 md:py-18">
        <p className="leading-relaxed text-navy/80 md:text-lg">{service.intro}</p>
        <h2 className="mt-10 text-2xl">Common questions</h2>
        <FaqList faqs={service.faqs} />
      </section>

      {/* B2B ask: a site visit, not a same-day repair. */}
      <section className="band-navy py-14 md:py-16">
        <div className="shell grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="text-2xl text-white md:text-3xl">
              Request a site visit
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-white/70">
              For a multi-building property or a facility with occupied hours to
              work around, the useful first step is walking the equipment. Tell
              us the property type and we will schedule it.
            </p>
          </div>
          <div id="quote" className="scroll-mt-28">
            <QuoteForm defaultService={service.name} />
          </div>
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------ air quality: symptoms */

export function SymptomsBody({ service, answer }: BodyProps) {
  if (service.detail.kind !== "symptoms") return null;
  const d = service.detail;

  return (
    <>
      <section className="shell max-w-4xl py-14 md:py-16">
        <AnswerBlock>{answer}</AnswerBlock>
        <h2 className="mt-10 text-2xl md:text-3xl">{d.heading}</h2>
        <p className="mt-4 leading-relaxed text-navy/80 md:text-lg">{d.lead}</p>
      </section>

      {/* A genuine three-column diagnostic table — the centrepiece of the
          page, and a shape used nowhere else on the site. */}
      <section className="shell pb-14 md:pb-18">
        <div className="overflow-x-auto rounded-card ring-1 ring-navy/10" data-wide="">
          <table className="w-full min-w-[46rem] border-collapse text-left text-sm">
            <caption className="sr-only">
              Indoor air quality symptoms, likely causes and the corresponding fix
            </caption>
            <thead>
              <tr className="bg-navy text-white">
                {["What you notice", "Usually because", "What we do"].map((h) => (
                  <th
                    key={h}
                    scope="col"
                    className="px-5 py-3.5 font-display text-xs font-bold uppercase tracking-[0.12em]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {d.rows.map((r, i) => (
                <tr
                  key={r.symptom}
                  className={cn("align-top", i % 2 === 0 ? "bg-white" : "bg-foam")}
                >
                  <th
                    scope="row"
                    className="w-1/4 px-5 py-4 font-semibold text-navy"
                  >
                    {r.symptom}
                  </th>
                  <td className="w-2/5 px-5 py-4 leading-relaxed text-navy/70">
                    {r.cause}
                  </td>
                  <td className="px-5 py-4 leading-relaxed text-navy/85">
                    {r.fix}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-foam py-14 md:py-18">
        <div className="shell grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="leading-relaxed text-navy/80 md:text-lg">
              {service.intro}
            </p>
            <ul className="mt-7 grid gap-2.5 sm:grid-cols-2">
              {service.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2.5">
                  <Check className="mt-1 size-4 shrink-0 text-cyan" aria-hidden="true" />
                  <span className="text-sm leading-relaxed text-navy/75">{b}</span>
                </li>
              ))}
            </ul>
            <h2 className="mt-10 text-2xl">Common questions</h2>
            <FaqList faqs={service.faqs} />
          </div>
          <div id="quote" className="scroll-mt-28">
            <QuoteForm defaultService={service.name} />
          </div>
        </div>
      </section>
    </>
  );
}

/* --------------------------------------------------------- shared tail */

/** Internal linking, common to every service page. */
export function CityMatrix({ service }: { service: Service }) {
  return (
    <section className="shell py-14 md:py-18">
      <h2 className="text-2xl md:text-3xl">{service.short} by city</h2>
      <p className="mt-3 max-w-2xl leading-relaxed text-navy/65">
        Each city page covers the permitting office, ZIP codes and coastal
        conditions that change how this work is done locally.
      </p>
      <ul className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {locations.map((l) => (
          <li key={l.slug}>
            <Link
              href={`/locations/${l.slug}/${service.slug}`}
              className="card card-hover flex h-full flex-col p-4"
            >
              <span className="font-display text-xs font-bold uppercase tracking-wide text-blue">
                {l.county}
              </span>
              <span className="mt-2 font-display font-bold text-navy">
                {service.short} in {l.city}
              </span>
              <span className="mt-1 text-xs text-navy/55">
                {l.zips.slice(0, 3).join(" · ")}
              </span>
              <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-blue">
                View
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}


/* ------------------------------------------------------------ hero variants */

/** Colour treatment of the hero, one per service. */
export function toneFor(kind: Service["detail"]["kind"]): HeroTone {
  switch (kind) {
    case "seasonal":
      return "warm";
    case "lifespan":
      return "cool";
    case "credential":
      return "steel";
    case "offer":
      return "offer";
    case "segments":
      return "deep";
    case "symptoms":
      return "aqua";
  }
}

const panel =
  "relative overflow-hidden rounded-card border border-white/20 " +
  "bg-[linear-gradient(165deg,rgb(4_30_52/0.5),rgb(4_22_44/0.38))] p-6 pt-7 " +
  "shadow-[0_24px_50px_-24px_rgb(3_14_34/0.9)] backdrop-blur-md " +
  "before:absolute before:inset-x-0 before:top-0 before:h-[3px] " +
  "before:bg-[linear-gradient(90deg,var(--color-ember),var(--color-orange),var(--color-gold),var(--color-cyan),var(--color-blue))]";

/** Numbered rows on hairlines — the aside equivalent of the spec sheets used
 *  everywhere else, so the six panels read as one system. */
function AsideRows({
  items,
  tone = "text-cyan",
}: {
  items: string[];
  tone?: string;
}) {
  return (
    <ol className="mt-4">
      {items.map((t, i) => (
        <li
          key={t}
          className="flex items-start gap-3 border-t border-white/12 py-2.5 first:border-t-0 first:pt-0"
        >
          <span className={cn("mt-px font-mono text-[0.62rem] tabular-nums", tone)}>
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="text-[0.82rem] leading-snug text-white/80">{t}</span>
        </li>
      ))}
    </ol>
  );
}

/**
 * The panel beside the hero copy. Each service puts something different here —
 * the stats, the licences, the price, the property types — so the heroes are
 * not six recolourings of the same block.
 */
export function ServiceHeroAside({ service }: { service: Service }) {
  const d = service.detail;

  if (d.kind === "lifespan") {
    return (
      <div className={panel}>
        <p className="font-display text-[0.65rem] font-bold uppercase tracking-[0.2em] text-cyan">
          Cooling in this climate
        </p>
        {/* One column below 360px — two 78px cells cannot hold a word like
            "Recommended". */}
        <dl className="mt-4 grid grid-cols-1 gap-x-6 min-[360px]:grid-cols-2">
          {d.stats.map((st, i) => (
            <div
              key={st.label}
              className={cn(
                "min-w-0 border-white/12 py-3",
                i > 0 && "border-t",
                i === 1 && "min-[360px]:border-t-0 min-[360px]:border-l min-[360px]:pl-6",
                i === 3 && "min-[360px]:border-l min-[360px]:pl-6",
              )}
            >
              <dt className="display text-[1.65rem] leading-none text-white">
                {st.value}
              </dt>
              <dd className="mt-1.5 text-[0.72rem] leading-snug text-white/62 hyphens-auto">
                {st.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    );
  }

  if (d.kind === "credential") {
    return (
      <div className={panel}>
        <p className="flex items-center gap-2 font-display text-[0.65rem] font-bold uppercase tracking-[0.2em] text-cyan">
          <ShieldCheck className="size-3.5" aria-hidden="true" />
          Florida licensed &amp; insured
        </p>
        <ul className="mt-5 space-y-3.5">
          {business.licenses.map((l) => (
            <li key={l.number} className="flex items-baseline justify-between gap-4">
              <span className="text-sm text-white/60">{l.label}</span>
              <span className="font-display text-base font-extrabold text-white">
                {l.number}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-5 border-t border-white/15 pt-4 text-xs leading-relaxed text-white/55">
          Mechanical work is inspected work. We pull the permit and schedule the
          inspection on every replacement.
        </p>
      </div>
    );
  }

  if (d.kind === "offer") {
    return (
      <div className="rounded-card border border-gold/30 bg-white/10 p-7 text-center backdrop-blur-sm">
        <p className="font-display text-[0.65rem] font-bold uppercase tracking-[0.2em] text-gold">
          Published price
        </p>
        <p className="display mt-3 text-6xl text-white">{cleanAndTune.price}</p>
        <p className="mt-1 text-sm text-white/60">{cleanAndTune.unit}</p>
        <ul className="mt-5 space-y-1.5 border-t border-white/15 pt-4 text-sm text-white/75">
          <li>10-point service</li>
          <li>Recommended twice a year</li>
          <li>Flat price, no surprises</li>
        </ul>
      </div>
    );
  }

  if (d.kind === "segments") {
    return (
      <div className={panel}>
        <p className="font-display text-[0.65rem] font-bold uppercase tracking-[0.2em] text-cyan">
          Property types we cover
        </p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {d.segments.map((seg) => (
            <li
              key={seg.name}
              className="rounded-full border border-white/20 px-3.5 py-1.5 text-xs font-semibold text-white/85"
            >
              {seg.name}
            </li>
          ))}
        </ul>
        <p className="mt-5 border-t border-white/15 pt-4 text-xs leading-relaxed text-white/55">
          Scheduled around your opening hours, with the documentation boards and
          managers actually need.
        </p>
      </div>
    );
  }

  if (d.kind === "symptoms") {
    return (
      <div className={panel}>
        <p className="font-display text-[0.65rem] font-bold uppercase tracking-[0.2em] text-cyan">
          Target indoor humidity
        </p>
        <p className="display mt-3 text-5xl text-white">45–55%</p>
        <p className="mt-3 text-sm leading-relaxed text-white/65">
          Above 60% for any length of time is where mould starts in a Florida
          home. In this climate the air quality problem is almost always
          moisture, not dust.
        </p>
      </div>
    );
  }

  // seasonal — heating
  if (d.kind === "seasonal") {
    return (
      <div className={panel}>
        <p className="font-display text-[0.62rem] font-extrabold uppercase tracking-[0.2em] text-gold">
          Checked on every maintenance visit
        </p>
        <AsideRows items={d.items.map((it) => it.title)} tone="text-gold" />
        <p className="mt-4 border-t border-white/15 pt-3.5 text-[0.72rem] leading-relaxed text-white/58">
          All four are visible months before the first cold night.
        </p>
      </div>
    );
  }

  return null;
}

/** Trust row under the hero buttons — same on every service page. */
export function HeroTrust() {
  const items = [
    `Licensed #${business.license}`,
    "Flat-rate pricing",
    business.emergency,
  ];
  return (
    <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/20 pt-5">
      <GoogleSeal />
      <span className="hidden h-7 w-px bg-white/25 sm:block" aria-hidden="true" />
      <ul className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
        {items.map((t) => (
          <li
            key={t}
            className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-white/60"
          >
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
