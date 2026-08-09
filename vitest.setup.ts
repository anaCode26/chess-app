import type { TestProject } from "vitest/node";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import type { StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { execSync } from "child_process";

declare module "vitest" {
  export interface ProvidedContext {
    databaseUrl: string;
  }
}

let container: StartedPostgreSqlContainer;

export async function setup(project: TestProject) {
  container = await new PostgreSqlContainer("postgres:16")
    .withDatabase("chess_app_test")
    .withUsername("chess_app")
    .withPassword("chess_app")
    .start();

  const url = container.getConnectionUri();

  execSync("pnpm prisma migrate deploy", {
    env: { ...process.env, DATABASE_URL: url },
    stdio: "inherit",
  });

  project.provide("databaseUrl", url);
}

export async function teardown() {
  await container?.stop();
}
