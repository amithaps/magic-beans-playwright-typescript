import { type Page } from "@playwright/test";
import { orderConfirmationSelectors as selectors } from "../selectors/order-confirmation.selectors";

export class OrderConfirmationPage {
  constructor(private readonly page: Page) {}

  get orderIdValue() {
    const wrapper = this.page.getByText(selectors.orderIdLabel, { exact: true }).locator(selectors.parent);
    return wrapper.getByRole("paragraph").nth(selectors.orderIdParagraphIndex);
  }

  async getOrderId(): Promise<string> {
    return (await this.orderIdValue.innerText()).trim();
  }

  async openOrderTracking() {
    await this.page.getByRole("button", { name: selectors.trackOrder, exact: true }).click();
  }
}
