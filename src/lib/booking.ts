import { createContext, useContext } from "react";

/**
 * Which form the pop-up opens with.
 *
 * `walk` is the commercial entry offer and the default: a short form and a
 * plain account of what the visit is. `quote` is the full request form, for
 * the buttons that promise a price rather than a visit.
 */
export type BookingIntent = "walk" | "quote";

export interface Booking {
  open: (intent?: BookingIntent, source?: string) => void;
}

/**
 * Lives apart from the dialog itself so that a button can ask for the pop-up
 * without importing the form, and the form can import the button, without the
 * two files importing each other.
 */
export const BookingContext = createContext<Booking | null>(null);

/** Null outside the provider (the dashboard, a test render): links then
 *  simply behave as links. */
export function useBooking() {
  return useContext(BookingContext);
}

/**
 * The equipment walk, said plainly. One source for the home page, the pop-up
 * and the contact page, so the three never drift into describing three
 * different visits.
 */
export const walk = {
  name: "Equipment walk",
  oneLine:
    "A technician comes to your building, checks every heating and cooling unit, and gives you a written list of what you have and what shape it is in.",
  terms: ["Free", "No obligation", "The list is yours to keep"],
  steps: [
    {
      title: "You tell us where",
      body: "Send the short form or call. We agree a time that suits the building.",
    },
    {
      title: "We check every unit",
      body: "Roof, mechanical rooms and closets. Each unit gets a tag, a photo, its age and its condition written down.",
    },
    {
      title: "You get the list",
      body: "One sheet covering all of it, plus a price for looking after it if you want one.",
    },
  ],
} as const;
