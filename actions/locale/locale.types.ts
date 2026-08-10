import { z } from "zod";
import { locales } from "@/i18n/locale";

export const setLocaleSchema = z.object({
  locale: z.enum(locales),
});

export type SetLocaleInput = z.infer<typeof setLocaleSchema>;
