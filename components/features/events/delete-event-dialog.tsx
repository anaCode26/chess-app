"use client";

import { Button } from "@components/ui/button";
import { Body, Title } from "@components/ui/text";

export function DeleteEventDialog({
  open,
  heading,
  message,
  confirm,
  cancel,
  onConfirm,
  onClose,
}: {
  open: boolean;
  heading: string;
  message: string;
  confirm: string;
  cancel: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label={cancel}
        className="absolute inset-0 bg-chalk/40"
        onClick={onClose}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-event-title"
        className="relative w-full max-w-sm border border-hairline bg-ground p-6"
      >
        <Title id="delete-event-title" size="sm" as="h2">
          {heading}
        </Title>
        <Body className="mt-3">{message}</Body>
        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            {cancel}
          </Button>
          <Button type="button" variant="danger" onClick={onConfirm}>
            {confirm}
          </Button>
        </div>
      </div>
    </div>
  );
}
