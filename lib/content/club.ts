/**
 * Confirmed club facts, authored here until the backoffice owns them.
 *
 * Event titles are stored as single authored strings and rendered as-is in
 * every locale, matching how user-generated content will behave once these
 * come from the database.
 *
 * PLACEHOLDER: the event dates below follow the real Thursday cadence but have
 * not been checked against the club's Aug-Oct 2026 calendar. Replace them with
 * the real dates before launch.
 */

export const club = {
  name: "Valby Skakklub",
  founded: 1935,
  street: "Høffdingsvej 10",
  postalCode: "2500",
  city: "Valby",
  bank: { name: "Nordea", reg: "2111", account: "0567185117" },
  membership: { amount: 340, currency: "DKK" },
} as const;

export type ScheduleSlotId = "juniors" | "women" | "rounds";

export interface ScheduleSlot {
  id: ScheduleSlotId;
  /** Minutes from midnight, Europe/Copenhagen. */
  startMinutes: number;
  endMinutes: number;
  label: string;
}

export const scheduleSlots: readonly ScheduleSlot[] = [
  { id: "juniors", startMinutes: 17 * 60 + 30, endMinutes: 18 * 60 + 45, label: "17.30" },
  { id: "women", startMinutes: 17 * 60 + 45, endMinutes: 18 * 60 + 45, label: "17.45" },
  { id: "rounds", startMinutes: 19 * 60, endMinutes: 23 * 60, label: "19.00" },
];

export interface ClubEvent {
  id: string;
  /** Authored in the club's own language and rendered as-is in every locale. */
  title: string;
  /** ISO date, Europe/Copenhagen. */
  date: string;
  dateIsPlaceholder: boolean;
}

export const upcomingEvents: readonly ClubEvent[] = [
  { id: "skakbowl", title: "Skakbowl", date: "2026-08-13", dateIsPlaceholder: true },
  { id: "grillaften", title: "Grillaften", date: "2026-08-20", dateIsPlaceholder: true },
  { id: "grand-prix-lyn", title: "Grand Prix Lyn Finale", date: "2026-09-03", dateIsPlaceholder: true },
  { id: "simultan", title: "Simultan mod klubmesteren", date: "2026-09-17", dateIsPlaceholder: true },
  { id: "valbymesterskabet", title: "Valbymesterskabet, 1. runde", date: "2026-10-01", dateIsPlaceholder: true },
  { id: "vinterturnering", title: "Vinterturnering, 1. runde", date: "2026-10-29", dateIsPlaceholder: true },
];

export type OfficerRole =
  | "chair"
  | "tournamentDirector"
  | "editor"
  | "treasurer"
  | "eventCoordinator"
  | "juniorCoach";

export interface Officer {
  role: OfficerRole;
  name: string;
  phone?: string;
  email?: string;
}

export const officers: readonly Officer[] = [
  {
    role: "chair",
    name: "Hans Forchhammer",
    phone: "+45 30 13 75 71",
    email: "formand@valbyskakklub.dk",
  },
  {
    role: "tournamentDirector",
    name: "Stig Syndergaard",
    phone: "+45 22 71 62 55",
    email: "stig.syndergaard@gmail.com",
  },
  { role: "editor", name: "Erling Nilsson", email: "klubblad@valbyskakklub.dk" },
  { role: "treasurer", name: "Martin Skovsø Nielsen, Zoltan Orban" },
  { role: "eventCoordinator", name: "Alex Hansen" },
  { role: "juniorCoach", name: "Steen Guldager Pedersen, Jakob Bank" },
];
