import { useEffect, useState } from "react";

/**
 * Lead capture and site-traction store.
 *
 * READ THIS BEFORE TRUSTING ANYTHING IT RETURNS.
 *
 * This site is a static build with no server and no database. There is
 * nowhere to put a lead except the visitor's own browser, so that is what
 * this does: every record below lives in localStorage on the device that
 * created it.
 *
 * What that means in practice:
 *   - A homeowner who fills in the quote form in Cape Coral writes a lead
 *     into THEIR browser. It is not sent anywhere and the office will never
 *     see it in the dashboard. The form still emails the office (see
 *     components/quote-form.tsx) — that email remains the real lead path.
 *   - The traction figures in the dashboard describe whoever is looking at
 *     the dashboard, not the public. Open /admin on a laptop that has never
 *     visited the site and the counters read zero.
 *   - Clearing site data erases all of it. There is no backup.
 *
 * It is still worth having. The office can log phone-in leads by hand and
 * work them through the pipeline on one machine, and the moment a backend
 * exists the shape below is what it has to accept — set VITE_LEADS_ENDPOINT
 * and every lead and event is POSTed to it as well, unchanged.
 */

const STORE = "cca.crm.v1";
const EVENT_CAP = 400;

/** Set VITE_LEADS_ENDPOINT to a URL that accepts a JSON POST to make any of
 *  this leave the device. Until then it does not. */
const sink = import.meta.env.VITE_LEADS_ENDPOINT as string | undefined;

export const isConnected = Boolean(sink);

/* -------------------------------------------------------------- the shapes */

export type Stage = "new" | "contacted" | "quoted" | "won" | "lost";

export const STAGES: { id: Stage; label: string; blurb: string }[] = [
  { id: "new", label: "New", blurb: "Came in, nobody has called yet" },
  { id: "contacted", label: "Contacted", blurb: "Reached, visit being scheduled" },
  { id: "quoted", label: "Quoted", blurb: "Price given, waiting on them" },
  { id: "won", label: "Won", blurb: "Booked or completed" },
  { id: "lost", label: "Lost", blurb: "Went elsewhere or went quiet" },
];

export interface Note {
  at: number;
  text: string;
}

export interface Lead {
  id: string;
  at: number;
  name: string;
  phone: string;
  email: string;
  city: string;
  service: string;
  message: string;
  /** Page the request was sent from — the single most useful marketing fact. */
  path: string;
  source: "website" | "phone" | "manual";
  stage: Stage;
  notes: Note[];
}

export type EventKind =
  | "view"
  | "call"
  | "quote-open"
  | "quote-submit"
  | "financing"
  | "chat";

export const EVENT_LABELS: Record<EventKind, string> = {
  view: "Page view",
  call: "Tapped the phone number",
  "quote-open": "Opened a quote form",
  "quote-submit": "Sent a quote request",
  financing: "Used the financing estimator",
  chat: "Opened the chat",
};

export interface SiteEvent {
  id: string;
  at: number;
  kind: EventKind;
  path: string;
  label?: string;
}

export interface Visitor {
  id: string;
  first: number;
  last: number;
  visits: number;
  /** Where this browser came from the first time. "" means typed or bookmarked. */
  referrer: string;
  landing: string;
}

export interface Crm {
  leads: Lead[];
  events: SiteEvent[];
  visitor: Visitor | null;
}

export const EMPTY: Crm = { leads: [], events: [], visitor: null };

/* ------------------------------------------------------------- read / write */

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

export function loadCrm(): Crm {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = localStorage.getItem(STORE);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<Crm>;
    return {
      leads: Array.isArray(parsed.leads) ? parsed.leads : [],
      events: Array.isArray(parsed.events) ? parsed.events : [],
      visitor: parsed.visitor ?? null,
    };
  } catch {
    // Corrupt or unavailable storage. An empty dashboard is a better answer
    // than a crashed one.
    return EMPTY;
  }
}

const CHANGED = "cca:crm-changed";

function saveCrm(next: Crm) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORE, JSON.stringify(next));
  } catch {
    /* private browsing or a full quota — this session still works in memory,
       it simply will not be here next time. */
  }
  window.dispatchEvent(new CustomEvent(CHANGED));
}

function mutate(fn: (crm: Crm) => Crm) {
  saveCrm(fn(loadCrm()));
}

/** Fire-and-forget copy to a real backend, when one is configured. */
function forward(type: "lead" | "event", payload: unknown) {
  if (!sink) return;
  void fetch(sink, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, payload }),
    keepalive: true,
  }).catch(() => {
    /* Never let analytics break a page. */
  });
}

/* --------------------------------------------------------------- tracking */

/** Called once per session by the tracker component. */
export function startSession() {
  if (typeof window === "undefined") return;
  mutate((crm) => {
    const now = Date.now();
    const visitor: Visitor = crm.visitor
      ? { ...crm.visitor, last: now, visits: crm.visitor.visits + 1 }
      : {
          id: uid(),
          first: now,
          last: now,
          visits: 1,
          referrer: document.referrer || "",
          landing: window.location.pathname,
        };
    return { ...crm, visitor };
  });
}

export function track(kind: EventKind, label?: string, path?: string) {
  if (typeof window === "undefined") return;
  const event: SiteEvent = {
    id: uid(),
    at: Date.now(),
    kind,
    path: path ?? window.location.pathname,
    label,
  };
  mutate((crm) => ({
    ...crm,
    // Newest first, and capped — an unbounded array in localStorage would
    // eventually refuse to save and silently lose everything after it.
    events: [event, ...crm.events].slice(0, EVENT_CAP),
  }));
  forward("event", event);
}

/* ------------------------------------------------------------------ leads */

export interface NewLead {
  name?: string;
  phone?: string;
  email?: string;
  city?: string;
  service?: string;
  message?: string;
  path?: string;
  source?: Lead["source"];
}

export function captureLead(data: NewLead): Lead {
  const lead: Lead = {
    id: uid(),
    at: Date.now(),
    name: data.name?.trim() || "No name given",
    phone: data.phone?.trim() || "",
    email: data.email?.trim() || "",
    city: data.city?.trim() || "",
    service: data.service?.trim() || "",
    message: data.message?.trim() || "",
    path:
      data.path ??
      (typeof window === "undefined" ? "/" : window.location.pathname),
    source: data.source ?? "website",
    stage: "new",
    notes: [],
  };
  mutate((crm) => ({ ...crm, leads: [lead, ...crm.leads] }));
  forward("lead", lead);
  return lead;
}

export function updateLead(id: string, patch: Partial<Lead>) {
  mutate((crm) => ({
    ...crm,
    leads: crm.leads.map((l) => (l.id === id ? { ...l, ...patch } : l)),
  }));
}

export function addNote(id: string, text: string) {
  const trimmed = text.trim();
  if (!trimmed) return;
  mutate((crm) => ({
    ...crm,
    leads: crm.leads.map((l) =>
      l.id === id ? { ...l, notes: [...l.notes, { at: Date.now(), text: trimmed }] } : l,
    ),
  }));
}

export function deleteLead(id: string) {
  mutate((crm) => ({ ...crm, leads: crm.leads.filter((l) => l.id !== id) }));
}

export function clearCrm() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORE);
  } catch {
    /* nothing to clear */
  }
  window.dispatchEvent(new CustomEvent(CHANGED));
}

export function exportCrm(): string {
  return JSON.stringify(
    { exported: new Date().toISOString(), ...loadCrm() },
    null,
    2,
  );
}

/* ------------------------------------------------------------------- hook */

/**
 * Subscribes to the store. Reads after mount only: the prerendered HTML has
 * no localStorage, and reading during render would make the server markup and
 * the first paint disagree.
 */
export function useCrm(): Crm {
  const [crm, setCrm] = useState<Crm>(EMPTY);

  useEffect(() => {
    const read = () => setCrm(loadCrm());
    read();
    window.addEventListener(CHANGED, read);
    // Another tab writing the same key — keeps two open dashboards in step.
    window.addEventListener("storage", read);
    return () => {
      window.removeEventListener(CHANGED, read);
      window.removeEventListener("storage", read);
    };
  }, []);

  return crm;
}

/* -------------------------------------------------------------- summaries */

export interface Traction {
  views: number;
  calls: number;
  quoteOpens: number;
  quoteSubmits: number;
  topPages: { path: string; count: number }[];
  byDay: { day: string; count: number }[];
}

const DAY = 86_400_000;

export function traction(events: SiteEvent[], days = 14): Traction {
  const since = Date.now() - days * DAY;
  const recent = events.filter((e) => e.at >= since);
  const count = (k: EventKind) => recent.filter((e) => e.kind === k).length;

  const pages = new Map<string, number>();
  for (const e of recent) {
    if (e.kind !== "view") continue;
    pages.set(e.path, (pages.get(e.path) ?? 0) + 1);
  }

  const byDay: { day: string; count: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const from = start.getTime() - i * DAY;
    byDay.push({
      day: new Date(from).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      count: recent.filter((e) => e.at >= from && e.at < from + DAY).length,
    });
  }

  return {
    views: count("view"),
    calls: count("call"),
    quoteOpens: count("quote-open"),
    quoteSubmits: count("quote-submit"),
    topPages: [...pages.entries()]
      .map(([path, c]) => ({ path, count: c }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8),
    byDay,
  };
}

/** "3 minutes ago" / "Tuesday" — absolute dates read badly in a pipeline. */
export function ago(at: number): string {
  const s = Math.round((Date.now() - at) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  if (s < 86_400) return `${Math.round(s / 3600)} hr ago`;
  const d = Math.round(s / 86_400);
  if (d < 7) return `${d} day${d === 1 ? "" : "s"} ago`;
  return new Date(at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
