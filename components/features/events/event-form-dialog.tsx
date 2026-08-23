"use client";

import { useEffect, useState, useTransition } from "react";
import type { EventInput, SerializedEvent } from "@actions/event/event.types";
import { Button } from "@components/ui/button";
import { Field } from "@components/ui/field";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Label, Title } from "@components/ui/text";

export interface EventFormCopy {
  createTitle: string;
  editTitle: string;
  title: string;
  date: string;
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
  copy,
  onClose,
  onSubmit,
  onDelete,
}: {
  open: boolean;
  event: SerializedEvent | null;
  defaultDate?: string;
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
  copy,
  onClose,
  onSubmit,
  onDelete,
}: {
  event: SerializedEvent | null;
  defaultDate?: string;
  copy: EventFormCopy;
  onClose: () => void;
  onSubmit: (input: EventInput) => Promise<void>;
  onDelete?: () => void;
}) {
  const isEdit = event !== null;
  const [error, setError] = useState<string | null>(null);
  const [published, setPublished] = useState(event?.published ?? true);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formEvent: React.FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    const formData = new FormData(formEvent.currentTarget);
    const input: EventInput = {
      title: String(formData.get("title") ?? ""),
      date: String(formData.get("date") ?? ""),
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
      className="relative w-full max-w-md border border-hairline bg-ground"
    >
      <div className="flex items-center justify-between gap-4 border-b border-hairline px-6 py-4">
        <Title id="event-dialog-title" size="sm" as="h2">
          {isEdit ? copy.editTitle : copy.createTitle}
        </Title>
        {isEdit && onDelete ? (
          <Button type="button" variant="danger" onClick={onDelete}>
            {copy.delete}
          </Button>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-6 py-5">
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

        <Field label={copy.date} htmlFor="ev-date">
          <Input
            id="ev-date"
            name="date"
            type="date"
            required
            defaultValue={event?.date ?? defaultDate}
          />
        </Field>

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
            className="size-4 rounded-sm border-hairline"
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
