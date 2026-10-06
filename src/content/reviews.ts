import { business } from "./site";

/**
 * The review request sequence.
 *
 * Reviews are the single highest-leverage thing this business can do in
 * local search, and the reason most contractors have forty reviews instead
 * of four hundred is not that customers are unwilling — it is that nobody
 * asks twice, in writing, on a schedule.
 *
 * This file is that schedule. It is the definition the dashboard renders,
 * the copy the office sends, and the thing a real automation tool gets
 * pointed at the day one exists. What makes it "automated" is the trigger
 * and the timing being fixed in advance; what is not automated today is the
 * sending, because a static site has no server and no SMS account. The
 * Resources page says so on the page itself.
 *
 * Placeholders: {{first}} {{tech}} {{city}} {{link}}
 */

/** Set once the Google Business Profile is claimed — see /admin/google. */
export const reviewLink = {
  /** Google's own short form: g.page/r/<PLACE_ID>/review. Not yet issued. */
  url: "",
  note: "Google issues this link from the Business Profile dashboard once the profile is claimed and verified. Until then there is nothing to send, which is why claiming the profile is the first blocker on Home Base.",
};

export type Channel = "in person" | "sms" | "email";

export interface ReviewStep {
  id: string;
  /** Days after the job is marked complete. */
  day: number;
  channel: Channel;
  title: string;
  /** Why this step exists at all. One sentence, no filler. */
  why: string;
  /** Sent by whom — the automation can only cover two of the three. */
  by: "Technician" | "Office" | "Automated";
  template: string;
}

export const reviewSequence: ReviewStep[] = [
  {
    id: "ask-at-truck",
    day: 0,
    channel: "in person",
    by: "Technician",
    title: "Ask before leaving the driveway",
    why: "Nothing in the sequence works as well as this. The house is cold again and the person who fixed it is standing there.",
    template:
      "Before I head out — if everything feels right, would you mind leaving us a Google review? It is the main way people around here find us. I'll text you the link in a minute so you don't have to go looking for it.",
  },
  {
    id: "sms-same-day",
    day: 0,
    channel: "sms",
    by: "Automated",
    title: "Text the link while it is still today",
    why: "Sent two hours after the job closes. The ask is already agreed to in person, so this is only the link.",
    template:
      "Hi {{first}}, {{tech}} here from Coast to Coast Air. Thanks for having us out today. If you have 30 seconds, a Google review really helps a local shop like ours: {{link}}",
  },
  {
    id: "email-day-3",
    day: 3,
    channel: "email",
    by: "Automated",
    title: "One email, with something to say",
    why: "Most people mean to and forget. Naming what to mention is the difference between a star rating and a review that ranks.",
    template:
      "Subject: Thanks again, {{first}}\n\nHi {{first}},\n\nThanks for trusting us with your system this week. If you have a minute, a short Google review would mean a lot — it is how most of our {{city}} work finds us.\n\nIf you are not sure what to write, what helps other homeowners most is simply: what was wrong, how quickly we got there, and whether the price matched the quote.\n\nLeave a review: {{link}}\n\nAnd if anything is not sitting right, reply to this email or call " +
      business.phone +
      " and we will come back out.\n\n— The team at Coast to Coast Air\nLicence " +
      business.license,
  },
  {
    id: "sms-day-7",
    day: 7,
    channel: "sms",
    by: "Automated",
    title: "Last nudge, then stop",
    why: "A third ask converts. A fourth annoys. The sequence ends here whether or not they reviewed.",
    template:
      "Hi {{first}} — last note from us, promise. If the AC is still running right, a quick Google review helps us more than you'd think: {{link}} Thanks either way.",
  },
  {
    id: "stop",
    day: 7,
    channel: "email",
    by: "Office",
    title: "Sequence ends",
    why: "Mark the customer done. They come back into the list only on their next job, never on a second round of asking.",
    template: "",
  },
];

/** The branch that matters more than the sequence. */
export const unhappyBranch = {
  title: "If they reply unhappy, the sequence stops",
  body: "Any reply that is not positive cancels the remaining steps and becomes a callback within the hour. A customer who tells you privately that something is wrong is doing you a favour; the worst possible outcome is the day-7 nudge landing on top of an unresolved complaint.",
  template:
    "Hi {{first}}, this is the office at Coast to Coast Air. I saw your message and I would rather fix it than leave it. Are you free for a call in the next hour, or would later today suit you better? We will get someone back out.",
};

/** Google's rules, stated as rules rather than suggestions. */
export const reviewRules: { rule: string; detail: string }[] = [
  {
    rule: "Never offer anything in exchange",
    detail:
      "No discounts, no entries into a draw, no free filters. Google prohibits incentivised reviews and removes them, and the Florida market is small enough that competitors report it.",
  },
  {
    rule: "Ask everyone, not only the happy ones",
    detail:
      "Screening customers and only sending the link to the pleased ones is review gating. It is against Google's policy and it is the behaviour that gets a profile suspended. Ask every completed job.",
  },
  {
    rule: "Get texting consent at booking",
    detail:
      "A review request sent by SMS is a marketing message. Capture written consent on the booking form and honour STOP immediately, or the sequence is a TCPA problem rather than a marketing asset.",
  },
  {
    rule: "No bulk requests to old customers",
    detail:
      "Forty reviews arriving in one week after two quiet years reads as purchased and Google filters them. The sequence only ever fires on a job that just closed.",
  },
  {
    rule: "Reply to every review inside 48 hours",
    detail:
      "Replies are visible to everyone reading them afterwards and are weighed in local ranking. A one-line reply beats no reply.",
  },
];

/** Replies. Writing these in the moment is how a bad reply gets published. */
export const replyTemplates: { label: string; when: string; body: string }[] = [
  {
    label: "Five stars",
    when: "Positive, with detail",
    body: "Thank you, {{first}} — glad {{tech}} got you sorted. Mentioning the turnaround helps other {{city}} homeowners know what to expect. We are here if anything comes up.",
  },
  {
    label: "Five stars, no words",
    when: "A bare rating",
    body: "Thanks for the five stars, {{first}}. We appreciate you taking the time, and we are a phone call away if the system needs anything.",
  },
  {
    label: "Three stars",
    when: "Something fell short",
    body: "Thanks for the honest rating, {{first}}. Three stars tells us we left something on the table and I would like to know what. Could you call the office at " +
      business.phone +
      "? We would rather fix it than leave it at three.",
  },
  {
    label: "One star",
    when: "Publicly unhappy",
    body: "{{first}}, I am sorry — this is not how we work and I would like to make it right. I am the one who handles this directly: " +
      business.phone +
      ". If the detail here is not accurate we will sort that out too, but the call comes first.",
  },
  {
    label: "Not a customer",
    when: "A review from someone with no job on file",
    body: "We cannot find a job under this name in our records. If we have served you under a different name, please call " +
      business.phone +
      " — we would like to help. If this was left on the wrong business, we would appreciate you taking it down.",
  },
];

/** What has to exist before any of this sends itself. */
export const automationGaps: { what: string; needs: string }[] = [
  {
    what: "A review link to send",
    needs: "The Google Business Profile claimed and verified, which issues the g.page review URL.",
  },
  {
    what: "A trigger when a job closes",
    needs: "Whatever the office uses to close jobs — Jobber, Housecall Pro, ServiceTitan or a spreadsheet — has to emit 'job complete' with a name and mobile number.",
  },
  {
    what: "Something that sends",
    needs: "An SMS sender (the job software's own, or Twilio) and an email sender. Both need the consent captured at booking.",
  },
  {
    what: "A place to record what was sent",
    needs: "This dashboard tracks it per-browser only. A shared record needs the backend that the CRM page also waits on.",
  },
];
