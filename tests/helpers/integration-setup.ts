import { inject } from "vitest";

const databaseUrl = inject("databaseUrl");
if (databaseUrl) {
  process.env.DATABASE_URL = databaseUrl;
}
