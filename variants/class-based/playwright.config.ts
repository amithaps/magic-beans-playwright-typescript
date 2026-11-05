import { defineConfig, devices } from "@playwright/test";
import { classAuthState } from "./setup/auth.paths";

export default defineConfig({
  testDir: ".",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  outputDir: "../../test-results/class-based",
  reporter: [
    ["list"],
    ["html", { outputFolder: "../../playwright-report/class-based", open: "never" }],
  ],
  use: {
    baseURL: "https://valentinos-magic-beans.click/",
    testIdAttribute: "data-test-id",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "class-auth-setup", testMatch: "**/setup/auth.setup.ts" },
    {
      name: "class-chromium",
      testMatch: "**/smoke/*.spec.ts",
      use: { ...devices["Desktop Chrome"], storageState: classAuthState },
      dependencies: ["class-auth-setup"],
    },
  ],
});
