"use client";

import type { KeyboardEvent, MouseEvent, ReactNode } from "react";
import type { EventOccurrence, SerializedEvent } from "@actions/event/event.types";
import { Label, Numeral } from "@components/ui/text";
import { cn } from "@lib/utils";
import type { MonthCell } from "@lib/date/month";
import { groupEventsByDate, occurrenceAnchorId } from "./group-events";

const MOBILE_DOT_LIMIT = 4;
const DESKTOP_CHIP_LIMIT = 3;

export function MonthGrid({
  cells,
  weekdayLabels,
  events,
  moreTemplate,
  draftLabel,
  eventHrefPrefix,
  onDayClick,
  onEventClick,
}: {
  cells: MonthCell[];
  weekdayLabels: string[];
  events: EventOccurrence[];
  moreTemplate: string;
  draftLabel?: string;
  eventHrefPrefix?: string;
  onDayClick?: (iso: string, events: EventOccurrence[]) => void;
  onEventClick?: (event: SerializedEvent) => void;
}) {
  const eventsByDate = groupEventsByDate(events);
  const moreLabel = (count: number) => moreTemplate.replace("{count}", String(count));

  return (
    <div className="grid grid-cols-7 gap-px border border-hairline bg-hairline">
      {weekdayLabels.map((label, index) => (
        <div key={`${label}-${index}`} className="bg-bluehour px-1 py-2 sm:px-2">
          <Label size="sm" color="chalk">
            {label}
          </Label>
        </div>
      ))}

      {cells.map((cell) => {
        const dayEvents = cell.outside ? [] : (eventsByDate.get(cell.iso) ?? []);
        const interactive = Boolean(onDayClick) && !cell.outside;

        return (
          <div
            key={cell.iso}
            role={interactive ? "button" : undefined}
            tabIndex={interactive ? 0 : undefined}
            onClick={
              interactive
                ? () => onDayClick?.(cell.iso, dayEvents)
                : undefined
            }
            onKeyDown={
              interactive
                ? (event: KeyboardEvent<HTMLDivElement>) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onDayClick?.(cell.iso, dayEvents);
                    }
                  }
                : undefined
            }
            className={cn(
              "flex aspect-square flex-col gap-1 bg-ground p-1 sm:aspect-auto sm:min-h-[6.5rem] sm:p-2",
              cell.outside && "opacity-40",
              cell.isToday && "bg-bluehour",
              interactive && "cursor-pointer",
            )}
          >
            <Numeral size="sm" color={cell.outside ? "silver" : "chalk"}>
              {cell.day}
            </Numeral>
            {dayEvents.length > 0 ? (
              <DayEvents
                events={dayEvents}
                moreLabel={moreLabel}
                draftLabel={draftLabel}
                eventHrefPrefix={eventHrefPrefix}
                onEventClick={onEventClick}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function DayEvents({
  events,
  moreLabel,
  draftLabel,
  eventHrefPrefix,
  onEventClick,
}: {
  events: EventOccurrence[];
  moreLabel: (count: number) => string;
  draftLabel?: string;
  eventHrefPrefix?: string;
  onEventClick?: (event: SerializedEvent) => void;
}) {
  const mobileHidden = Math.max(0, events.length - MOBILE_DOT_LIMIT);
  const desktopHidden = Math.max(0, events.length - DESKTOP_CHIP_LIMIT);

  return (
    <>
      <ul className="mt-auto flex flex-wrap gap-1 sm:hidden">
        {events.slice(0, MOBILE_DOT_LIMIT).map((event) => (
          <li key={`${event.id}-${event.occurrenceDate}`}>
            <EventAnchor
              event={event}
              eventHrefPrefix={eventHrefPrefix}
              onEventClick={onEventClick}
              className="block"
            >
              <span
                aria-hidden
                className={cn(
                  "block h-3 w-3 rounded-full",
                  event.published ? "bg-amber" : "bg-silver",
                )}
              />
              <span className="sr-only">{event.title}</span>
            </EventAnchor>
          </li>
        ))}
        {mobileHidden > 0 ? (
          <li>
            <Label size="sm" color="silver">
              {moreLabel(mobileHidden)}
            </Label>
          </li>
        ) : null}
      </ul>

      <ul className="mt-1 hidden flex-col gap-1 sm:flex">
        {events.slice(0, DESKTOP_CHIP_LIMIT).map((event) => (
          <li key={`${event.id}-${event.occurrenceDate}`}>
            <EventAnchor
              event={event}
              eventHrefPrefix={eventHrefPrefix}
              onEventClick={onEventClick}
              className="flex min-w-0 items-start gap-1.5 rounded-sm"
            >
              <span
                aria-hidden
                className={cn(
                  "mt-0.5 h-3 w-3 shrink-0 rounded-full",
                  event.published ? "bg-amber" : "bg-silver",
                )}
              />
              <span className="min-w-0">
                <Label size="sm" color="chalk" className="line-clamp-2">
                  {event.title}
                </Label>
                {draftLabel && !event.published ? (
                  <Label size="sm" color="silver" className="mt-0.5 block">
                    {draftLabel}
                  </Label>
                ) : null}
              </span>
            </EventAnchor>
          </li>
        ))}
        {desktopHidden > 0 ? (
          <li>
            <Label size="sm" color="silver">
              {moreLabel(desktopHidden)}
            </Label>
          </li>
        ) : null}
      </ul>
    </>
  );
}

function EventAnchor({
  event,
  eventHrefPrefix,
  onEventClick,
  className,
  children,
}: {
  event: EventOccurrence;
  eventHrefPrefix?: string;
  onEventClick?: (event: SerializedEvent) => void;
  className?: string;
  children: ReactNode;
}) {
  function stop(eventLike: MouseEvent<HTMLElement>) {
    eventLike.stopPropagation();
  }

  if (onEventClick) {
    return (
      <button
        type="button"
        className={className}
        onClick={(eventLike) => {
          stop(eventLike);
          onEventClick(event);
        }}
      >
        {children}
      </button>
    );
  }

  if (eventHrefPrefix) {
    return (
      <a href={`#${occurrenceAnchorId(event)}`} className={className}>
        {children}
      </a>
    );
  }

  return <span className={className}>{children}</span>;
}
