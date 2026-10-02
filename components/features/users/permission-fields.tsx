"use client";

import { Label } from "@components/ui/text";
import type { PermissionEntry } from "@actions/roles/role.types";

export function emptyPermissions(moduleKeys: string[]): PermissionEntry[] {
  return moduleKeys.map((module) => ({
    module,
    canRead: false,
    canWrite: false,
  }));
}

export function PermissionFields({
  modules,
  value,
  onChange,
  readLabel,
  writeLabel,
}: {
  modules: { key: string; label: string }[];
  value: PermissionEntry[];
  onChange: (value: PermissionEntry[]) => void;
  readLabel: string;
  writeLabel: string;
}) {
  const rows = modules.map(
    (module) =>
      value.find((entry) => entry.module === module.key) ?? {
        module: module.key,
        canRead: false,
        canWrite: false,
      },
  );

  function update(
    module: string,
    field: "canRead" | "canWrite",
    checked: boolean,
  ) {
    onChange(
      rows.map((entry) => {
        if (entry.module !== module) return entry;
        if (field === "canRead" && !checked)
          return { ...entry, canRead: false, canWrite: false };
        if (field === "canWrite" && checked)
          return { ...entry, canRead: true, canWrite: true };
        return { ...entry, [field]: checked };
      }),
    );
  }

  return (
    <ul className="flex flex-col">
      {modules.map((module) => {
        const entry = rows.find((row) => row.module === module.key) ?? {
          module: module.key,
          canRead: false,
          canWrite: false,
        };

        return (
          <li
            key={module.key}
            className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline py-3 first:border-t"
          >
            <Label color="chalk">{module.label}</Label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={entry.canRead}
                  onChange={(event) =>
                    update(module.key, "canRead", event.target.checked)
                  }
                />
                <Label as="span" size="sm" color="silver">
                  {readLabel}
                </Label>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={entry.canWrite}
                  onChange={(event) =>
                    update(module.key, "canWrite", event.target.checked)
                  }
                />
                <Label as="span" size="sm" color="silver">
                  {writeLabel}
                </Label>
              </label>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
