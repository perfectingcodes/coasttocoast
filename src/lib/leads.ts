import { useEffect, useState } from "react";

/**
 * PostgreSQL is the shared CRM source of truth. localStorage is a device cache
 * and offline outbox; public leads are acknowledged only after the server
 * confirms their database write.
 */

const STORE = "cca.crm.v1";
const EVENT_CAP = 400;

/** Optional copy of records to an existing external intake endpoint. */
const sink = import.meta.env.VITE_LEADS_ENDPOINT as string | undefined;
const OUTBOX = "cca.crm.outbox.v1";
const SYNC_CHANGED = "cca:crm-sync";
type SyncState = "syncing" | "saved" | "offline";
let syncState: SyncState = "syncing";
let remoteReady = false;

export const isConnected = true;

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
  /** Set the first time a lead is marked won — the review sequence counts
   *  its days from here. */
  wonAt?: number;
  /** Ids of review-sequence steps already sent for this customer. */
  reviewSteps?: string[];
  /** Copied off the visitor at capture time so the lead carries its own
   *  attribution — this is what gets uploaded to Google Ads once the job is
   *  booked. */
  attribution?: Attribution;
}

export type EventKind =
  | "view"
  | "call"
  | "quote-open"
  | "quote-submit"
  | "financing"
  | "chat"
  | "offer";

export const EVENT_LABELS: Record<EventKind, string> = {
  view: "Page view",
  call: "Tapped the phone number",
  "quote-open": "Opened a quote form",
  "quote-submit": "Sent a quote request",
  financing: "Used the financing estimator",
  chat: "Opened the chat",
  offer: "Saw the $89 offer popup",
};

export interface SiteEvent {
  id: string;
  at: number;
  kind: EventKind;
  path: string;
  label?: string;
}

/**
 * Google's click identifier, plus the UTM set, captured on FIRST touch and
 * never overwritten.
 *
 * This is the single most important field in the file. The Google Ads build
 * sheet optimizes the account on booked jobs rather than form fills, and that
 * only works through offline conversion import: the GCLID is captured here,
 * stored against the lead, and uploaded weekly once the job is booked. Without
 * it the account can only ever learn from form submissions, which include
 * every tyre-kicker and exclude every phone call.
 *
 * First touch, not last: someone who clicks an ad, leaves, and comes back a
 * week later by typing the domain should still be credited to the ad.
 * `wbraid` and `gbraid` are the iOS and app equivalents Google sends when a
 * GCLID is unavailable.
 */
export interface Attribution {
  gclid?: string;
  wbraid?: string;
  gbraid?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  /** When the click arrived. Google only accepts imports inside 90 days. */
  at: number;
  /** The page the ad landed on. */
  landing: string;
}

export interface Visitor {
  id: string;
  first: number;
  last: number;
  visits: number;
  /** Where this browser came from the first time. "" means typed or bookmarked. */
  referrer: string;
  landing: string;
  /** First-touch paid attribution, if this browser ever arrived from an ad. */
  attribution?: Attribution;
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
    syncState = "offline";
  }
  window.dispatchEvent(new CustomEvent(CHANGED));
  if (remoteReady) void syncSnapshot(next);
}

function mutate(fn: (crm: Crm) => Crm) {
  saveCrm(fn(loadCrm()));
}

function setSyncState(state: SyncState) {
  syncState = state;
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(SYNC_CHANGED));
}

async function syncSnapshot(crm: Crm) {
  setSyncState("syncing");
  try {
    const response = await fetch("/api/crm/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leads: crm.leads, events: crm.events }),
    });
    if (!response.ok) throw new Error("CRM sync failed");
    localStorage.removeItem("cca.crm.pending");
    setSyncState("saved");
  } catch {
    try {
      localStorage.setItem("cca.crm.pending", JSON.stringify({ leads: crm.leads, events: crm.events }));
    } catch { /* keep the in-memory CRM usable and report the sync state */ }
    setSyncState("offline");
  }
}

async function deliver(type: "lead" | "event", payload: unknown): Promise<boolean> {
  try {
    const response = await fetch(type === "lead" ? "/api/public/leads" : "/api/public/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [type]: payload }),
      keepalive: true,
    });
    if (!response.ok) throw new Error("Lead store unavailable");
    if (sink) {
      void fetch(sink, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, payload }),
        keepalive: true,
      }).catch(() => {});
    }
    return true;
  } catch {
    try {
      const pending = JSON.parse(localStorage.getItem(OUTBOX) || "[]") as { type: string; payload: unknown }[];
      if (!pending.some((item) => (item.payload as { id?: string })?.id === (payload as { id?: string }).id)) {
        pending.push({ type, payload });
        localStorage.setItem(OUTBOX, JSON.stringify(pending.slice(-300)));
      }
    } catch { /* the form still reports that server storage failed */ }
    return false;
  }
}

function forward(type: "lead" | "event", payload: unknown) {
  void deliver(type, payload);
}

async function flushOutbox() {
  if (typeof window === "undefined") return;
  try {
    const pending = JSON.parse(localStorage.getItem(OUTBOX) || "[]") as { type: "lead" | "event"; payload: unknown }[];
    const remaining = [];
    for (const item of pending) {
      if (!(await deliver(item.type, item.payload))) remaining.push(item);
    }
    localStorage.setItem(OUTBOX, JSON.stringify(remaining));
  } catch { /* retry on next connection */ }
}

if (typeof window !== "undefined") {
  window.addEventListener("online", () => void flushOutbox());
  void flushOutbox();
}

/* --------------------------------------------------------------- tracking */

const AD_PARAMS = [
  "gclid",
  "wbraid",
  "gbraid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

/** Reads the click identifiers off the current URL, if any are present. */
function readAttribution(): Attribution | null {
  const params = new URLSearchParams(window.location.search);
  const found: Record<string, string> = {};
  for (const key of AD_PARAMS) {
    const value = params.get(key);
    if (value) found[key] = value.slice(0, 200);
  }
  if (!Object.keys(found).length) return null;
  return { ...found, at: Date.now(), landing: window.location.pathname };
}

/** Called once per session by the tracker component. */
export function startSession() {
  if (typeof window === "undefined") return;
  mutate((crm) => {
    const now = Date.now();
    const incoming = readAttribution();
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
    // First touch wins. A visitor who clicked an ad last week and typed the
    // domain today is still that ad's lead.
    if (incoming && !visitor.attribution) visitor.attribution = incoming;
    return { ...crm, visitor };
  });
}

/** The attribution this browser carries, for a form's hidden fields. */
export function currentAttribution(): Attribution | undefined {
  return loadCrm().visitor?.attribution;
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
    attribution: currentAttribution(),
  };
  mutate((crm) => ({ ...crm, leads: [lead, ...crm.leads] }));
  return lead;
}

export function persistLead(lead: Lead) {
  return deliver("lead", lead);
}

export function updateLead(id: string, patch: Partial<Lead>) {
  mutate((crm) => ({
    ...crm,
    leads: crm.leads.map((l) => {
      if (l.id !== id) return l;
      const next = { ...l, ...patch };
      // Stamp the win once. The review sequence dates every step off this,
      // so re-marking a lead won must not restart the clock.
      if (next.stage === "won" && !next.wonAt) next.wonAt = Date.now();
      return next;
    }),
  }));
}

/** Record that one step of the review sequence went out for this customer. */
export function toggleReviewStep(id: string, step: string) {
  mutate((crm) => ({
    ...crm,
    leads: crm.leads.map((l) => {
      if (l.id !== id) return l;
      const done = l.reviewSteps ?? [];
      return {
        ...l,
        reviewSteps: done.includes(step)
          ? done.filter((s) => s !== step)
          : [...done, step],
      };
    }),
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
  void fetch(`/api/crm/leads/${encodeURIComponent(id)}`, { method: "DELETE" });
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
    setCrm(loadCrm());
    setSyncState("syncing");
    void (async () => {
      try {
        const response = await fetch("/api/crm");
        if (!response.ok) throw new Error("CRM fetch failed");
        const remote = await response.json() as Crm;
        const local = loadCrm();
        const remoteLeadIds = new Set(remote.leads.map((lead) => lead.id));
        const remoteEventIds = new Set(remote.events.map((event) => event.id));
        const merged: Crm = {
          leads: [...remote.leads, ...local.leads.filter((lead) => !remoteLeadIds.has(lead.id))],
          events: [...remote.events, ...local.events.filter((event) => !remoteEventIds.has(event.id))],
          visitor: local.visitor,
        };
        remoteReady = false;
        saveCrm(merged);
        remoteReady = true;
        await syncSnapshot(merged);
        await flushOutbox();
        setCrm(merged);
      } catch {
        setSyncState("offline");
      }
    })();
    window.addEventListener(CHANGED, read);
    // Another tab writing the same key — keeps two open dashboards in step.
    window.addEventListener("storage", read);
    const reconnect = () => {
      void flushOutbox();
      if (remoteReady) void syncSnapshot(loadCrm());
    };
    window.addEventListener("online", reconnect);
    return () => {
      window.removeEventListener(CHANGED, read);
      window.removeEventListener("storage", read);
      window.removeEventListener("online", reconnect);
    };
  }, []);

  return crm;
}

export function useCrmSyncState(): SyncState {
  const [state, setState] = useState<SyncState>(syncState);
  useEffect(() => {
    const update = () => setState(syncState);
    window.addEventListener(SYNC_CHANGED, update);
    return () => window.removeEventListener(SYNC_CHANGED, update);
  }, []);
  return state;
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
