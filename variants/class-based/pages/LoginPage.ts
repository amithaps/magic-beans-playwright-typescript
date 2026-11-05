import { type Page } from "@playwright/test";
import { loginSelectors as selectors } from "../selectors/login.selectors";

export class LoginPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto("/login");
  }

  async login(email: string, password: string) {
    await this.page.getByTestId(selectors.email).fill(email);
    await this.page.getByTestId(selectors.password).fill(password);
    await this.page.getByTestId(selectors.submit).click();
  }
}
