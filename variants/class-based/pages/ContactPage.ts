import { type Page } from "@playwright/test";
import { contactSelectors as selectors } from "../selectors/contact.selectors";

export class ContactPage {
  constructor(private readonly page: Page) {}

  async fillOrderIdAndEmail(orderId: string, email: string) {
    await this.page.getByTestId(selectors.orderId).fill(orderId);
    await this.page.getByTestId(selectors.email).fill(email);
  }

  async trackOrder() {
    await this.page.getByTestId(selectors.trackOrder).click();
  }

  orderedProduct(name: string) {
    return this.page.getByText(name, { exact: true });
  }
}
