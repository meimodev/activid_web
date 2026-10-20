import { defineConfig } from "@playwright/test";
import { randomBytes, randomUUID } from "node:crypto";
import { tmpdir } from "node:os";
import path from "node:path";

// Isolated credentials and storage: these checks never write to the live project database.
const password = process.env.PROJECTS_E2E_PASSWORD || randomBytes(24).toString("hex");
process.env.PROJECTS_E2E_PASSWORD = password;
export default defineConfig({
  testDir: "./e2e", testMatch: "projects.spec.ts", workers: 1, timeout: 60000, reporter: "list",
  use: { baseURL: "http://127.0.0.1:3101", browserName: "chromium", channel: "chrome" },
  webServer: {
    command: "pnpm --config.verify-deps-before-run=false exec next start --hostname 127.0.0.1 --port 3101",
    url: "http://127.0.0.1:3101/project", reuseExistingServer: false,
    env: { ADMIN_PASSWORD: password, SESSION_SECRET: randomBytes(32).toString("hex"), PROJECTS_LOCAL_DATA_DIR: path.join(tmpdir(), `activid-projects-e2e-${randomUUID()}`), VERCEL: "" },
  },
});
