import { useEffect, useState } from "react";
import { GripVertical } from "lucide-react";
import type { Status } from "@/content/marketing";
import { StatusPill } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

/**
 * Campaign board.
 *
 * Columns are the campaign statuses already in content/marketing.ts, so the
 * board is a view of the real plan rather than a second copy of it. Cards can
 * be dragged between columns, and where a card has been moved is remembered —
 * but only in this browser.
 *
 * That limitation is stated on the board itself and is not a detail: there is
 * no server behind this build, so a move made here is invisible to anyone
 * else and is gone if the browser's data is cleared. It is a planning surface
 * for one person, not a shared system of record.
 */

const COLUMNS: { status: Status; label: string }[] = [
  { status: "not-connected", label: "Not connected" },
  { status: "blocked", label: "Blocked" },
  { status: "draft", label: "Draft" },
  { status: "ready", label: "Ready" },
  { status: "live", label: "Live" },
];

const STORE = "cca.admin.board.v1";

export interface BoardCard {
  id: string;
  title: string;
  meta: string;
  note?: string;
  footer?: string;
  status: Status;
}

function readOverrides(): Record<string, Status> {
  try {
    const raw = localStorage.getItem(STORE);
    return raw ? (JSON.parse(raw) as Record<string, Status>) : {};
  } catch {
    return {};
  }
}

export function CampaignBoard({ cards }: { cards: BoardCard[] }) {
  const [moved, setMoved] = useState<Record<string, Status>>({});
  const [dragging, setDragging] = useState<string | null>(null);
  const [over, setOver] = useState<Status | null>(null);

  // Read after mount: the prerendered HTML has no access to localStorage, and
  // reading during render would make the markup and the first paint disagree.
  useEffect(() => setMoved(readOverrides()), []);

  function move(id: string, status: Status) {
    setMoved((prev) => {
      const next = { ...prev, [id]: status };
      try {
        localStorage.setItem(STORE, JSON.stringify(next));
      } catch {
        /* private browsing, or storage disabled — the board still works for
           this session, it just will not be here next time. */
      }
      return next;
    });
  }

  const statusOf = (c: BoardCard) => moved[c.id] ?? c.status;
  const dirty = Object.keys(moved).length > 0;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-navy/50">
          Drag a card to change its column.{" "}
          <strong className="font-semibold text-navy/75">
            Moves are saved in this browser only
          </strong>{" "}
          — nobody else sees them, and clearing site data resets the board.
        </p>
        {dirty && (
          <button
            type="button"
            onClick={() => {
              setMoved({});
              try {
                localStorage.removeItem(STORE);
              } catch {
                /* nothing to clear */
              }
            }}
            className="rounded-full px-3 py-1 text-xs font-semibold text-navy/60 ring-1 ring-navy/15 transition-colors hover:bg-navy/6"
          >
            Reset to the plan
          </button>
        )}
      </div>

      {/* A real board scrolls sideways. Squeezing five columns into the
          content width turned every card into four lines of wrapped text. */}
      <div
        className="-mx-5 mt-4 flex gap-3 overflow-x-auto px-5 pb-2"
        data-wide=""
      >
        {COLUMNS.map((col) => {
          const inColumn = cards.filter((c) => statusOf(c) === col.status);
          return (
            <section
              key={col.status}
              onDragOver={(e) => {
                e.preventDefault();
                setOver(col.status);
              }}
              onDragLeave={() => setOver((s) => (s === col.status ? null : s))}
              onDrop={(e) => {
                e.preventDefault();
                if (dragging) move(dragging, col.status);
                setDragging(null);
                setOver(null);
              }}
              className={cn(
                "w-[16.5rem] shrink-0 rounded-2xl p-3 ring-1 transition-colors",
                over === col.status
                  ? "bg-blue/8 ring-blue/40"
                  : "bg-navy/[0.035] ring-navy/10/70",
              )}
            >
              <header className="flex items-center justify-between gap-2 px-1 pb-3">
                <StatusPill status={col.status} />
                <span className="font-mono text-[0.7rem] tabular-nums text-navy/40">
                  {String(inColumn.length).padStart(2, "0")}
                </span>
              </header>

              <ul className="space-y-2.5">
                {inColumn.map((c) => (
                  <li key={c.id}>
                    <article
                      draggable
                      onDragStart={() => setDragging(c.id)}
                      onDragEnd={() => {
                        setDragging(null);
                        setOver(null);
                      }}
                      className={cn(
                        "group cursor-grab rounded-xl bg-white p-3.5 shadow-[0_1px_2px_rgb(10_35_82/0.05),0_10px_24px_-18px_rgb(10_35_82/0.5)] transition-shadow active:cursor-grabbing",
                        dragging === c.id && "opacity-50",
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <GripVertical
                          className="mt-0.5 size-3.5 shrink-0 text-navy/25 transition-colors group-hover:text-navy/40"
                          aria-hidden="true"
                        />
                        <div className="min-w-0">
                          <p className="text-[0.82rem] font-semibold leading-snug text-navy">
                            {c.title}
                          </p>
                          <p className="mt-0.5 text-[0.7rem] font-medium text-blue">
                            {c.meta}
                          </p>
                          {c.note && (
                            <p className="mt-1.5 text-[0.72rem] leading-snug text-navy/50">
                              {c.note}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 border-t border-navy/8 pt-2.5">
                        {c.footer && (
                          <p className="font-mono text-[0.6rem] uppercase leading-snug tracking-[0.06em] text-navy/40">
                            {c.footer}
                          </p>
                        )}
                        {/* Keyboard and screen-reader path to the same action.
                            Drag and drop on its own would leave this board
                            unusable without a pointer. */}
                        <label className="mt-2 block">
                          <span className="sr-only">Move {c.title} to</span>
                          <select
                            value={statusOf(c)}
                            onChange={(e) => move(c.id, e.target.value as Status)}
                            className="w-full rounded-md border-0 bg-navy/[0.035] py-1.5 pl-2 pr-6 text-[0.65rem] font-semibold text-navy/55 ring-1 ring-inset ring-navy/10 focus:ring-2 focus:ring-blue"
                          >
                            {COLUMNS.map((o) => (
                              <option key={o.status} value={o.status}>
                                {o.label}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                    </article>
                  </li>
                ))}

                {inColumn.length === 0 && (
                  <li className="rounded-xl border border-dashed border-navy/10 px-3 py-6 text-center text-[0.72rem] text-navy/40">
                    Nothing here
                  </li>
                )}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
