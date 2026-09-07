"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createEvent,
  deleteEvent,
  updateEvent,
} from "@actions/event/event.actions";
import type { EventInput, SerializedEvent } from "@actions/event/event.types";
import { EventRows } from "@components/features/calendar/event-rows";
import { MonthGrid } from "@components/features/calendar/month-grid";
import { MonthNav } from "@components/features/calendar/month-nav";
import { Label } from "@components/ui/text";
import { formatMonthParam, type MonthCell, type MonthKey } from "@lib/date/month";
import { DeleteEventDialog } from "./delete-event-dialog";
import { EventFormDialog, type EventFormCopy } from "./event-form-dialog";

export interface EventsManagerCopy {
  create: string;
  edit: string;
  draft: string;
  empty: string;
  previous: string;
  next: string;
  today: string;
  more: string;
  form: EventFormCopy;
  deleteConfirm: string;
}

export function EventsManager({
  events,
  month,
  monthLabel,
  cells,
  weekdayLabels,
  dateLabels,
  copy,
}: {
  events: SerializedEvent[];
  month: MonthKey;
  monthLabel: string;
  cells: MonthCell[];
  weekdayLabels: string[];
  dateLabels: Record<string, string>;
  copy: EventsManagerCopy;
}) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<SerializedEvent | null>(null);
  const [defaultDate, setDefaultDate] = useState<string | undefined>();
  const [deleting, setDeleting] = useState<SerializedEvent | null>(null);
  const [, startTransition] = useTransition();

  const datedEvents = events.map((event) => ({
    ...event,
    dateLabel: dateLabels[event.id] ?? event.date,
  }));

  function openCreate(iso?: string) {
    setEditing(null);
    setDefaultDate(iso);
    setFormOpen(true);
  }

  function openEdit(event: SerializedEvent) {
    setEditing(event);
    setDefaultDate(undefined);
    setFormOpen(true);
  }

  async function handleSubmit(input: EventInput) {
    if (editing) await updateEvent(editing.id, input);
    else await createEvent(input);

    const nextMonth = input.date.slice(0, 7);
    if (nextMonth !== formatMonthParam(month)) {
      router.push(`/backoffice/events?month=${nextMonth}`);
    } else {
      router.refresh();
    }
  }

  function handleDelete() {
    if (!deleting) return;
    const id = deleting.id;
    startTransition(async () => {
      await deleteEvent(id);
      setDeleting(null);
      setFormOpen(false);
      router.refresh();
    });
  }

  return (
    <>
      <MonthNav
        month={month}
        href="/backoffice/events"
        label={monthLabel}
        copy={{
          previous: copy.previous,
          next: copy.next,
          today: copy.today,
        }}
      />

      <div className="mt-10">
        <MonthGrid
          cells={cells}
          weekdayLabels={weekdayLabels}
          events={events}
          moreTemplate={copy.more}
          draftLabel={copy.draft}
          onDayClick={(iso) => openCreate(iso)}
          onEventClick={openEdit}
        />
      </div>

      <div className="mt-16">
        <EventRows
          events={datedEvents}
          empty={copy.empty}
          action={(event) => (
            <button
              type="button"
              className="rounded-sm text-silver transition-colors duration-200 hover:text-chalk"
              onClick={() => openEdit(event)}
            >
              <Label color="inherit">{copy.edit}</Label>
            </button>
          )}
        />
      </div>

      <button
        type="button"
        onClick={() => openCreate()}
        className="action-button action-button--primary label-caps fixed bottom-5 right-5 z-20 sm:hidden"
      >
        {copy.create}
      </button>

      <EventFormDialog
        open={formOpen}
        event={editing}
        defaultDate={defaultDate}
        copy={copy.form}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        onDelete={editing ? () => setDeleting(editing) : undefined}
      />

      <DeleteEventDialog
        open={deleting !== null}
        heading={copy.form.delete}
        message={copy.deleteConfirm}
        confirm={copy.form.delete}
        cancel={copy.form.cancel}
        onConfirm={handleDelete}
        onClose={() => setDeleting(null)}
      />
    </>
  );
}
