import { Link } from "wouter";
import { ArrowRight, Check, Phone, ShieldCheck } from "lucide-react";
import { business, cleanAndTune, locations, type Service } from "@/content/site";
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
        <p className="mt-8 text-lg leading-relaxed text-navy/80">{service.intro}</p>
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

/* ------------------------------------------------------ cooling: lifespan */

export function LifespanBody({ service, answer }: BodyProps) {
  if (service.detail.kind !== "lifespan") return null;
  const d = service.detail;

  return (
    <>
      {/* Numbers first — this is the page people arrive at asking
          "how long should this last" and "is mine dying". */}
      <section className="border-b border-navy/8 bg-white py-10 md:py-12">
        <dl className="shell grid grid-cols-2 gap-8 lg:grid-cols-4">
          {d.stats.map((st) => (
            <div key={st.label}>
              <dt className="display text-4xl text-blue md:text-5xl">{st.value}</dt>
              <dd className="mt-2 text-sm leading-snug text-navy/60">{st.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="shell grid items-start gap-12 py-14 md:py-18 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <AnswerBlock>{answer}</AnswerBlock>
          <h2 className="mt-10 text-2xl">{d.heading}</h2>
          <p className="mt-4 text-lg leading-relaxed text-navy/80">{d.lead}</p>
          <p className="mt-4 leading-relaxed text-navy/75">{service.intro}</p>

          <h3 className="mt-10 font-display text-lg font-extrabold">
            What is included
          </h3>
          <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {service.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2.5">
                <Check className="mt-1 size-4 shrink-0 text-cyan" aria-hidden="true" />
                <span className="text-sm leading-relaxed text-navy/75">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Symptom checklist rather than a form — the form comes later. */}
        <aside className="card overflow-hidden lg:sticky lg:top-28">
          <div className="band-sunset px-6 py-5">
            <h2 className="text-lg text-white">{d.signsHeading}</h2>
          </div>
          <ul className="divide-y divide-navy/8">
            {d.signs.map((sign) => (
              <li key={sign} className="flex items-start gap-3 px-6 py-3.5">
                <span
                  className="mt-1.5 size-2 shrink-0 rounded-full bg-orange"
                  aria-hidden="true"
                />
                <span className="text-sm leading-relaxed text-navy/80">{sign}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-navy/8 p-6">
            <p className="text-sm text-navy/65">
              Any of these means the system is telling you something. A
              diagnostic gives you a flat price before anything is opened.
            </p>
            <ButtonLink href={business.phoneHref} className="mt-4 w-full">
              <Phone className="size-4" aria-hidden="true" />
              {business.phone}
            </ButtonLink>
          </div>
        </aside>
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
      {/* Licences lead, because that is what this page has to establish. */}
      <section className="border-b border-navy/8 bg-white py-10">
        <div className="shell flex flex-wrap items-center gap-x-10 gap-y-5">
          <p className="flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.18em] text-blue">
            <ShieldCheck className="size-4" aria-hidden="true" />
            Florida licensed
          </p>
          {business.licenses.map((l) => (
            <p key={l.number} className="leading-tight">
              <span className="block font-display text-lg font-extrabold text-navy">
                {l.number}
              </span>
              <span className="text-xs text-navy/55">{l.label}</span>
            </p>
          ))}
        </div>
      </section>

      <section className="shell max-w-4xl py-14 md:py-18">
        <AnswerBlock>{answer}</AnswerBlock>
        <h2 className="mt-10 text-2xl md:text-3xl">{d.heading}</h2>
        <p className="mt-4 text-lg leading-relaxed text-navy/80">{d.lead}</p>
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
          <p className="mt-8 text-lg leading-relaxed text-navy/80">
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
        <p className="mt-4 text-lg leading-relaxed text-navy/80">{d.lead}</p>
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
        <p className="text-lg leading-relaxed text-navy/80">{service.intro}</p>
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
        <p className="mt-4 text-lg leading-relaxed text-navy/80">{d.lead}</p>
      </section>

      {/* A genuine three-column diagnostic table — the centrepiece of the
          page, and a shape used nowhere else on the site. */}
      <section className="shell pb-14 md:pb-18">
        <div className="overflow-x-auto rounded-card ring-1 ring-navy/10">
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
            <p className="text-lg leading-relaxed text-navy/80">
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
