import { getRequestConfig } from "next-intl/server";
import da from "@/messages/da.json";
import en from "@/messages/en.json";
import es from "@/messages/es.json";
import { getUserLocale, type Locale } from "./locale";

const catalogs: Record<Locale, typeof da> = { da, en, es };

export default getRequestConfig(async () => {
  const locale = await getUserLocale();

  return {
    locale,
    messages: catalogs[locale],
    timeZone: "Europe/Copenhagen",
  };
});
