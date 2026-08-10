"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE } from "@/i18n/locale";
import { setLocaleSchema } from "./locale.types";

export async function setLocaleAction(formData: FormData): Promise<void> {
  const { locale } = setLocaleSchema.parse({ locale: formData.get("locale") });

  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: "lax",
  });

  revalidatePath("/", "layout");
}
