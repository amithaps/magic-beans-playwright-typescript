import { expect, test } from "@playwright/test";
import { signUpData } from "../../../data/signup.data";
import { EmailUtils } from "../../../utils/emailUtils";
import { SignUpPage } from "../pages/SignUpPage";
import { LoginPage } from "../pages/LoginPage";
import { loginDataFileExists } from "../../../utils/authFileUtils";

// Registration needs a signed-out browser even though other smoke tests start signed in.
test.use({ storageState: { cookies: [], origins: [] } });

test("Sign up", async ({ page }) => {
  test.skip(
    loginDataFileExists() || Boolean(process.env.TEST_EMAIL && process.env.TEST_PASSWORD),
    "credentials present",
  );
  test.setTimeout(90_000);
  const emailUtils = new EmailUtils();
  const inbox = await emailUtils.createInbox();
  const signUp = new SignUpPage(page);
  const login = new LoginPage(page);

  await signUp.goto();
  await signUp.signUp(signUpData.firstName, signUpData.lastName, inbox.emailAddress, signUpData.password);
  const email = await emailUtils.waitForLatestEmail(inbox.id);
  const code = /\b(\d{6})\b/.exec(email.text || email.body)?.[1];
  if (!code) throw new Error("The confirmation email did not contain a six-digit code.");
  await signUp.confirmEmail(code);
  await expect(page).toHaveURL(/\/login/);
  await login.login(inbox.emailAddress, signUpData.password);
  await expect(page).toHaveURL("/");
  // Do not replace the credentials used by other tests or variants.
});
