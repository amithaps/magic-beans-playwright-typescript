import { test, expect } from "@playwright/test";
import { createConfirmedAccount } from "../../utils/signupUtils";
import * as loginPage from "../pages/login";
import { writeLoginData, loginDataFileExists } from "../../utils/authFileUtils";

test("Sign up", async ({ page }) => {
  test.skip(loginDataFileExists(), "credentials present");

  const credentials = await createConfirmedAccount(page);
  await page.goto("/login");
  await loginPage.login(page, credentials.email, credentials.pass);
  await expect(page).toHaveURL("/");
  writeLoginData(credentials);
});
