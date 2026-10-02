"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  disableUser,
  enableUser,
  inviteUser,
  resendInvitation,
  updateUser,
} from "@actions/users/user.actions";
import type { ManagedUser } from "@actions/users/user.types";
import { Button } from "@components/ui/button";
import { Field } from "@components/ui/field";
import { Input } from "@components/ui/input";
import { Body, Label, Title } from "@components/ui/text";

export interface UsersCopy {
  invite: string;
  inviting: string;
  name: string;
  email: string;
  role: string;
  save: string;
  saving: string;
  cancel: string;
  edit: string;
  disable: string;
  enable: string;
  resend: string;
  empty: string;
  status: { ACTIVE: string; PENDING: string; INACTIVE: string };
  errors: {
    EMAIL_TAKEN: string;
    NOT_FOUND: string;
    NOT_PENDING: string;
    INVALID_INPUT: string;
    "Not authorized.": string;
    generic: string;
  };
}

function messageFor(error: unknown, errors: UsersCopy["errors"]): string {
  const code = error instanceof Error ? error.message : "";
  if (code in errors) return errors[code as keyof UsersCopy["errors"]];
  return errors.generic;
}

const selectClass =
  "h-11 w-full rounded-sm border border-hairline bg-white px-3 text-base text-chalk";

export function UsersManager({
  users,
  roles,
  canWrite,
  copy,
}: {
  users: ManagedUser[];
  roles: { id: string; name: string }[];
  canWrite: boolean;
  copy: UsersCopy;
}) {
  const router = useRouter();
  const [inviting, setInviting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function run(action: () => Promise<void>) {
    setError(null);
    setPending(true);
    void action()
      .then(() => {
        setInviting(false);
        setEditingId(null);
        router.refresh();
      })
      .catch((caught: unknown) => setError(messageFor(caught, copy.errors)))
      .finally(() => setPending(false));
  }

  return (
    <div>
      {canWrite ? (
        <div className="mb-8">
          {inviting ? (
            <InviteForm
              roles={roles}
              copy={copy}
              pending={pending}
              onCancel={() => setInviting(false)}
              onSubmit={(input) => run(() => inviteUser(input))}
            />
          ) : (
            <Button type="button" onClick={() => setInviting(true)}>
              {copy.invite}
            </Button>
          )}
        </div>
      ) : null}

      {error ? (
        <Body className="mb-6" style={{ color: "var(--destructive)" }}>
          {error}
        </Body>
      ) : null}

      {users.length === 0 ? (
        <Body>{copy.empty}</Body>
      ) : (
        <ul>
          {users.map((user) => (
            <li
              key={user.id}
              className="border-b border-hairline py-5 first:border-t"
            >
              {editingId === user.id ? (
                <EditForm
                  user={user}
                  roles={roles}
                  copy={copy}
                  pending={pending}
                  onCancel={() => setEditingId(null)}
                  onSubmit={(input) => run(() => updateUser(user.id, input))}
                />
              ) : (
                <UserRow
                  user={user}
                  canWrite={canWrite}
                  copy={copy}
                  pending={pending}
                  onEdit={() => setEditingId(user.id)}
                  onDisable={() => run(() => disableUser(user.id))}
                  onEnable={() => run(() => enableUser(user.id))}
                  onResend={() => run(() => resendInvitation(user.id))}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function UserRow({
  user,
  canWrite,
  copy,
  pending,
  onEdit,
  onDisable,
  onEnable,
  onResend,
}: {
  user: ManagedUser;
  canWrite: boolean;
  copy: UsersCopy;
  pending: boolean;
  onEdit: () => void;
  onDisable: () => void;
  onEnable: () => void;
  onResend: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <Title as="h2" size="sm">
          {user.name}
        </Title>
        <Body className="mt-1">{user.email}</Body>
        <Label size="sm" className="mt-2">
          {user.roleName} · {copy.status[user.status]}
        </Label>
      </div>
      {canWrite ? (
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="ghost"
            disabled={pending}
            onClick={onEdit}
          >
            {copy.edit}
          </Button>
          {user.status === "PENDING" ? (
            <Button
              type="button"
              variant="ghost"
              disabled={pending}
              onClick={onResend}
            >
              {copy.resend}
            </Button>
          ) : null}
          {user.status === "INACTIVE" ? (
            <Button
              type="button"
              variant="ghost"
              disabled={pending}
              onClick={onEnable}
            >
              {copy.enable}
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              disabled={pending}
              onClick={onDisable}
            >
              {copy.disable}
            </Button>
          )}
        </div>
      ) : null}
    </div>
  );
}

function InviteForm({
  roles,
  copy,
  pending,
  onCancel,
  onSubmit,
}: {
  roles: { id: string; name: string }[];
  copy: UsersCopy;
  pending: boolean;
  onCancel: () => void;
  onSubmit: (input: { name: string; email: string; roleId: string }) => void;
}) {
  return (
    <form
      className="flex max-w-sm flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        onSubmit({
          name: String(formData.get("name") ?? ""),
          email: String(formData.get("email") ?? ""),
          roleId: String(formData.get("roleId") ?? ""),
        });
      }}
    >
      <Field label={copy.name} htmlFor="invite-name">
        <Input id="invite-name" name="name" required maxLength={100} />
      </Field>
      <Field label={copy.email} htmlFor="invite-email">
        <Input id="invite-email" name="email" type="email" required />
      </Field>
      <Field label={copy.role} htmlFor="invite-role">
        <select
          id="invite-role"
          name="roleId"
          required
          className={selectClass}
          defaultValue=""
        >
          <option value="" disabled />
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
      </Field>
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? copy.inviting : copy.invite}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          {copy.cancel}
        </Button>
      </div>
    </form>
  );
}

function EditForm({
  user,
  roles,
  copy,
  pending,
  onCancel,
  onSubmit,
}: {
  user: ManagedUser;
  roles: { id: string; name: string }[];
  copy: UsersCopy;
  pending: boolean;
  onCancel: () => void;
  onSubmit: (input: { name: string; roleId: string }) => void;
}) {
  return (
    <form
      className="flex max-w-sm flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        onSubmit({
          name: String(formData.get("name") ?? ""),
          roleId: String(formData.get("roleId") ?? ""),
        });
      }}
    >
      <Field label={copy.name} htmlFor={`name-${user.id}`}>
        <Input
          id={`name-${user.id}`}
          name="name"
          required
          maxLength={100}
          defaultValue={user.name}
        />
      </Field>
      <Field label={copy.role} htmlFor={`role-${user.id}`}>
        <select
          id={`role-${user.id}`}
          name="roleId"
          required
          className={selectClass}
          defaultValue={user.roleId}
        >
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
      </Field>
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? copy.saving : copy.save}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          {copy.cancel}
        </Button>
      </div>
    </form>
  );
}
