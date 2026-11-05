import { expect, test } from "@playwright/test";
import { readLoginData, writeLoginData } from "../../../utils/authFileUtils";
import { EmailUtils } from "../../../utils/emailUtils";
import { signUpData } from "../../../data/signup.data";
import { LoginPage } from "../pages/LoginPage";
import { SignUpPage } from "../pages/SignUpPage";
import { classAuthState } from "./auth.paths";

test("authenticate using the class-based login page", async ({ page }) => {
  test.setTimeout(60_000);

  if (Boolean(process.env.TEST_EMAIL) !== Boolean(process.env.TEST_PASSWORD)) {
    throw new Error(
      "Set both TEST_EMAIL and TEST_PASSWORD, or leave both unset to use saved credentials.",
    );
  }
  let credentials =
    process.env.TEST_EMAIL && process.env.TEST_PASSWORD
      ? { email: process.env.TEST_EMAIL, pass: process.env.TEST_PASSWORD }
      : readLoginData();

  if (!credentials) {
    const emailUtils = new EmailUtils();
    const inbox = await emailUtils.createInbox();
    const signUpPage = new SignUpPage(page);

    await signUpPage.goto();
    await signUpPage.signUp(
      signUpData.firstName,
      signUpData.lastName,
      inbox.emailAddress,
      signUpData.password,
    );

    const confirmationEmail = await emailUtils.waitForLatestEmail(inbox.id);
    const code = /\b(\d{6})\b/.exec(
      confirmationEmail.text || confirmationEmail.body,
    )?.[1];
    if (!code) {
      throw new Error(
        "The confirmation email did not contain a six-digit code.",
      );
    }

    await signUpPage.confirmEmail(code);
    // Wait for confirmation to finish before navigating or persisting credentials.
    await expect(page).toHaveURL("login");

    credentials = { email: inbox.emailAddress, pass: signUpData.password };
    writeLoginData(credentials);
  }

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(credentials.email, credentials.pass);
  await expect(page).toHaveURL("/");
  await page.context().storageState({ path: classAuthState });
});
