import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { business, locations, services } from "@/content/site";
import { Button } from "@/components/ui/button";

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
}: {
  defaultService?: string;
  defaultCity?: string;
}) {
  const [state, setState] = useState<State>("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setState("sending");

    if (!endpoint) {
      const body = Object.entries(data)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n");
      window.location.href = `mailto:${business.email}?subject=${encodeURIComponent(
        "Quote request from the website",
      )}&body=${encodeURIComponent(body)}`;
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
      <div className="card p-8 text-center">
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
    <form onSubmit={onSubmit} className="card p-6 md:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" autoComplete="name" required />
        <Field label="Phone" name="phone" type="tel" autoComplete="tel" required />
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          className="sm:col-span-2"
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
        <Select label="What do you need?" name="service" defaultValue={defaultService}>
          <option value="">Select a service</option>
          {services.map((s) => (
            <option key={s.slug} value={s.name}>
              {s.name}
            </option>
          ))}
          <option value="Not sure">Not sure yet</option>
        </Select>
        <div className="sm:col-span-2">
          <label htmlFor="message" className="text-sm font-semibold">
            Details
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            placeholder="What is the system doing? When did it start?"
            className="mt-1.5 w-full rounded-2xl border border-navy/15 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-navy/40 focus:border-blue"
          />
        </div>
      </div>

      {state === "error" && (
        <p role="alert" className="mt-4 text-sm font-semibold text-red-600">
          Something went wrong sending that. Please call {business.phone} and we
          will take care of it.
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        className="mt-6 w-full"
        disabled={state === "sending"}
      >
        {state === "sending" && (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        )}
        {state === "sending" ? "Sending…" : "Request my quote"}
      </Button>
      <p className="mt-3 text-center text-xs text-navy/55">
        No obligation. We never sell your information.
      </p>
    </form>
  );
}

const fieldClass =
  "mt-1.5 w-full rounded-2xl border border-navy/15 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-navy/40 focus:border-blue";

function Field({
  label,
  name,
  className,
  ...rest
}: { label: string; name: string; className?: string } & React.ComponentProps<"input">) {
  return (
    <div className={className}>
      <label htmlFor={name} className="text-sm font-semibold">
        {label}
      </label>
      <input id={name} name={name} className={fieldClass} {...rest} />
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
  return (
    <div>
      <label htmlFor={name} className="text-sm font-semibold">
        {label}
      </label>
      <select id={name} name={name} defaultValue={defaultValue} className={fieldClass}>
        {children}
      </select>
    </div>
  );
}
