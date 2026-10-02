import type { Metadata } from "next";
import { getManagedRoles } from "@actions/roles/role.actions";
import { getManagedUsers } from "@actions/users/user.actions";
import { RolesManager } from "@components/features/users/roles-manager";
import { UsersManager } from "@components/features/users/users-manager";
import { Body, Title } from "@components/ui/text";
import { permissionService } from "@lib/auth/permission.service";
import { MODULES } from "@lib/constants/modules";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("backoffice");

  return { title: t("users") };
}

export default async function UsersPage() {
  const [t, usersCopy, rolesCopy, users, roles, canWrite] = await Promise.all([
    getTranslations("backoffice"),
    getTranslations("usersPage"),
    getTranslations("rolesPage"),
    getManagedUsers(),
    getManagedRoles(),
    permissionService.can("users", "write"),
  ]);

  const modules = MODULES.map((module) => ({
    key: module.key,
    label: t(module.key),
  }));

  return (
    <div>
      <Title as="h1" size="lg">
        {t("users")}
      </Title>
      <Body className="mt-3 max-w-prose">{usersCopy("intro")}</Body>

      <div className="mt-10">
        <UsersManager
          users={users}
          roles={roles}
          canWrite={canWrite}
          copy={{
            invite: usersCopy("invite"),
            inviting: usersCopy("inviting"),
            name: usersCopy("name"),
            email: usersCopy("email"),
            role: usersCopy("role"),
            save: usersCopy("save"),
            saving: usersCopy("saving"),
            cancel: usersCopy("cancel"),
            edit: usersCopy("edit"),
            disable: usersCopy("disable"),
            enable: usersCopy("enable"),
            resend: usersCopy("resend"),
            empty: usersCopy("empty"),
            status: {
              ACTIVE: usersCopy("status.active"),
              PENDING: usersCopy("status.pending"),
              INACTIVE: usersCopy("status.inactive"),
            },
            errors: {
              EMAIL_TAKEN: usersCopy("errors.emailTaken"),
              NOT_FOUND: usersCopy("errors.notFound"),
              NOT_PENDING: usersCopy("errors.notPending"),
              INVALID_INPUT: usersCopy("errors.invalid"),
              "Not authorized.": usersCopy("errors.unauthorized"),
              generic: usersCopy("errors.generic"),
            },
          }}
        />
      </div>

      <Title as="h2" size="md" className="mt-16">
        {rolesCopy("heading")}
      </Title>
      <Body className="mt-3 max-w-prose">{rolesCopy("intro")}</Body>

      <div className="mt-10">
        <RolesManager
          roles={roles}
          modules={modules}
          canWrite={canWrite}
          copy={{
            create: rolesCopy("create"),
            edit: rolesCopy("edit"),
            delete: rolesCopy("delete"),
            name: rolesCopy("name"),
            description: rolesCopy("description"),
            defaultRole: rolesCopy("defaultRole"),
            read: rolesCopy("read"),
            write: rolesCopy("write"),
            system: rolesCopy("system"),
            save: rolesCopy("save"),
            saving: rolesCopy("saving"),
            cancel: rolesCopy("cancel"),
            empty: rolesCopy("empty"),
            userCount: rolesCopy.raw("userCount"),
            errors: {
              ROLE_SYSTEM: rolesCopy("errors.system"),
              ROLE_IN_USE: rolesCopy("errors.inUse"),
              ROLE_NAME_TAKEN: rolesCopy("errors.nameTaken"),
              NOT_FOUND: rolesCopy("errors.notFound"),
              INVALID_INPUT: rolesCopy("errors.invalid"),
              "Not authorized.": rolesCopy("errors.unauthorized"),
              generic: rolesCopy("errors.generic"),
            },
          }}
        />
      </div>
    </div>
  );
}
