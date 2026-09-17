import { createContext, useContext, useEffect, type ReactNode } from "react";

/**
 * Minimal SSR-aware document head manager, in two modes:
 *  - Server (prerender): tags push into a collector that entry-server reads and
 *    injects into the static HTML <head>, so crawlers get real meta + JSON-LD.
 *  - Client: tags are applied imperatively to document.head on mount/update.
 *
 * One <Head> per page. Re-rendering replaces all previously managed tags.
 */

export interface HeadTag {
  tag: "title" | "meta" | "link" | "script";
  attrs?: Record<string, string>;
  text?: string;
}

export interface HeadCollector {
  tags: HeadTag[];
}

const HeadContext = createContext<HeadCollector | null>(null);

export function HeadProvider({
  collector,
  children,
}: {
  collector?: HeadCollector;
  children: ReactNode;
}) {
  return (
    <HeadContext.Provider value={collector ?? null}>
      {children}
    </HeadContext.Provider>
  );
}

const isServer = typeof window === "undefined";
const MANAGED = "data-head";

function applyToDocument(tags: HeadTag[]) {
  document.head.querySelectorAll(`[${MANAGED}]`).forEach((el) => el.remove());

  for (const t of tags) {
    if (t.tag === "title") {
      document.title = t.text ?? "";
      continue;
    }
    const el = document.createElement(t.tag);
    el.setAttribute(MANAGED, "");
    if (t.attrs) {
      for (const [k, v] of Object.entries(t.attrs)) el.setAttribute(k, v);
    }
    if (t.text) el.textContent = t.text;
    document.head.appendChild(el);
  }
}

export function Head({ tags }: { tags: HeadTag[] }) {
  const collector = useContext(HeadContext);

  // Server render: collect synchronously for injection.
  if (isServer && collector) {
    collector.tags.push(...tags);
  }

  // Client: apply imperatively whenever the tag set changes.
  const key = JSON.stringify(tags);
  useEffect(() => {
    applyToDocument(tags);
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

/** Serialize collected head tags to an HTML string for SSR injection. */
export function renderHeadToString(tags: HeadTag[]): string {
  return tags
    .map((t) => {
      if (t.tag === "title") return `<title>${escapeHtml(t.text ?? "")}</title>`;
      const attrs = t.attrs
        ? Object.entries(t.attrs)
            .map(([k, v]) => `${k}="${escapeAttr(v)}"`)
            .join(" ")
        : "";
      if (t.tag === "script") {
        return `<script ${attrs}>${t.text ?? ""}</script>`;
      }
      return `<${t.tag} ${attrs} />`;
    })
    .join("\n    ");
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escapeAttr(s: string) {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}
