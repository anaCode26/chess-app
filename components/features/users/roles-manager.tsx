"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createRole,
  deleteRole,
  updateRole,
} from "@actions/roles/role.actions";
import type { ManagedRole, PermissionEntry } from "@actions/roles/role.types";
import { Button } from "@components/ui/button";
import { Field } from "@components/ui/field";
import { Input } from "@components/ui/input";
import { Body, Label, Title } from "@components/ui/text";
import { emptyPermissions, PermissionFields } from "./permission-fields";

export interface RolesCopy {
  create: string;
  edit: string;
  delete: string;
  name: string;
  description: string;
  defaultRole: string;
  read: string;
  write: string;
  system: string;
  save: string;
  saving: string;
  cancel: string;
  empty: string;
  userCount: string;
  errors: {
    ROLE_SYSTEM: string;
    ROLE_IN_USE: string;
    ROLE_NAME_TAKEN: string;
    NOT_FOUND: string;
    INVALID_INPUT: string;
    "Not authorized.": string;
    generic: string;
  };
}

function messageFor(error: unknown, errors: RolesCopy["errors"]): string {
  const code = error instanceof Error ? error.message : "";
  if (code in errors) return errors[code as keyof RolesCopy["errors"]];
  return errors.generic;
}

export function RolesManager({
  roles,
  modules,
  canWrite,
  copy,
}: {
  roles: ManagedRole[];
  modules: { key: string; label: string }[];
  canWrite: boolean;
  copy: RolesCopy;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<ManagedRole | "new" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const moduleKeys = modules.map((module) => module.key);

  function run(action: () => Promise<void>) {
    setError(null);
    setPending(true);
    void action()
      .then(() => {
        setEditing(null);
        router.refresh();
      })
      .catch((caught: unknown) => setError(messageFor(caught, copy.errors)))
      .finally(() => setPending(false));
  }

  return (
    <div>
      {canWrite && editing === null ? (
        <Button
          type="button"
          className="mb-8"
          onClick={() => setEditing("new")}
        >
          {copy.create}
        </Button>
      ) : null}

      {editing ? (
        <RoleForm
          role={editing === "new" ? null : editing}
          modules={modules}
          moduleKeys={moduleKeys}
          copy={copy}
          pending={pending}
          onCancel={() => setEditing(null)}
          onSubmit={(input) =>
            run(() =>
              editing === "new"
                ? createRole(input)
                : updateRole(editing.id, input),
            )
          }
        />
      ) : null}

      {error ? (
        <Body className="mb-6" style={{ color: "var(--destructive)" }}>
          {error}
        </Body>
      ) : null}

      {roles.length === 0 ? (
        <Body>{copy.empty}</Body>
      ) : (
        <ul className={editing ? "mt-10" : undefined}>
          {roles.map((role) => (
            <li
              key={role.id}
              className="border-b border-hairline py-5 first:border-t"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <Title as="h3" size="sm">
                    {role.name}
                  </Title>
                  {role.description ? (
                    <Body className="mt-1">{role.description}</Body>
                  ) : null}
                  <Label size="sm" className="mt-2">
                    {copy.userCount.replace("{count}", String(role.userCount))}
                    {role.isSystem ? ` · ${copy.system}` : ""}
                    {role.isDefault ? ` · ${copy.defaultRole}` : ""}
                  </Label>
                </div>
                {canWrite && !role.isSystem ? (
                  <div className="flex flex-wrap gap-3">
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={pending}
                      onClick={() => setEditing(role)}
                    >
                      {copy.edit}
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      disabled={pending}
                      onClick={() => run(() => deleteRole(role.id))}
                    >
                      {copy.delete}
                    </Button>
                  </div>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function RoleForm({
  role,
  modules,
  moduleKeys,
  copy,
  pending,
  onCancel,
  onSubmit,
}: {
  role: ManagedRole | null;
  modules: { key: string; label: string }[];
  moduleKeys: string[];
  copy: RolesCopy;
  pending: boolean;
  onCancel: () => void;
  onSubmit: (input: {
    name: string;
    description?: string;
    isDefault: boolean;
    permissions: PermissionEntry[];
  }) => void;
}) {
  const [permissions, setPermissions] = useState<PermissionEntry[]>(
    role?.permissions.length
      ? mergePermissions(moduleKeys, role.permissions)
      : emptyPermissions(moduleKeys),
  );
  const [isDefault, setIsDefault] = useState(role?.isDefault ?? false);

  return (
    <form
      className="flex max-w-lg flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const description = String(formData.get("description") ?? "").trim();
        onSubmit({
          name: String(formData.get("name") ?? ""),
          description: description || undefined,
          isDefault,
          permissions,
        });
      }}
    >
      <Field label={copy.name} htmlFor="role-name">
        <Input
          id="role-name"
          name="name"
          required
          maxLength={50}
          defaultValue={role?.name ?? ""}
        />
      </Field>
      <Field label={copy.description} htmlFor="role-description">
        <Input
          id="role-description"
          name="description"
          maxLength={200}
          defaultValue={role?.description ?? ""}
        />
      </Field>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isDefault}
          onChange={(event) => setIsDefault(event.target.checked)}
        />
        <Label as="span" color="chalk">
          {copy.defaultRole}
        </Label>
      </label>
      <PermissionFields
        modules={modules}
        value={permissions}
        onChange={setPermissions}
        readLabel={copy.read}
        writeLabel={copy.write}
      />
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

function mergePermissions(
  moduleKeys: string[],
  current: PermissionEntry[],
): PermissionEntry[] {
  return moduleKeys.map(
    (module) =>
      current.find((entry) => entry.module === module) ?? {
        module,
        canRead: false,
        canWrite: false,
      },
  );
}
