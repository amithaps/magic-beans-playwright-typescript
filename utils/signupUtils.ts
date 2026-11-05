import { expect, type Page } from "@playwright/test";
import { EmailUtils } from "./emailUtils";
import * as signUpPage from "../tests/pages/signUp";

export async function createConfirmedAccount(page: Page) {
  const emailUtils = new EmailUtils();
  const inbox = await emailUtils.createInbox();

  await page.goto("/signup");

  await signUpPage.signUp(page, inbox.emailAddress);

  const email = await emailUtils.waitForLatestEmail(inbox.id);

  // get the code\ from the email body:
  const code = /([0-9]{6})$/.exec(email?.body!)![1];

  await signUpPage.addConfirmationCode(page, code);
  await expect(page).toHaveURL("login");

  return {
    email: inbox.emailAddress,
    pass: signUpPage.signUpData.pass,
  };
}
