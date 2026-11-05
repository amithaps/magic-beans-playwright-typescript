import { type Page } from "@playwright/test";
import { cartSelectors as selectors } from "../selectors/cart.selectors";

export class CartPage {
  constructor(private readonly page: Page) {}

  productHeading(name: string) {
    return this.page.getByRole("heading", {
      name, level: selectors.productHeadingLevel, exact: true,
    });
  }

  async getSubtotal(): Promise<number> {
    const text = await this.page.getByText(selectors.subtotalLabel, { exact: true })
      .locator(selectors.parent).locator(selectors.subtotalValue).textContent();
    return Number(text?.substring(1));
  }

  async proceedToCheckout() {
    await this.page.getByRole("button", { name: selectors.checkout, exact: true }).click();
  }
}
