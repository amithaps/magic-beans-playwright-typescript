import { type Page } from "@playwright/test";
import { signUpSelectors as selectors } from "../selectors/signup.selectors";

export class SignUpPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto("/signup");
  }

  async signUp(firstName: string, lastName: string, email: string, password: string) {
    await this.page.getByTestId(selectors.firstName).fill(firstName);
    await this.page.getByTestId(selectors.lastName).fill(lastName);
    await this.page.getByTestId(selectors.email).fill(email);
    await this.page.getByTestId(selectors.password).fill(password);
    await this.page.getByTestId(selectors.submit).click();
  }

  async confirmEmail(code: string) {
    await this.page.locator(selectors.confirmationCode).fill(code);
    await this.page.getByTestId(selectors.confirm).click();
  }
}
