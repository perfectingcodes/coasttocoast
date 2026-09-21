import { ArrowRight, Check, Phone } from "lucide-react";
import { business, cleanAndTune, financing, region } from "@/content/site";
import { SiteLayout } from "@/components/layout/site-layout";
import { Section } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { CtaBand } from "@/components/cta-band";
import { ButtonLink } from "@/components/ui/button";
import { PaymentCalculator } from "@/components/payment-calculator";
import { Seo, breadcrumbNode } from "@/lib/seo";

export default function Financing() {
  return (
    <>
      <Seo
        title={`HVAC Financing in ${region} | ${business.name}`}
        description={`Financing options on approved credit for AC replacement and larger repairs across ${region}. Same-day decisions in most cases — call ${business.phone}.`}
        path="/financing"
        nodes={[
          breadcrumbNode("/financing", [
            { name: "Home", path: "/" },
            { name: "Financing", path: "/financing" },
          ]),
        ]}
      />

      <SiteLayout
        eyebrow="Financing"
        title="A new system shouldn't mean an impossible week"
        lead={financing.intro}
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Financing", path: "/financing" },
        ]}
      >
        <section className="shell py-14 md:py-16">
          <PaymentCalculator />
        </section>

        <Section>
          <ul className="grid gap-6 md:grid-cols-3">
            {financing.points.map((p, i) => (
              <li key={p.title}>
                <Reveal delay={i * 0.06} className="h-full">
                  <div className="card h-full p-7">
                    <span className="grid size-11 place-items-center rounded-full bg-blue text-white">
                      <Check className="size-5" aria-hidden="true" />
                    </span>
                    <h2 className="mt-5 text-xl">{p.title}</h2>
                    <p className="mt-3 leading-relaxed text-navy/70">{p.body}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </Section>

        <Section className="bg-foam">
          <div className="card overflow-hidden lg:grid lg:grid-cols-[1.1fr_0.9fr]">
            <div className="p-8 md:p-10">
              <p className="eyebrow">Before you finance anything</p>
              <h2 className="mt-3 text-2xl md:text-3xl">
                Make sure you actually need a new system
              </h2>
              <div className="mt-5 space-y-4 leading-relaxed text-navy/75">
                <p>
                  Plenty of systems we are called out to replace do not need
                  replacing. A failed capacitor, a clogged condensate line or a
                  duct that came loose in the attic can present exactly like a
                  dying system, and costs a fraction of one to fix.
                </p>
                <p>
                  We diagnose the actual fault first and put the repair price in
                  writing. If replacement genuinely is the better math — and after
                  10–15 years in this climate it often is — then we will talk about
                  financing, not before.
                </p>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/contact">
                  Request a quote
                  <ArrowRight className="size-4" aria-hidden="true" />
                </ButtonLink>
                <ButtonLink href={business.phoneHref} variant="ghost">
                  <Phone className="size-4" aria-hidden="true" />
                  {business.phone}
                </ButtonLink>
              </div>
            </div>

            <div className="band-navy flex flex-col justify-center p-8 text-white md:p-10">
              <p className="font-display text-[0.7rem] font-bold uppercase tracking-[0.22em] text-cyan">
                Start here instead
              </p>
              <p className="mt-4 flex items-baseline gap-2">
                <span className="display text-5xl text-white">{cleanAndTune.price}</span>
                <span className="text-sm font-semibold text-white/60">
                  {cleanAndTune.unit}
                </span>
              </p>
              <h2 className="mt-3 text-2xl text-white">{cleanAndTune.name}</h2>
              <p className="mt-4 leading-relaxed text-white/70">
                A 10-point service that often finds the real problem for the price
                of a maintenance visit.
              </p>
              <div className="mt-7">
                <ButtonLink href="/contact">Book a visit</ButtonLink>
              </div>
            </div>
          </div>

          <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-relaxed text-navy/55">
            Financing is offered through third-party lenders on approved credit.
            Terms, rates and availability vary by lender and are confirmed before
            any work is scheduled.
          </p>
        </Section>

        <CtaBand
          eyebrow="Not sure where to start?"
          title="Let's find out what your system actually needs."
          cta="Book a diagnostic"
        />
      </SiteLayout>
    </>
  );
}
