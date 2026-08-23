import type { ReactNode } from "react";
import type { SerializedEvent } from "@actions/event/event.types";
import { Body, Label, Title } from "@components/ui/text";

export type DatedEvent = SerializedEvent & { dateLabel: string };

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

  return (
    <ol>
      {events.map((event) => (
        <li
          key={event.id}
          id={`event-${event.id}`}
          className="scroll-mt-24 flex flex-col gap-2 border-b border-hairline py-7 first:border-t sm:flex-row sm:items-baseline sm:gap-10"
        >
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
      ))}
    </ol>
  );
}
