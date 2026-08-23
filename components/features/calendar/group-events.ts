import type { SerializedEvent } from "@actions/event/event.types";

export function groupEventsByDate(
  events: SerializedEvent[],
): Map<string, SerializedEvent[]> {
  const map = new Map<string, SerializedEvent[]>();

  for (const event of events) {
    const list = map.get(event.date) ?? [];
    list.push(event);
    map.set(event.date, list);
  }

  return map;
}
