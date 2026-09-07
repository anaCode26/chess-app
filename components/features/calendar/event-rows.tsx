import type { ReactNode } from "react";
import type { EventOccurrence } from "@actions/event/event.types";
import { Body, Label, Title } from "@components/ui/text";
import { occurrenceAnchorId, seriesAnchorId } from "./group-events";

export type DatedEvent = EventOccurrence & { dateLabel: string };

export function EventRows({
  events,
  empty,
  action,
}: {
  events: DatedEvent[];
  empty: string;
  action?: (event: DatedEvent) => ReactNode;
}) {
  if (events.length === 0) {
    return <Body className="max-w-prose">{empty}</Body>;
  }

  const firstBySeries = new Set<string>();

  return (
    <ol>
      {events.map((event) => {
        const isFirstOfSeries = !firstBySeries.has(event.id);
        if (isFirstOfSeries) firstBySeries.add(event.id);

        return (
          <li
            key={`${event.id}-${event.occurrenceDate}`}
            id={occurrenceAnchorId(event)}
            className="scroll-mt-24 relative flex flex-col gap-2 border-b border-hairline py-7 first:border-t sm:flex-row sm:items-baseline sm:gap-10"
          >
            {isFirstOfSeries ? (
              <span id={seriesAnchorId(event.id)} className="absolute -top-24" />
            ) : null}
            <Label color="amber" className="shrink-0 sm:w-56">
              {event.dateLabel}
            </Label>
            <div className="min-w-0 flex-1">
              <Title size="md" as="span">
                {event.title}
              </Title>
              {event.description ? (
                <Body className="mt-2 max-w-prose">{event.description}</Body>
              ) : null}
            </div>
            {action ? <div className="shrink-0">{action(event)}</div> : null}
          </li>
        );
      })}
    </ol>
  );
}
