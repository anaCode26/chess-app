"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import type { EventInput, SerializedEvent } from "@actions/event/event.types";
import { Button } from "@components/ui/button";
import { Field } from "@components/ui/field";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Caption, Label, Title } from "@components/ui/text";
import type { Locale } from "@/i18n/locale";
import { parseDateOnly } from "@lib/date/month";
import { enumerateWeekdays } from "@lib/date/series";

export interface EventFormCopy {
  createTitle: string;
  editTitle: string;
  title: string;
  date: string;
  endDate: string;
  endDateHint: string;
  thursdays: string;
  seriesHint: string;
  startTime: string;
  startTimeHint: string;
  description: string;
  published: string;
  save: string;
  create: string;
  cancel: string;
  delete: string;
  saving: string;
  close: string;
}

export function EventFormDialog({
  open,
  event,
  defaultDate,
  locale,
  copy,
  onClose,
  onSubmit,
  onDelete,
}: {
  open: boolean;
  event: SerializedEvent | null;
  defaultDate?: string;
  locale: Locale;
  copy: EventFormCopy;
  onClose: () => void;
  onSubmit: (input: EventInput) => Promise<void>;
  onDelete?: () => void;
}) {
  useEffect(() => {
    if (!open) return;

    function onKey(keyboardEvent: KeyboardEvent) {
      if (keyboardEvent.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label={copy.close}
        className="absolute inset-0 bg-chalk/40"
        onClick={onClose}
      />
      <EventForm
        key={event?.id ?? defaultDate ?? "new"}
        event={event}
        defaultDate={defaultDate}
        locale={locale}
        copy={copy}
        onClose={onClose}
        onSubmit={onSubmit}
        onDelete={onDelete}
      />
    </div>
  );
}

function EventForm({
  event,
  defaultDate,
  locale,
  copy,
  onClose,
  onSubmit,
  onDelete,
}: {
  event: SerializedEvent | null;
  defaultDate?: string;
  locale: Locale;
  copy: EventFormCopy;
  onClose: () => void;
  onSubmit: (input: EventInput) => Promise<void>;
  onDelete?: () => void;
}) {
  const isEdit = event !== null;
  const [error, setError] = useState<string | null>(null);
  const [published, setPublished] = useState(event?.published ?? true);
  const [startDate, setStartDate] = useState(event?.date ?? defaultDate ?? "");
  const [endDate, setEndDate] = useState(event?.endDate ?? "");
  const [skipped, setSkipped] = useState<Set<string>>(
    () => new Set(event?.skippedDates ?? []),
  );
  const [isPending, startTransition] = useTransition();

  const generated = useMemo(() => {
    if (!startDate || !endDate || endDate < startDate) return [];
    return enumerateWeekdays(startDate, endDate);
  }, [startDate, endDate]);

  function toggleDate(iso: string, included: boolean) {
    setSkipped((current) => {
      const next = new Set(current);
      if (included) next.delete(iso);
      else next.add(iso);
      return next;
    });
  }

  function handleSubmit(formEvent: React.FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    const formData = new FormData(formEvent.currentTarget);
    const input: EventInput = {
      title: String(formData.get("title") ?? ""),
      date: startDate,
      endDate: endDate || undefined,
      skippedDates: endDate ? generated.filter((iso) => skipped.has(iso)) : [],
      startTime: String(formData.get("startTime") ?? "") || undefined,
      description: String(formData.get("description") ?? "") || undefined,
      published,
    };

    setError(null);
    startTransition(async () => {
      try {
        await onSubmit(input);
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : copy.saving);
      }
    });
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-dialog-title"
      className="relative flex max-h-[min(40rem,90vh)] w-full max-w-md flex-col border border-hairline bg-ground"
    >
      <div className="flex shrink-0 items-center justify-between gap-4 border-b border-hairline px-6 py-4">
        <Title id="event-dialog-title" size="sm" as="h2">
          {isEdit ? copy.editTitle : copy.createTitle}
        </Title>
        {isEdit && onDelete ? (
          <Button type="button" variant="danger" onClick={onDelete}>
            {copy.delete}
          </Button>
        ) : null}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 overflow-y-auto px-6 py-5"
      >
        {error ? (
          <p className="text-sm" style={{ color: "var(--destructive)" }}>
            {error}
          </p>
        ) : null}

        <Field label={copy.title} htmlFor="ev-title">
          <Input
            id="ev-title"
            name="title"
            required
            maxLength={100}
            defaultValue={event?.title ?? ""}
          />
        </Field>

        <Field label={copy.date} htmlFor="ev-date" hint={copy.seriesHint}>
          <Input
            id="ev-date"
            name="date"
            type="date"
            required
            value={startDate}
            onChange={(change) => setStartDate(change.target.value)}
          />
        </Field>

        <Field label={copy.endDate} htmlFor="ev-end" hint={copy.endDateHint}>
          <Input
            id="ev-end"
            name="endDate"
            type="date"
            value={endDate}
            onChange={(change) => setEndDate(change.target.value)}
          />
        </Field>

        {generated.length > 1 ? (
          <fieldset>
            <legend>
              <Label color="chalk">{copy.thursdays}</Label>
            </legend>
            <ol className="mt-3">
              {generated.map((iso) => {
                const included = !skipped.has(iso);

                return (
                  <li
                    key={iso}
                    className="flex items-center gap-3 border-b border-hairline py-3 first:border-t"
                  >
                    <input
                      type="checkbox"
                      checked={included}
                      onChange={(change) => toggleDate(iso, change.target.checked)}
                      className="size-4 rounded-sm border-hairline accent-amber"
                    />
                    <Caption as="span" className="text-chalk">
                      {formatOccurrenceDate(iso, locale)}
                    </Caption>
                  </li>
                );
              })}
            </ol>
          </fieldset>
        ) : null}

        <Field label={copy.startTime} htmlFor="ev-time" hint={copy.startTimeHint}>
          <Input
            id="ev-time"
            name="startTime"
            defaultValue={event?.startTime ?? ""}
            placeholder="19.00"
          />
        </Field>

        <Field label={copy.description} htmlFor="ev-desc">
          <Textarea
            id="ev-desc"
            name="description"
            maxLength={500}
            defaultValue={event?.description ?? ""}
          />
        </Field>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={published}
            onChange={(change) => setPublished(change.target.checked)}
            className="size-4 rounded-sm border-hairline accent-amber"
          />
          <Label color="chalk">{copy.published}</Label>
        </label>

        <div className="flex justify-end gap-3 pt-1">
          <Button type="button" variant="ghost" onClick={onClose}>
            {copy.cancel}
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? copy.saving : isEdit ? copy.save : copy.create}
          </Button>
        </div>
      </form>
    </div>
  );
}

function formatOccurrenceDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(parseDateOnly(iso));
}
