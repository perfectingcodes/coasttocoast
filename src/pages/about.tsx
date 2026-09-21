import { business, guarantees, process, region, stats } from "@/content/site";
import { SiteLayout } from "@/components/layout/site-layout";
import { Section } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { CtaBand } from "@/components/cta-band";
import { Seo, breadcrumbNode } from "@/lib/seo";

export default function About() {
  return (
    <>
      <Seo
        title={`About ${business.formalName} | Locally Owned in ${region}`}
        description={`${business.formalName} is a licensed, insured and locally owned HVAC contractor serving ${region} out of ${business.city} — flat-rate pricing on every job.`}
        path="/about"
        nodes={[
          breadcrumbNode("/about", [
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
      />

      <SiteLayout
        eyebrow="About us"
        title="A local company, not a call center"
        lead={`${business.formalName} runs out of ${business.city}. Same owner, same technicians, same trucks you see in the neighborhood — and we answer our own phones.`}
        crumbs={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ]}
      >
        <Section>
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr]">
            <div className="max-w-2xl">
              <p className="eyebrow">Our story</p>
              <h2 className="mt-3 text-3xl md:text-4xl">Built on second opinions</h2>
              <div className="mt-5 space-y-4 text-lg text-navy/75 leading-relaxed">
                <p>
                  We started because of how often we were called in for a second
                  opinion and found a system that did not need replacing. A
                  capacitor, a clogged drain line, a duct that came loose in the
                  attic — a few hundred dollars instead of a few thousand.
                </p>
                <p>
                  That is still how we operate. We diagnose the actual fault, price
                  the repair in writing, and recommend replacement only when the
                  math genuinely favors it. If your system has years left, we would
                  rather earn the maintenance work than sell you a box.
                </p>
                <p>
                  {region} is hard on equipment. Salt air eats condenser coils,
                  summer humidity finds every gap in the ductwork, and a house that
                  sits empty in August is its own problem. Working here every day is
                  what lets us plan for that instead of reacting to it.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="card flex items-center gap-5 p-6">
                <img
                  src="/brand/badge-locally-owned.webp"
                  alt="Locally owned — your neighbors, your comfort, our commitment"
                  width={640}
                  height={636}
                  loading="lazy"
                  className="w-28 shrink-0"
                />
                <div>
                  <p className="font-display text-lg font-extrabold leading-tight">
                    Locally owned and operated
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-navy/65">
                    Based in {business.city}, answering our own phones — your
                    neighbors, your comfort, our commitment.
                  </p>
                </div>
              </div>
              <div className="card p-6">
                <p className="eyebrow">By the numbers</p>
                <dl className="mt-5 grid grid-cols-2 gap-6">
                  {stats.map((s: { value: string; label: string }) => (
                    <div key={s.label}>
                      <dt className="text-2xl font-extrabold">{s.value}</dt>
                      <dd className="mt-1 text-sm text-navy/60">{s.label}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="card p-6">
                <p className="eyebrow">What you can count on</p>
                <ul className="mt-5 space-y-3">
                  {guarantees.map((g) => (
                    <li key={g} className="flex items-start gap-3">
                      <span
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-blue"
                        aria-hidden="true"
                      />
                      <span className="text-navy/80">{g}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Section>

        <Section
          className="bg-foam"
          eyebrow="How we work"
          title="The same four steps every time"
        >
          <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {process.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.06}>
                <li className="card h-full p-6">
                  <span className="text-sm font-black text-blue">0{i + 1}</span>
                  <h3 className="mt-3 text-lg">{step.title}</h3>
                  <p className="mt-2 text-navy/70 leading-relaxed">{step.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </Section>

        <CtaBand />
      </SiteLayout>
    </>
  );
}
