/**
 * The Instagram schedule.
 *
 * Two posts a week, Tuesday and Friday, dated from the first week of
 * November 2026. Two sustained beats five abandoned, and Tue/Fri avoids both
 * the Monday inbox and the weekend drop-off.
 *
 * House style for every caption here, because it is the thing most
 * contractor accounts get wrong:
 *
 *   - No hashtags. They do close to nothing for a local service business on
 *     Instagram in 2026 and they make a caption look like an advert.
 *   - At most one emoji, and usually none. A thermostat is not exciting and
 *     pretending otherwise reads as a stock post.
 *   - First line works alone. Instagram truncates after roughly 125
 *     characters, so the hook has to land before "more".
 *   - Plain sentences. No "🔥 DON'T MISS OUT 🔥", no all-caps, no fake
 *     urgency, no claim the business cannot back.
 *   - One ask, at the end, and not always the same ask.
 *
 * `creative` names the artwork the client already has. Where a post needs a
 * photograph we do not hold, it says so rather than pretending otherwise —
 * those are the posts that need a phone pulled out on a job.
 */

export type PostKind = "work" | "team" | "advice" | "offer" | "area";

export const POST_KINDS: Record<PostKind, { label: string; chip: string }> = {
  work: { label: "The work", chip: "bg-blue/10 text-blue ring-blue/25" },
  team: { label: "The team", chip: "bg-cyan/18 text-[#0a5b7d] ring-cyan/40" },
  advice: { label: "Advice", chip: "bg-emerald-500/12 text-emerald-700 ring-emerald-500/25" },
  offer: { label: "The offer", chip: "bg-gold/20 text-amber-800 ring-gold/40" },
  area: { label: "Service area", chip: "bg-orange/12 text-orange ring-orange/30" },
};

export interface Post {
  date: string;
  kind: PostKind;
  /** The artwork. "Photo needed" means it is not in the brand folder yet. */
  creative: string;
  /** Whether the creative exists or has to be shot. */
  ready: boolean;
  /**
   * Where the file lives under public/. The calendar renders it and falls
   * back to a placeholder if it is not there yet, so a missing upload is
   * visible rather than silent. All nine brand graphics landed on
   * 2 November 2026; see brand/SOCIAL-ASSETS.md for the mapping.
   */
  image?: string;
  caption: string;
  /** Not part of the caption — a note for whoever schedules it. */
  note?: string;
}

export const posts: Post[] = [
  {
    date: "2026-11-03",
    kind: "team",
    creative: "Meet Our Mascot",
    ready: true,
    image: "/brand/social/meet-our-mascot.webp",
    caption: `Meet the face on the van.

He turns up on every truck, every shirt and every invoice, and he has opinions about dirty condenser coils.

Behind him are licensed mechanical contractors working across Naples, Bonita Springs and Estero. Same crew, same pricing, same number answered around the clock.

Give us a follow if you own a home down here. We post the things that save people a August callout.`,
  },
  {
    date: "2026-11-06",
    kind: "advice",
    creative: "3 Things You Need To Know About Your AC",
    ready: true,
    image: "/brand/social/3-things-about-your-ac.webp",
    caption: `Three things worth knowing about the system outside your house.

One. It runs close to year-round here, so ten to fifteen years is a realistic life, not twenty.

Two. Salt air shortens condenser coil life. If you are near the water, that end of the range is yours.

Three. The cheapest repair you will ever pay for is the one found in a tune-up. A weak capacitor in November is a part. The same capacitor in July is an emergency call and a hot house.

Ask us anything in the comments. We answer them.`,
  },
  {
    date: "2026-11-10",
    kind: "area",
    creative: "Serving Naples Florida",
    ready: true,
    image: "/brand/social/serving-naples.webp",
    caption: `Naples, we are out your way.

Old Naples, Park Shore, Pelican Bay, North Naples and everything between. Same-day repair most days, and a real person on the phone at any hour.

Licensed mechanical contractor, flat price agreed before anything is opened.

Tap the number in our bio if the system is doing something it should not.`,
  },
  {
    date: "2026-11-13",
    kind: "work",
    creative: "Photo needed — a condenser coil before and after cleaning, same angle, same job",
    ready: false,
    caption: `Same coil. Twenty minutes apart.

The left one could not breathe. A unit in that state runs longer, costs more every month, and fails earlier than it should.

Cleaning it is part of a standard service visit. It is not an upsell and it is not an extra.

If yours has not been looked at this year, it probably looks like the left.`,
    note: "The strongest post type there is. Shoot it on the next tune-up — phone camera is fine, just keep the angle identical.",
  },
  {
    date: "2026-11-17",
    kind: "offer",
    creative: "Comfort Lives Here",
    ready: true,
    image: "/brand/social/comfort-lives-here.webp",
    caption: `The eighty-nine dollar Clean and Tune.

Ten points, a licensed technician, and a written report with the actual readings on it. Thermostat, drain line, capacitor, both coils, amp draws, refrigerant pressures.

If everything is fine we tell you that and leave. Plenty of visits end exactly that way.

November and early December are the quiet months to book it. Link in bio.`,
    note: "The only hard-offer post this month. One in ten is the right ratio — more than that and the account reads as an advert.",
  },
  {
    date: "2026-11-20",
    kind: "advice",
    creative: "Photo needed — a condensate drain line and P-trap at an air handler",
    ready: false,
    caption: `The most common call we take is not a broken compressor. It is this pipe.

A blocked condensate line backs water up into the air handler, the safety switch trips, and the system shuts itself off. People assume the worst. It is usually a twenty-minute job.

You can slow it down yourself: pour a cup of distilled vinegar down the access port every couple of months.

If it has already shut off, that is a call rather than a DIY.`,
  },
  {
    date: "2026-11-24",
    kind: "area",
    creative: "We Service Estero Florida",
    ready: true,
    image: "/brand/social/we-service-estero.webp",
    caption: `Estero and Bonita Springs, you are on the route.

Closest part of our service area to the shop, which means shorter drive times and more same-day slots than anywhere else we cover.

Repairs, replacements, maintenance plans. Licensed and insured, flat pricing, no overtime charge for plan members.`,
  },
  {
    date: "2026-11-27",
    kind: "team",
    creative: "Photo needed — a technician at a condenser, taken from behind or in profile",
    ready: false,
    caption: `This is who turns up at your door.

In a trade where the worry is a stranger in your house, we think it is worth showing faces. Licensed mechanical contractors on staff, never subcontracted out.

Same person who diagnoses it quotes it, and the price goes in writing before anything is opened.`,
    note: "Ask the tech first. A face with a name outperforms every stock photo on this account.",
  },
  {
    date: "2026-12-01",
    kind: "advice",
    creative: "Your Comfort Matters",
    ready: true,
    image: "/brand/social/your-comfort-matters.webp",
    caption: `A cold snap is coming at some point, and that is when Florida systems fail.

Heat mode has not run since February. The strips are dusty, the reversing valve has not moved in nine months, and the first forty-degree night is when everyone finds out at once.

Run your heat for fifteen minutes this week while it does not matter. If it smells of burning for a minute that is normal dust. If it is still doing it after five, call someone.

Better to find out now than at six in the morning on the coldest day.`,
  },
  {
    date: "2026-12-04",
    kind: "work",
    creative: "Residential HVAC Services",
    ready: true,
    image: "/brand/social/residential-hvac-services.webp",
    caption: `Repair, replacement, maintenance. That is the whole list.

Repair is most of what we do and most of what we recommend. A failed part is a part, not a reason to sell you a system.

When replacement genuinely is the better call you get both numbers and the reasoning, in writing, and you decide.

No commission, no pressure, no visit that ends in a sales pitch.`,
  },
  {
    date: "2026-12-08",
    kind: "area",
    creative: "Serving SWFL",
    ready: true,
    image: "/brand/social/serving-swfl.webp",
    caption: `Lee, Collier, Charlotte and Sarasota.

Nine towns on the route, one crew, the same pricing in all of them. We are based in Fort Myers and we are on the road most of the day.

Not sure if you are in range? Ask in the comments with your town and we will tell you straight.`,
  },
  {
    date: "2026-12-11",
    kind: "advice",
    creative: "Photo needed — a filter being pulled from a return, dirty side to camera",
    ready: false,
    caption: `If you only do one thing for your system this year, do this one.

A blocked filter makes the blower work harder, drops airflow across the coil, and in a bad case freezes it solid. It is a five dollar part doing a thousand dollars of damage.

Every ninety days in a normal house. Every thirty if you have dogs.

Write the date on the edge of the new one in marker. It is the only way anyone remembers.`,
  },
  {
    date: "2026-12-15",
    kind: "offer",
    creative: "Comfort Lives Here",
    ready: true,
    image: "/brand/social/comfort-lives-here.webp",
    caption: `Booking the January tune-ups now.

Eighty-nine dollars, ten points, written report. January and February are the easiest months to get a slot and the best time to find the thing that would have failed in June.

Plan members get priority scheduling and no overtime charge on after-hours calls.

Link in bio, or call the number there.`,
  },
  {
    date: "2026-12-18",
    kind: "work",
    creative: "Hurricane Season Be Prepared",
    ready: true,
    image: "/brand/social/hurricane-season.webp",
    caption: `Storm season is over. Now is when the work gets done.

A condenser raised onto a proper stand survives water that writes off one sitting on the original slab. Hurricane-rated mounts and straps are a code requirement on new installs and a sensible retrofit on anything older.

All of it takes about an hour in December. None of it can be done in the week a storm is named.

If yours is still on the pad it came on, this is the call to make.`,
  },
  {
    date: "2026-12-22",
    kind: "team",
    creative: "Photo needed — the van, clean, parked somewhere recognisably local",
    ready: false,
    caption: `On the road through the holidays.

Normal hours are paused between Christmas and New Year but the emergency line is not. A person answers it, same as every other day of the year.

Thank you to everyone who had us out this year. See you in January.`,
    note: "Do not shoot the van until the wrap shows the real number — the current artwork carries a placeholder.",
  },
  {
    date: "2026-12-29",
    kind: "advice",
    creative: "3 Things You Need To Know About Your AC",
    ready: true,
    image: "/brand/social/3-things-about-your-ac.webp",
    caption: `An empty house in Florida is harder on a system than a busy one.

Snowbird places sit closed for months with the thermostat pushed up to save money. Humidity climbs, the coil stays wet, and what you come back to in March is a smell in the ductwork.

Set it to around seventy-eight rather than off, and have someone look in once a season.

If you manage a place for someone who is away, this is the thing to tell them.`,
  },
];
