import { Page } from "@playwright/test";

export const testValues = {
  firstName: "Alex",
  lastName: "Sefu",
  email: "alex@email.com",
  address: "Some street 1",
  city: "New York",
  zipCode: "12345",
  country: "United States",
  payment: {
    nameOnCard: "Sefu",
    cardNumber: "1234 4567 1234 5678",
    expiry: "01/30",
    cvc: "123",
  },
};

export async function addContactInfo(page: Page) {
  await page.getByTestId("checkout-firstname-input").fill(testValues.firstName);
  await page.getByTestId("checkout-lastname-input").fill(testValues.lastName);
  await page.getByTestId("checkout-email-input").fill(testValues.email);
}

export async function addShippingAddress(page: Page) {
  await page.getByTestId("checkout-address-input").fill(testValues.address);
  await page.getByTestId("checkout-city-input").fill(testValues.city);
  await page.getByTestId("checkout-zipcode-input").fill(testValues.zipCode);
  await page.getByTestId("checkout-country-input").fill(testValues.country);
}

export async function addPaymentInfo(page: Page) {
  await page
    .getByTestId("checkout-cardname-input")
    .fill(testValues.payment.nameOnCard);
  await page
    .getByTestId("checkout-cardnumber-input")
    .fill(testValues.payment.cardNumber);
  await page
    .getByTestId("checkout-cardexpiry-input")
    .fill(testValues.payment.expiry);
  await page.getByTestId("checkout-cardcvc-input").fill(testValues.payment.cvc);
}

export async function placeOrder(page: Page) {
  await page.getByTestId("place-order-button").click();
}
