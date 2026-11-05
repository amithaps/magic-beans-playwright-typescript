import { type Page } from "@playwright/test";
import { headerSelectors as selectors } from "../selectors/header.selectors";

// A reusable page component: the same header appears on several pages.
export class Header {
  constructor(private readonly page: Page) {}

  async openCart() {
    await this.page.getByTestId(selectors.cart).getByRole("button").click();
  }

  async openAccountMenu() {
    await this.page.getByRole("button").and(this.page.locator(selectors.accountMenu)).click();
  }

  get welcomeMessage() {
    return this.page.getByRole("menu").getByText(selectors.welcomeMessage, { exact: true });
  }
}
