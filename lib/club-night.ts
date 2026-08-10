import { scheduleSlots, type ScheduleSlotId } from "@lib/content/club";

export const CLUB_TIMEZONE = "Europe/Copenhagen";

/** ISO weekday for Thursday. */
const THURSDAY = 4;

const LAST_SLOT_END = Math.max(...scheduleSlots.map((slot) => slot.endMinutes));

export type SlotStatus = "now" | "later" | "ended";

export type NightPhase = "day" | "dusk" | "night" | "dawn";

export interface ClubNightSlotState {
  id: ScheduleSlotId;
  label: string;
  status: SlotStatus;
}

export interface ClubNightState {
  /** True while a club night is running, from the first slot until the rooms close. */
  isTonight: boolean;
  /** The club night being shown: tonight's, or the next Thursday. */
  date: Date;
  slots: ClubNightSlotState[];
  phase: NightPhase;
  /** True when the hall should read as lit: club night, from late afternoon on. */
  isLit: boolean;
}

interface ZonedNow {
  year: number;
  month: number;
  day: number;
  weekday: number;
  minutes: number;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function toZoned(now: Date): ZonedNow {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: CLUB_TIMEZONE,
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  const hour = Number.parseInt(value("hour"), 10) % 24;

  return {
    year: Number.parseInt(value("year"), 10),
    month: Number.parseInt(value("month"), 10),
    day: Number.parseInt(value("day"), 10),
    weekday: WEEKDAYS.indexOf(value("weekday")) + 1,
    minutes: hour * 60 + Number.parseInt(value("minute"), 10),
  };
}

/** Noon UTC keeps the calendar date stable through Copenhagen's DST shifts. */
function calendarDate(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month - 1, day, 12));
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

function phaseFor(minutes: number): NightPhase {
  if (minutes < 5 * 60) return "night";
  if (minutes < 8 * 60) return "dawn";
  if (minutes < 16 * 60) return "day";
  if (minutes < 19 * 60) return "dusk";
  return "night";
}

export function getClubNightState(now: Date = new Date()): ClubNightState {
  const zoned = toZoned(now);
  const isTonight = zoned.weekday === THURSDAY && zoned.minutes < LAST_SLOT_END;

  const today = calendarDate(zoned.year, zoned.month, zoned.day);
  const daysAhead = isTonight ? 0 : ((THURSDAY - zoned.weekday + 7) % 7 || 7);

  const slots = scheduleSlots.map<ClubNightSlotState>((slot) => {
    if (!isTonight) return { id: slot.id, label: slot.label, status: "later" };
    if (zoned.minutes >= slot.endMinutes) return { id: slot.id, label: slot.label, status: "ended" };
    if (zoned.minutes >= slot.startMinutes) return { id: slot.id, label: slot.label, status: "now" };
    return { id: slot.id, label: slot.label, status: "later" };
  });

  return {
    isTonight,
    date: addDays(today, daysAhead),
    slots,
    phase: phaseFor(zoned.minutes),
    isLit: isTonight && zoned.minutes >= 16 * 60,
  };
}
