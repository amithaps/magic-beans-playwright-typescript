import { type Page } from "@playwright/test";
import { type ContactInfo, type ShippingAddress, type PaymentInfo } from "../../../data/checkout.data";
import { checkoutSelectors as selectors } from "../selectors/checkout.selectors";

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  async addContactInfo(contact: ContactInfo) {
    await this.page.getByTestId(selectors.firstName).fill(contact.firstName);
    await this.page.getByTestId(selectors.lastName).fill(contact.lastName);
    await this.page.getByTestId(selectors.email).fill(contact.email);
  }

  get firstNameInput() {
    return this.page.getByTestId(selectors.firstName);
  }

  get lastNameInput() {
    return this.page.getByTestId(selectors.lastName);
  }

  get emailInput() {
    return this.page.getByTestId(selectors.email);
  }

  async addShippingAddress(shipping: ShippingAddress) {
    await this.page.getByTestId(selectors.address).fill(shipping.address);
    await this.page.getByTestId(selectors.city).fill(shipping.city);
    await this.page.getByTestId(selectors.zipCode).fill(shipping.zipCode);
    await this.page.getByTestId(selectors.country).fill(shipping.country);
  }

  async addPaymentInfo(payment: PaymentInfo) {
    await this.page.getByTestId(selectors.nameOnCard).fill(payment.nameOnCard);
    await this.page.getByTestId(selectors.cardNumber).fill(payment.cardNumber);
    await this.page.getByTestId(selectors.expiry).fill(payment.expiry);
    await this.page.getByTestId(selectors.cvc).fill(payment.cvc);
  }

  async placeOrder() {
    await this.page.getByTestId(selectors.placeOrder).click();
  }
}
