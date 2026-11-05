import { Page } from "@playwright/test";

export async function login(page: Page, email: string, password: string) {
  await page.getByTestId("login-email-input").fill(email);
  await page.getByTestId("login-password-input").fill(password);
  await page.getByTestId("login-submit-button").click();
}
