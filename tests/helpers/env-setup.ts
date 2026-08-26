import { config } from "dotenv";

/**
 * `.env.example` is the canonical list of variables, so tests read it rather
 * than repeating it. Adding a variable to `lib/env.ts` and the example file is
 * then enough — the suite follows on its own.
 */
config({ path: ".env.example" });

/**
 * Overridden rather than defaulted, so a stray unit test can never reach the
 * developer's real database. `tests/helpers/integration-setup.ts` runs after
 * this file and swaps in the Testcontainers URL.
 */
process.env.DATABASE_URL = "postgresql://user:pass@localhost:5432/test";
