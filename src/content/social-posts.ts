/**
 * The Instagram schedule.
 *
 * Daily for thirty days from 3 November, then it steps down.
 *
 * Daily is a launch cadence, not a forever cadence. It earns two things that
 * are worth the effort once: a profile that looks alive to anybody who
 * checks it after a recommendation, and thirty days of Pixel traffic, which
 * is exactly the window a retargeting audience needs before it can run. From
 * 3 December it drops to three a week, which a contractor can actually
 * sustain — and a sustained three beats an abandoned seven.
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

Give us a follow if you own a home down here. We post the things that save people an August callout.`,
  },
  {
    date: "2026-11-04",
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
    date: "2026-11-05",
    kind: "work",
    creative: "Photo needed — condenser coil, before and after cleaning, same angle",
    ready: false,
    caption: `Same coil. Twenty minutes apart.

The left one could not breathe. A unit in that state runs longer, costs more every month, and fails earlier than it should.

Cleaning it is part of a standard service visit. It is not an upsell and it is not an extra.

If yours has not been looked at this year, it probably looks like the left.`,
    note: "Shoot list A. The strongest post type there is — phone camera is fine, just keep the angle identical.",
  },
  {
    date: "2026-11-06",
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
    date: "2026-11-07",
    kind: "offer",
    creative: "Comfort Lives Here",
    ready: true,
    image: "/brand/social/comfort-lives-here.webp",
    caption: `The eighty-nine dollar Clean and Tune.

Ten points, a licensed technician, and a written report with the actual readings on it. Thermostat, drain line, capacitor, both coils, amp draws, refrigerant pressures.

If everything is fine we tell you that and leave. Plenty of visits end exactly that way.

November is the quiet month to book it. Link in bio.`,
  },
  {
    date: "2026-11-08",
    kind: "advice",
    creative: "Photo needed — condensate drain line and P-trap at an air handler",
    ready: false,
    caption: `The most common call we take is not a broken compressor. It is this pipe.

A blocked condensate line backs water up into the air handler, the safety switch trips, and the system shuts itself off. People assume the worst. It is usually a twenty-minute job.

You can slow it down yourself. Pour a cup of distilled vinegar down the access port every couple of months.

If it has already shut off, that is a call rather than a DIY.`,
    note: "Shoot list A.",
  },
  {
    date: "2026-11-09",
    kind: "area",
    creative: "We Service Estero Florida",
    ready: true,
    image: "/brand/social/we-service-estero.webp",
    caption: `Estero and Bonita Springs, you are on the route.

Closest part of our service area to the shop, which means shorter drive times and more same-day slots than anywhere else we cover.

Repairs, replacements, maintenance plans. Licensed and insured, flat pricing, no overtime charge for plan members.`,
  },
  {
    date: "2026-11-10",
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
    date: "2026-11-11",
    kind: "team",
    creative: "Photo needed — a technician at a condenser, from behind or in profile",
    ready: false,
    caption: `This is who turns up at your door.

In a trade where the worry is a stranger in your house, we think it is worth showing faces. Licensed mechanical contractors on staff, never subcontracted out.

Same person who diagnoses it quotes it, and the price goes in writing before anything is opened.`,
    note: "Shoot list A. Ask the tech first — a face with a name outperforms every stock photo.",
  },
  {
    date: "2026-11-12",
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
    date: "2026-11-13",
    kind: "area",
    creative: "Serving SWFL",
    ready: true,
    image: "/brand/social/serving-swfl.webp",
    caption: `Lee, Collier, Charlotte and Sarasota.

Nine towns on the route, one crew, the same pricing in all of them. We are based in Fort Myers and we are on the road most of the day.

Not sure if you are in range? Ask in the comments with your town and we will tell you straight.`,
  },
  {
    date: "2026-11-14",
    kind: "advice",
    creative: "Photo needed — a filter being pulled from a return, dirty side to camera",
    ready: false,
    caption: `If you only do one thing for your system this year, do this one.

A blocked filter makes the blower work harder, drops airflow across the coil, and in a bad case freezes it solid. It is a five dollar part doing a thousand dollars of damage.

Every ninety days in a normal house. Every thirty if you have dogs.

Write the date on the edge of the new one in marker. It is the only way anyone remembers.`,
    note: "Shoot list A.",
  },
  {
    date: "2026-11-15",
    kind: "work",
    creative: "Hurricane Season Be Prepared",
    ready: true,
    image: "/brand/social/hurricane-season.webp",
    caption: `Storm season is over. Now is when the work gets done.

A condenser raised onto a proper stand survives water that writes off one sitting on the original slab. Hurricane-rated mounts and straps are a code requirement on new installs and a sensible retrofit on anything older.

All of it takes about an hour in November. None of it can be done in the week a storm is named.

If yours is still on the pad it came on, this is the call to make.`,
  },
  {
    date: "2026-11-16",
    kind: "advice",
    creative: "Photo needed — a thermostat on a wall, screen readable",
    ready: false,
    caption: `Seventy-eight is the number people argue about.

Set it lower and the system runs longer, the bill climbs, and in a humid house it still does not feel better. Humidity is what makes a room feel cold, not the number on the wall.

If seventy-eight feels wrong, the problem is usually airflow or a system that is oversized and short-cycling, not the thermostat.

Both are things a tune-up finds.`,
    note: "Shoot list B.",
  },
  {
    date: "2026-11-17",
    kind: "team",
    creative: "Meet Our Mascot",
    ready: true,
    image: "/brand/social/meet-our-mascot.webp",
    caption: `Why a husky, in Florida.

Because the whole job is making a house feel like somewhere it is not. Ninety-two outside, seventy-four inside, and nobody thinking about it.

That is the entire business in one sentence.`,
  },
  {
    date: "2026-11-18",
    kind: "advice",
    creative: "3 Things You Need To Know About Your AC",
    ready: true,
    image: "/brand/social/3-things-about-your-ac.webp",
    caption: `Three sounds worth paying attention to.

A hum with no fan spinning. Usually a capacitor, and usually cheap if you catch it before the motor goes with it.

A rhythmic clicking from the outdoor unit. Often the contactor, and it is about to stop working entirely.

A hiss or a bubbling. That is refrigerant, which means a leak, which means it will not fix itself.

None of these need an emergency call today. All of them need a call this week.`,
  },
  {
    date: "2026-11-19",
    kind: "work",
    creative: "Photo needed — condensate pan being treated, tablet or tablet strip visible",
    ready: false,
    caption: `This is the least interesting part of a service visit and one of the most useful.

The drain pan sits wet for most of the year in this climate. Treated, it stays clear. Untreated, it grows the thing that eventually blocks the line and shuts the system off in August.

It takes two minutes and it is part of the standard ten points.`,
    note: "Shoot list B.",
  },
  {
    date: "2026-11-20",
    kind: "area",
    creative: "Serving Naples Florida",
    ready: true,
    image: "/brand/social/serving-naples.webp",
    caption: `A Naples thing specifically.

Closer to the water, condenser coils corrode faster. Salt gets into the fins, the unit loses its ability to shed heat, and it works harder every year to do the same job.

A rinse on a service visit slows it down a lot. It is not a product and we do not charge extra for it.

If you are west of 41, this one is worth knowing.`,
  },
  {
    date: "2026-11-21",
    kind: "offer",
    creative: "Comfort Lives Here",
    ready: true,
    image: "/brand/social/comfort-lives-here.webp",
    caption: `Eighty-nine dollars, and a written report you keep.

That report is the useful part. Capacitor readings, amp draws, refrigerant pressures, coil condition. Numbers, dated, so next year you can see what changed.

A single reading is a snapshot. Two readings a year is a trend, and a trend is what tells you something is failing before it fails.

Booking into December now.`,
  },
  {
    date: "2026-11-22",
    kind: "advice",
    creative: "Photo needed — flexible ductwork in an attic, a joint or a sag visible",
    ready: false,
    caption: `Half the air you paid to cool can be lost before it reaches a room.

Ductwork in a Florida attic sits in a hundred and thirty degrees. Joints separate, insulation compresses, and a sag full of condensation is doing nothing for anybody.

If one room never gets cold and the rest are fine, it is almost always up here and not the unit outside.`,
    note: "Shoot list B. Attic shots photograph badly — use a work light.",
  },
  {
    date: "2026-11-23",
    kind: "area",
    creative: "Serving SWFL",
    ready: true,
    image: "/brand/social/serving-swfl.webp",
    caption: `Snowbird season is here, which changes what we get called for.

Houses that sat closed all summer get opened in November and the first thing people notice is a smell. That is usually humidity in the ductwork rather than anything mechanical.

If you manage a place for somebody who is away, run it for a day before they land and open a window on the way out.`,
  },
  {
    date: "2026-11-24",
    kind: "work",
    creative: "Residential HVAC Services",
    ready: true,
    image: "/brand/social/residential-hvac-services.webp",
    caption: `Repair or replace. The honest version.

Under about ten years old with a few hundred dollars of fault, repair it. Almost always.

Over fifteen, with a compressor or a coil gone, replacement is usually the cheaper decision over five years even though it is the bigger number today.

Between those two it genuinely depends, and anyone who answers instantly without looking at the system is selling rather than advising.`,
  },
  {
    date: "2026-11-25",
    kind: "advice",
    creative: "Your Comfort Matters",
    ready: true,
    image: "/brand/social/your-comfort-matters.webp",
    caption: `Going away for Thanksgiving? Do not switch it off.

An empty house in Florida with the AC off climbs to whatever the outside humidity is, and that is how you come back to a smell in the ductwork and a damp feeling that takes a week to clear.

Set it to seventy-eight and leave it. The few dollars it costs is cheaper than what fixing the alternative costs.`,
  },
  {
    date: "2026-11-26",
    kind: "team",
    creative: "Meet Our Mascot",
    ready: true,
    image: "/brand/social/meet-our-mascot.webp",
    caption: `Happy Thanksgiving from all of us.

The office is closed today. The emergency line is not, and a person answers it — same as every other day of the year.

If your system picks today to quit, call. We would rather be out than have you sit in it.`,
  },
  {
    date: "2026-11-27",
    kind: "work",
    creative: "Hurricane Season Be Prepared",
    ready: true,
    image: "/brand/social/hurricane-season.webp",
    caption: `The work nobody does until it is too late.

Elevating a condenser. Replacing straps that were never rated. Checking the disconnect. Inspecting ductwork that got wet in 2022 and dried in place.

Every one of those is an hour in November and impossible in the week a storm is named.

We are booking storm-readiness checks through the quiet months. No pressure to do any of the work — you get a written list either way.`,
  },
  {
    date: "2026-11-28",
    kind: "work",
    creative: "Photo needed — a capacitor, old and bulging next to a new one",
    ready: false,
    caption: `This is the single most common failure on this coast.

The one on the left is swollen. When a capacitor goes, the fan hums and will not start, and the compressor starts drawing current it should not. Left long enough it takes the motor with it.

It is an inexpensive part and about twenty minutes. It is also exactly the thing a tune-up catches in November instead of July.`,
    note: "Shoot list B. Keep a failed one from a job — this photo is worth having permanently.",
  },
  {
    date: "2026-11-29",
    kind: "area",
    creative: "We Service Estero Florida",
    ready: true,
    image: "/brand/social/we-service-estero.webp",
    caption: `Estero, Bonita, Naples, Fort Myers and up the coast to Venice.

Nine towns. Same crew in all of them, same flat pricing, same number.

We are not a franchise and there is no call centre. The person who picks up knows where the vans are.`,
  },
  {
    date: "2026-11-30",
    kind: "work",
    creative: "Photo needed — an install in progress, new unit and old unit both in frame",
    ready: false,
    caption: `Out with one, in with the other, permit pulled, old one hauled away.

The part people do not expect is the paperwork. Florida requires a permit for a system replacement, the issuing office is different in every city, and the job gets inspected.

That inspection record is what a buyer's inspector asks for years later. Worth having done properly.`,
    note: "Shoot list C — needs a replacement job on the books.",
  },
  {
    date: "2026-12-01",
    kind: "offer",
    creative: "Comfort Lives Here",
    ready: true,
    image: "/brand/social/comfort-lives-here.webp",
    caption: `December is the easiest month of the year to get a slot.

Eighty-nine dollars, ten points, written report. In July this booking takes a week. Right now it takes a day.

If your system has not been looked at in twelve months, this is the month.`,
  },
  {
    date: "2026-12-02",
    kind: "advice",
    creative: "3 Things You Need To Know About Your AC",
    ready: true,
    image: "/brand/social/3-things-about-your-ac.webp",
    caption: `That is thirty days of posts. Here is the short version of all of it.

Change the filter. Keep the drain line clear. Get it looked at twice a year, before the season rather than during it.

Do those three and most of what we get called out for at two in the morning never happens.

We are dropping to three posts a week from here. Same stuff, less of it.`,
  },
];

/* ---------------------------------------------------------- shot lists */

/**
 * The photographs the calendar needs, grouped so they can be taken in
 * batches rather than one at a time.
 *
 * Nine of the thirty posts need a picture we do not have. Chased
 * individually that is nine interruptions; grouped it is two ordinary
 * service visits and one replacement job.
 */
export const shotLists: {
  name: string;
  when: string;
  shots: string[];
  note: string;
}[] = [
  {
    name: "Shoot A — one tune-up visit",
    when: "Before 5 November",
    shots: [
      "Condenser coil, before and after cleaning, identical angle",
      "Condensate drain line and P-trap at the air handler",
      "The technician at the condenser, from behind or in profile",
      "A filter pulled from the return, dirty side to camera",
    ],
    note: "All four come off a single standard service visit. Phone camera is fine — daylight, and wipe the lens.",
  },
  {
    name: "Shoot B — a second visit, or the same one",
    when: "Before 16 November",
    shots: [
      "A thermostat on the wall with the screen readable",
      "The drain pan being treated, tablet visible",
      "Flexible ductwork in an attic, a joint or a sag in frame",
      "A failed capacitor next to a new one",
    ],
    note: "Keep a bulging capacitor from a job. That photo is worth having permanently and gets reused.",
  },
  {
    name: "Shoot C — a replacement job",
    when: "Before 30 November",
    shots: ["An install in progress with the old and new unit both in frame"],
    note: "Needs a replacement on the books. If none lands in time, move the post and run a brand graphic.",
  },
];
