import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowUpRight, MessageCircle, Phone, Search, X } from "lucide-react";
import {
  business,
  cleanAndTune,
  generalFaqs,
  locations,
  services,
} from "@/content/site";
import { cityFaqs } from "@/content/local";
import { cn } from "@/lib/utils";

/**
 * "Ask Coast" — the support launcher in the bottom corner.
 *
 * This is a retrieval assistant over the site's own content, not a language
 * model: a static build has no server, so there is nowhere to hold an API key
 * or run a completion. Rather than fake a chat bubble that invents answers, it
 * searches every FAQ already published on the site — general, per service and
 * per city — and returns the real answer with a link to the page it came from.
 *
 * It therefore cannot make something up, which for a licensed trade is the
 * right trade-off. Wiring a genuine model in later means swapping `search()`
 * for a fetch, and the UI does not change.
 */

interface Entry {
  q: string;
  a: string;
  href: string;
  source: string;
}

/** Everything the site already answers, flattened once. */
function buildIndex(): Entry[] {
  const out: Entry[] = generalFaqs.map((f) => ({
    ...f,
    href: "/#faq",
    source: "General",
  }));

  for (const s of services) {
    for (const f of s.faqs) {
      out.push({ ...f, href: `/services/${s.slug}`, source: s.name });
    }
  }
  for (const l of locations) {
    for (const f of cityFaqs(l)) {
      out.push({ ...f, href: `/locations/${l.slug}`, source: l.city });
    }
  }

  // The same question is deliberately answered in more than one place (a
  // general FAQ and a service FAQ, say). Keep the first — general entries are
  // pushed first, so the broadest phrasing wins — and drop the repeats, which
  // otherwise surface as duplicate results.
  const seen = new Set<string>();
  return out.filter((e) => {
    const key = e.q.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const STOP = new Set([
  "the","a","an","is","are","do","does","you","your","my","i","to","in","on",
  "of","for","and","it","how","what","when","can","with","we","me","be","at",
]);

const tokenize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s$]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP.has(t));

function search(index: Entry[], query: string): Entry[] {
  const terms = tokenize(query);
  if (!terms.length) return [];
  return index
    .map((e) => {
      const hay = `${e.q} ${e.a} ${e.source}`.toLowerCase();
      let score = 0;
      for (const t of terms) {
        if (e.q.toLowerCase().includes(t)) score += 3;
        else if (hay.includes(t)) score += 1;
      }
      return { e, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((r) => r.e);
}

const SUGGESTED = [
  "How much is a tune up?",
  "Do I need a permit to replace my AC?",
  "How often should I service my AC?",
  "Do you offer financing?",
];

export function SupportBot() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const index = useMemo(buildIndex, []);
  const results = useMemo(() => search(index, query), [index, query]);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Escape closes; clicking outside closes.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (!panelRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div ref={panelRef} className="fixed bottom-4 right-4 z-[60] print:hidden md:bottom-6 md:right-6">
      {open && (
        <div
          id="ask-coast-panel"
          role="dialog"
          aria-label="Ask Coast to Coast Air"
          className="mb-3 w-[min(23rem,calc(100vw-2rem))] overflow-hidden rounded-card border border-navy/12 bg-white shadow-[0_30px_70px_-20px_rgb(5_15_38/0.55)]"
        >
          <div className="band-navy grain relative flex items-center gap-3 p-4">
            <img
              src="/brand/avatar-husky.webp"
              alt=""
              width={256}
              height={289}
              className="size-11 shrink-0 object-contain"
            />
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm font-extrabold text-white">
                Ask Coast
              </p>
              <p className="text-[0.7rem] text-white/60">
                Answers pulled straight from our service pages
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="grid size-8 shrink-0 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="p-4">
            <label htmlFor="ask-coast-input" className="sr-only">
              Search our answers
            </label>
            <div className="flex items-center gap-2 rounded-full bg-foam px-3.5 py-2.5 ring-1 ring-navy/10 focus-within:ring-blue">
              <Search className="size-4 shrink-0 text-navy/40" aria-hidden="true" />
              <input
                id="ask-coast-input"
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about pricing, permits, timing…"
                className="w-full bg-transparent text-sm text-navy outline-none placeholder:text-navy/40"
              />
            </div>

            <div className="mt-4 max-h-72 overflow-y-auto">
              {query.trim() === "" ? (
                <ul className="space-y-1.5">
                  {SUGGESTED.map((q) => (
                    <li key={q}>
                      <button
                        type="button"
                        onClick={() => setQuery(q)}
                        className="w-full rounded-lg px-3 py-2 text-left text-sm text-navy/75 transition-colors hover:bg-foam hover:text-navy"
                      >
                        {q}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : results.length ? (
                <ul className="space-y-3">
                  {results.map((r) => (
                    <li key={r.q} className="rounded-xl bg-foam p-3.5">
                      <p className="font-display text-xs font-extrabold text-navy">
                        {r.q}
                      </p>
                      <p className="mt-1.5 text-[0.82rem] leading-relaxed text-navy/70">
                        {r.a}
                      </p>
                      <Link
                        href={r.href}
                        onClick={() => setOpen(false)}
                        className="link-arrow mt-2.5"
                      >
                        {r.source}
                        <ArrowUpRight className="size-3.5" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="rounded-xl bg-foam p-4 text-sm leading-relaxed text-navy/70">
                  No match for that one. The fastest answer is a phone call —
                  we answer our own line, day or night.
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-2 border-t border-navy/8 pt-4">
              <a
                href={business.phoneHref}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-orange px-3 py-2.5 font-display text-xs font-extrabold text-white transition-colors hover:bg-orange-light"
              >
                <Phone className="size-3.5" aria-hidden="true" />
                {business.phone}
              </a>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="flex flex-1 items-center justify-center rounded-full px-3 py-2.5 font-display text-xs font-extrabold text-navy ring-1 ring-navy/15 transition-colors hover:ring-navy/40"
              >
                Get a quote
              </Link>
            </div>

            <p className="mt-3 text-[0.65rem] leading-relaxed text-navy/40">
              Searches our published answers — it never invents one. For
              anything specific to your system, call {business.phone}. The{" "}
              {cleanAndTune.name} is {cleanAndTune.price}.
            </p>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="ask-coast-panel"
        aria-label={open ? "Close Ask Coast" : "Open Ask Coast — get answers"}
        className={cn(
          "group flex items-center gap-2.5 rounded-full py-2 pl-2 pr-4 transition-all duration-300",
          "bg-navy text-white shadow-[0_16px_40px_-12px_rgb(5_15_38/0.7)] ring-1 ring-white/15",
          "hover:-translate-y-0.5 hover:bg-navy-soft",
        )}
      >
        <span className="relative">
          <img
            src="/brand/avatar-husky.webp"
            alt=""
            width={256}
            height={289}
            className="size-11 object-contain md:size-12"
          />
          {!open && (
            <span
              className="absolute -right-0.5 -top-0.5 size-3 rounded-full bg-cyan ring-2 ring-navy"
              aria-hidden="true"
            />
          )}
        </span>
        <span className="hidden font-display text-sm font-extrabold sm:block">
          {open ? "Close" : "Ask Coast"}
        </span>
        {!open && (
          <MessageCircle className="size-4 text-cyan sm:hidden" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
