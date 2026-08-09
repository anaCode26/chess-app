import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

const alias = {
  "@actions": path.resolve(__dirname, "./actions"),
  "@repositories": path.resolve(__dirname, "./repositories"),
  "@components": path.resolve(__dirname, "./components"),
  "@lib": path.resolve(__dirname, "./lib"),
  "@tests": path.resolve(__dirname, "./tests"),
};

export default defineConfig({
  plugins: [react()],
  resolve: { alias },
  test: {
    projects: [
      {
        resolve: { alias },
        test: {
          name: "unit",
          include: ["tests/unit/**/*.unit.test.ts"],
          environment: "node",
          setupFiles: ["./tests/helpers/env-setup.ts"],
        },
      },
      {
        resolve: { alias },
        test: {
          name: "integration",
          include: ["tests/integration/**/*.integration.test.ts"],
          environment: "node",
          fileParallelism: false,
          setupFiles: [
            "./tests/helpers/env-setup.ts",
            "./tests/helpers/integration-setup.ts",
          ],
          globalSetup: ["./vitest.setup.ts"],
        },
      },
    ],
  },
});
