import { useMemo, useState } from "react";
import { Camera, Check, Copy, ImageIcon, Instagram } from "lucide-react";
import { POST_KINDS, posts, type Post, type PostKind } from "@/content/social-posts";
import { socialPlan } from "@/content/calendar";
import { AdminShell } from "@/components/admin/shell";
import { Instrument, Panel, StatCard } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

/**
 * The posting schedule.
 *
 * Built to be worked from a phone on a Tuesday morning: the date, the
 * artwork, the caption, and a copy button. Nothing to compose, nothing to
 * decide, no hashtag block to delete.
 */

const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);
const asDate = (iso: string) => new Date(`${iso}T12:00:00`);

export default function AdminSocial() {
  const [filter, setFilter] = useState<PostKind | "all">("all");

  const shown = useMemo(
    () => posts.filter((p) => filter === "all" || p.kind === filter),
    [filter],
  );
  const needPhoto = posts.filter((p) => !p.ready);
  const upcoming = posts.filter((p) => asDate(p.date) >= TODAY);

  return (
    <AdminShell
      title="Social calendar"
      lead="Two posts a week, written and dated. Copy the caption, attach the artwork, schedule it. No hashtags and no composing required."
    >
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          label="Posts written"
          value={posts.length}
          icon={<Instagram />}
          hint="Through 29 December"
        />
        <StatCard
          label="Still to go out"
          value={upcoming.length}
          icon={<Instagram />}
          hint="From today onward"
        />
        <StatCard
          label="Use a brand creative"
          value={posts.length - needPhoto.length}
          tone="good"
          icon={<ImageIcon />}
          hint="Red tile below = file not in the repo yet"
        />
        <StatCard
          label="Need a photo"
          value={needPhoto.length}
          tone="warn"
          icon={<Camera />}
          hint="Phone camera on a job is fine"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <Instrument
          className="lg:col-span-5 lg:self-start"
          label="House style"
          footnote={socialPlan.cadence}
        >
          <ul className="mt-3 space-y-2.5 text-[0.85rem] leading-relaxed text-white/80">
            {[
              "No hashtags. They do close to nothing for a local service business and they make a caption read as an advert.",
              "One emoji at most, usually none.",
              "The first line has to work alone — Instagram cuts at about 125 characters.",
              "Plain sentences. No all-caps, no fake urgency, no claim the business cannot back.",
              "One ask, at the end, and not always the same ask.",
            ].map((l) => (
              <li key={l} className="flex gap-2.5">
                <Check className="mt-0.5 size-3.5 shrink-0 text-cyan" aria-hidden="true" />
                {l}
              </li>
            ))}
          </ul>
        </Instrument>

        <Panel
          className="lg:col-span-7"
          title="Artwork still outstanding"
          subtitle="Five posts need a photograph taken on a job — those are the five that will outperform the rest. Separately, any tile below showing 'Not uploaded' is a brand graphic that has not been added to public/brand/social yet."
        >
          <ul className="space-y-2.5">
            {needPhoto.map((p) => (
              <li
                key={p.date}
                className="flex min-w-0 gap-3 rounded-xl bg-gold/8 p-3.5 ring-1 ring-inset ring-gold/35"
              >
                <Camera className="mt-0.5 size-4 shrink-0 text-amber-700" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="text-[0.82rem] font-semibold text-navy">{p.creative}</p>
                  <p className="mt-0.5 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-navy/45">
                    Needed by {asDate(p.date).toLocaleDateString("en-US", { day: "numeric", month: "short" })}
                  </p>
                  {p.note && (
                    <p className="mt-1 text-[0.76rem] leading-relaxed text-navy/60">
                      {p.note}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel
        title="The schedule"
        subtitle="Tuesdays and Fridays. Copy the caption, attach the named artwork, schedule it."
        action={
          <div className="flex flex-wrap gap-1.5">
            <Chip active={filter === "all"} onClick={() => setFilter("all")}>
              All
            </Chip>
            {(Object.keys(POST_KINDS) as PostKind[]).map((k) => (
              <Chip
                key={k}
                active={filter === k}
                onClick={() => setFilter(filter === k ? "all" : k)}
              >
                {POST_KINDS[k].label}
              </Chip>
            ))}
          </div>
        }
      >
        <ol className="space-y-4">
          {shown.map((p) => (
            <PostCard key={p.date} post={p} />
          ))}
        </ol>
      </Panel>

      <Panel
        title="What gets posted, and why in this mix"
        subtitle="The ratio matters more than any individual post."
      >
        <ul className="grid gap-4 md:grid-cols-2">
          {socialPlan.pillars.map((pillar, i) => (
            <li key={pillar.name} className="flex min-w-0 gap-3.5">
              <span className="mt-0.5 font-mono text-[0.7rem] font-bold tabular-nums text-orange">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <p className="flex flex-wrap items-baseline gap-x-3">
                  <span className="font-display text-[0.9rem] font-extrabold text-navy">
                    {pillar.name}
                  </span>
                  <span className="font-mono text-[0.62rem] uppercase tracking-[0.1em] text-navy/45">
                    {pillar.share}
                  </span>
                </p>
                <p className="mt-1 text-[0.8rem] leading-relaxed text-navy/60">
                  {pillar.detail}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-5 rounded-xl bg-navy/[0.03] p-4 text-[0.8rem] leading-relaxed text-navy/70">
          {socialPlan.note}
        </p>
      </Panel>
    </AdminShell>
  );
}

function PostCard({ post }: { post: Post }) {
  const [copied, setCopied] = useState(false);
  // An upload that is not there yet should be visible, not silent.
  const [missing, setMissing] = useState(false);
  const d = asDate(post.date);
  const past = d < TODAY;

  return (
    <li
      className={cn(
        "grid min-w-0 gap-4 rounded-xl p-4 ring-1 ring-inset sm:grid-cols-[7rem_8rem_minmax(0,1fr)]",
        past ? "bg-navy/[0.015] opacity-60 ring-navy/6" : "bg-navy/[0.025] ring-navy/8",
      )}
    >
      <div>
        <p className="font-display text-[1.05rem] font-extrabold leading-none text-navy">
          {d.toLocaleDateString("en-US", { day: "numeric", month: "short" })}
        </p>
        <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-navy/40">
          {d.toLocaleDateString("en-US", { weekday: "long" })}
        </p>
        <span
          className={cn(
            "mt-2.5 inline-block rounded-full px-2 py-0.5 text-[0.62rem] font-bold ring-1 ring-inset",
            POST_KINDS[post.kind].chip,
          )}
        >
          {POST_KINDS[post.kind].label}
        </span>
      </div>

      {/* The artwork, 4:5 like the feed slot it goes into. */}
      <div className="min-w-0">
        {post.image && !missing ? (
          <img
            src={post.image}
            alt={post.creative}
            width={1080}
            height={1350}
            loading="lazy"
            onError={() => setMissing(true)}
            className="aspect-[4/5] w-full rounded-lg object-cover ring-1 ring-navy/10"
          />
        ) : (
          <div
            className={cn(
              "grid aspect-[4/5] w-full place-items-center rounded-lg border border-dashed px-2 text-center",
              post.ready ? "border-ember/40 bg-ember/5" : "border-gold/50 bg-gold/8",
            )}
          >
            <span className="min-w-0">
              <Camera
                className={cn(
                  "mx-auto size-4",
                  post.ready ? "text-ember" : "text-amber-700",
                )}
                aria-hidden="true"
              />
              <span
                className={cn(
                  "mt-1.5 block font-mono text-[0.55rem] font-bold uppercase leading-snug tracking-[0.08em]",
                  post.ready ? "text-ember" : "text-amber-700",
                )}
              >
                {post.ready ? "Not uploaded" : "Photo needed"}
              </span>
            </span>
          </div>
        )}
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <p
            className={cn(
              "flex min-w-0 items-start gap-2 text-[0.82rem] font-semibold",
              post.ready ? "text-navy" : "text-amber-800",
            )}
          >
            {post.ready ? (
              <ImageIcon className="mt-0.5 size-3.5 shrink-0 text-navy/40" aria-hidden="true" />
            ) : (
              <Camera className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            )}
            {post.creative}
          </p>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(post.caption).then(
                () => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1600);
                },
                () => {
                  /* clipboard blocked — the caption is on screen to select */
                },
              );
            }}
            aria-label={copied ? "Copied" : `Copy the caption for ${post.date}`}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.72rem] font-bold transition-colors",
              copied
                ? "bg-emerald-50 text-emerald-700"
                : "bg-white text-navy/60 ring-1 ring-inset ring-navy/15 hover:text-navy",
            )}
          >
            {copied ? (
              <Check className="size-3.5" aria-hidden="true" />
            ) : (
              <Copy className="size-3.5" aria-hidden="true" />
            )}
            {copied ? "Copied" : "Copy caption"}
          </button>
        </div>

        <p className="mt-3 whitespace-pre-wrap rounded-lg bg-white p-3.5 text-[0.84rem] leading-relaxed text-navy/80 ring-1 ring-inset ring-navy/8">
          {post.caption}
        </p>

        {post.note && (
          <p className="mt-2 text-[0.74rem] leading-relaxed text-navy/50">
            <span className="font-mono text-[0.58rem] uppercase tracking-[0.1em] text-navy/40">
              Note ·{" "}
            </span>
            {post.note}
          </p>
        )}
      </div>
    </li>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full px-3 py-1.5 text-[0.7rem] font-bold transition-colors",
        active ? "bg-navy text-white" : "text-navy/55 ring-1 ring-inset ring-navy/15 hover:bg-navy/5",
      )}
    >
      {children}
    </button>
  );
}
