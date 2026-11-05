import { expect, test } from "@playwright/test";
import * as loginPage from "../pages/login";
import {
  readLoginData,
  writeLoginData,
  getAuthSessionPath,
} from "../../utils/authFileUtils";
import { createConfirmedAccount } from "../../utils/signupUtils";

test("prepare account and log in", async ({ page }) => {
  test.setTimeout(60_000);
  let credentials = readLoginData();

  if (!credentials) {
    credentials = await createConfirmedAccount(page);
    writeLoginData(credentials);
  }
  await page.goto("/login");
  await loginPage.login(page, credentials.email, credentials.pass);
  await expect(page).toHaveURL("/");
  await page.context().storageState({
    path: getAuthSessionPath(),
  });
});
