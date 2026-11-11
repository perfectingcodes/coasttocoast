import { useEffect, useId, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { business, locations, services } from "@/content/site";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { captureLead, currentAttribution, persistLead, track } from "@/lib/leads";

/**
 * Quote request form.
 *
 * Submission target is `VITE_QUOTE_ENDPOINT` (any endpoint that accepts a JSON
 * POST — a form service, a Worker, an API route). With no endpoint configured
 * the form falls back to opening a prefilled email so it never silently
 * swallows a real lead.
 */
const endpoint = import.meta.env.VITE_QUOTE_ENDPOINT as string | undefined;

type State = "idle" | "sending" | "sent" | "error";

export function QuoteForm({
  defaultService,
  defaultCity,
  variant = "full",
  plain = false,
}: {
  defaultService?: string;
  defaultCity?: string;
  /** `walk` is the short form the pop-up uses: no service menu, because the
   *  person has already said what they want by pressing "Book a walk". */
  variant?: "full" | "walk";
  /** Drop the card frame when the form already sits inside one. */
  plain?: boolean;
}) {
  const [state, setState] = useState<State>("idle");
  const messageId = useId();
  const isWalk = variant === "walk";
  const frame = plain ? "text-navy" : "card p-6 text-navy md:p-8";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setState("sending");

    // The two commercial fields ride inside the message rather than as new
    // keys, so the lead record the CRM and the server already store keeps
    // its shape. A property name and a unit count are the first two things
    // anyone calling back wants to know.
    const { company, units, ...rest } = data;
    const context = [
      company && `Company / property: ${company}`,
      units && `Units on site: ${units}`,
    ].filter(Boolean);
    if (context.length) {
      rest.message = [...context, rest.message].filter(Boolean).join("\n");
    }
    Object.keys(data).forEach((k) => delete data[k]);
    Object.assign(data, rest);

    const lead = captureLead(data);
    const saved = await persistLead(lead);
    if (!saved) {
      setState("error");
      return;
    }
    track("quote-submit", data.service);

    // The request is already stored by this point. This used to open the
    // visitor's own mail app as well, which read as the form having failed.
    if (!endpoint) {
      form.reset();
      setState("sent");
      return;
    }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      form.reset();
      setState("sent");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div
        role="status"
        className={cn("text-center text-navy", plain ? "py-6" : "card p-8")}
      >
        <CheckCircle2 className="mx-auto size-10 text-blue" aria-hidden="true" />
        <h3 className="mt-4 text-xl">Request received</h3>
        <p className="mt-2 text-navy/70 leading-relaxed">
          We will call you back within one business hour during {business.hours}.
          For anything urgent right now, call{" "}
          <a href={business.phoneHref} className="font-bold text-blue">
            {business.phone}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    // text-navy is explicit, not inherited: this form is dropped onto dark
    // grounds (the paid landing heroes) where inheriting would make every
    // label white on a white card.
    <form onSubmit={onSubmit} className={frame}>
      <div className={cn("grid", isWalk ? "grid-cols-2 gap-x-3 gap-y-3.5" : "gap-4 sm:grid-cols-2")}>
        <Field
          label="Name"
          name="name"
          autoComplete="name"
          required
          className={isWalk ? "col-span-2 sm:col-span-1" : undefined}
        />
        <Field
          label="Phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          className={isWalk ? "col-span-2 sm:col-span-1" : undefined}
        />
        <Field
          label={isWalk ? "Company / property" : "Company or property"}
          name="company"
          autoComplete="organization"
          placeholder="Optional"
        />
        <Field
          label="Units on site"
          name="units"
          inputMode="numeric"
          placeholder={isWalk ? "Rough count" : "A rough count is fine"}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder={isWalk ? "Optional" : undefined}
          className={isWalk ? undefined : "sm:col-span-2"}
        />
        <Select label="City" name="city" defaultValue={defaultCity}>
          <option value="">Select your city</option>
          {locations.map((l) => (
            <option key={l.slug} value={l.city}>
              {l.city}
            </option>
          ))}
          <option value="Other">Somewhere else in Southwest Florida</option>
        </Select>
        {isWalk ? (
          <input type="hidden" name="service" value="Equipment walk" readOnly />
        ) : (
          <Select label="What do you need?" name="service" defaultValue={defaultService}>
            <option value="">Select a service</option>
            {services.map((s) => (
              <option key={s.slug} value={s.name}>
                {s.name}
              </option>
            ))}
            <option value="Not sure">Not sure yet</option>
          </Select>
        )}
        <div className="col-span-2">
          <label htmlFor={messageId} className="text-sm font-semibold">
            {isWalk ? "Anything we should know?" : "Details"}
          </label>
          <textarea
            id={messageId}
            name="message"
            rows={isWalk ? 2 : 4}
            placeholder={
              isWalk
                ? "Roof access, the best time to visit, a unit already giving trouble."
                : "What equipment, what is it doing, and how soon do you need someone?"
            }
            className={fieldClass}
          />
        </div>
      </div>

      {state === "error" && (
        <p role="alert" className="mt-4 text-sm font-semibold text-red-600">
          Something went wrong sending that. Please call {business.phone} and we
          will take care of it.
        </p>
      )}

      <AttributionFields />

      <Button
        type="submit"
        size="lg"
        className={cn("w-full", isWalk ? "mt-5" : "mt-6")}
        disabled={state === "sending"}
      >
        {state === "sending" && (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        )}
        {state === "sending" ? "Sending…" : isWalk ? "Book my equipment walk" : "Send request"}
      </Button>
      <p className="mt-3 text-center text-xs text-navy/55">
        No obligation. We never sell your information.
      </p>
    </form>
  );
}

/**
 * Hidden click-identifier fields.
 *
 * The Google Ads build sheet requires the GCLID on every form and stored
 * against the lead: it is what makes offline conversion import possible, and
 * offline import is what lets the account optimize for booked jobs instead of
 * form fills. These are rendered into the posted payload and the fallback
 * email so the value survives whichever path the submission takes.
 */
export function AttributionFields() {
  // Read after mount, not during render: the prerendered HTML has no
  // localStorage, and on a fresh ad click the tracker writes the GCLID in its
  // own effect — reading during render would miss it on the very visit that
  // matters most.
  const [a, setA] = useState<ReturnType<typeof currentAttribution>>();
  useEffect(() => setA(currentAttribution()), []);
  if (!a) return null;
  return (
    <>
      {Object.entries(a)
        .filter(([k]) => k !== "at" && k !== "landing")
        .map(([k, v]) => (
          <input key={k} type="hidden" name={k} value={String(v)} readOnly />
        ))}
    </>
  );
}

// 16px on phones: iOS zooms the whole page into any field set smaller, and
// does not zoom back out afterwards.
const fieldClass =
  "mt-1.5 w-full min-w-0 rounded-[0.7rem] border border-navy/15 bg-white px-3.5 py-3 text-base outline-none transition-colors placeholder:text-navy/40 focus:border-blue focus:ring-2 focus:ring-blue/15 md:text-sm";

function Field({
  label,
  name,
  className,
  ...rest
}: { label: string; name: string; className?: string } & React.ComponentProps<"input">) {
  // Generated, not the field name: the pop-up can put a second copy of this
  // form on a page that already has one, and two inputs sharing an id send
  // a label's tap to the wrong field.
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <input id={id} name={name} className={fieldClass} {...rest} />
    </div>
  );
}

function Select({
  label,
  name,
  children,
  defaultValue,
}: {
  label: string;
  name: string;
  children: React.ReactNode;
  defaultValue?: string;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <select id={id} name={name} defaultValue={defaultValue} className={fieldClass}>
        {children}
      </select>
    </div>
  );
}

/**
 * Two fields, nothing else.
 *
 * Tab 10 of the build sheet asks for a 2-field form above the fold on the
 * repair page, and it is right to: a name and a number is all that is needed
 * to call somebody back, and every extra field on a paid page costs
 * conversions. The long form still exists further down for people who would
 * rather write out the problem.
 */
export function QuickQuote({
  service,
  heading = "We will call you straight back",
  className,
}: {
  service?: string;
  heading?: string;
  className?: string;
}) {
  const [state, setState] = useState<State>("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setState("sending");

    const lead = captureLead({ ...data, service: service ?? data.service });
    if (!(await persistLead(lead))) {
      setState("error");
      return;
    }
    track("quote-submit", service ?? "Quick form");

    // The request is already stored by this point. This used to open the
    // visitor's own mail app as well, which read as the form having failed.
    if (!endpoint) {
      form.reset();
      setState("sent");
      return;
    }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      form.reset();
      setState("sent");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className={cn("card p-6 text-center text-navy", className)}>
        <CheckCircle2 className="mx-auto size-8 text-blue" aria-hidden="true" />
        <p className="mt-3 font-display text-lg font-extrabold">Got it</p>
        <p className="mt-1.5 text-sm leading-relaxed text-navy/70">
          We will call you straight back. If you would rather not wait, call{" "}
          <a href={business.phoneHref} className="font-bold text-blue">
            {business.phone}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("card p-6 text-navy", className)}>
      <p className="font-display text-lg font-extrabold leading-tight">{heading}</p>
      <p className="mt-1.5 text-sm text-navy/60">
        Name and number is enough. No obligation.
      </p>
      <div className="mt-4 grid gap-3">
        <Field label="Name" name="name" autoComplete="name" required />
        <Field label="Phone" name="phone" type="tel" autoComplete="tel" required />
      </div>

      {state === "error" && (
        <p role="alert" className="mt-3 text-sm font-semibold text-red-600">
          Something went wrong. Please call {business.phone}.
        </p>
      )}

      <AttributionFields />

      <Button type="submit" size="lg" className="mt-4 w-full" disabled={state === "sending"}>
        {state === "sending" && (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        )}
        {state === "sending" ? "Sending…" : "Call me back"}
      </Button>
      <p className="mt-2.5 text-center text-xs text-navy/55">
        We never sell your information.
      </p>
    </form>
  );
}
