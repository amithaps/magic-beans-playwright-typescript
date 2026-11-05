import { expect, test } from "@playwright/test";
import { Header } from "../pages/Header";

test("user is logged in", async ({ page }) => {
  const header = new Header(page);
  await page.goto("/");
  await header.openAccountMenu();
  await expect(header.welcomeMessage).toBeVisible();
});
