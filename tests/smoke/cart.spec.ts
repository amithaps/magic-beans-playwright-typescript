import { test, expect } from "@playwright/test";
import * as products from "../pages/products";
import * as cart from "../pages/cart";
import * as checkout from "../pages/checkout";
import * as contact from "../pages/contact";
import { readLoginData } from "../../utils/authFileUtils";

test("item is added to the shopping cart", async ({ page }) => {
  await page.goto("products");

  const addedproduct = await products.addproductToCart(
    page,
    "Colombian Supreme",
  );
  const cartButton = page.getByTestId("header-cart-button").getByRole("button");
  await cartButton.click();

  await cart.assertProduct(page, addedproduct.name);

  const subTotal = await cart.getSubTotal(page);

  expect(subTotal).toEqual(addedproduct.price);
});

test("Complete workflow for product order", async ({ page }) => {
  await page.goto("products");

  const addedproduct = await products.addproductToCart(
    page,
    "Colombian Supreme",
  );
  const cartButton = page.getByTestId("header-cart-button").getByRole("button");
  await cartButton.click();

  await cart.assertProduct(page, addedproduct.name);

  const subTotal = await cart.getSubTotal(page);

  expect(subTotal).toEqual(addedproduct.price);

  await page.getByRole("button", { name: "Proceed to Checkout" }).click();

  //await checkout.addContactInfo(page);
  await expect(page.getByTestId("checkout-firstname-input")).toHaveValue(/\S+/);
  await expect(page.getByTestId("checkout-lastname-input")).toHaveValue(/\S+/);
  await expect(page.getByTestId("checkout-email-input")).toHaveValue(
    /\S+@\S+\.\S+/,
  );
  const orderEmail = await page
    .getByTestId("checkout-email-input")
    .inputValue();
  await checkout.addPaymentInfo(page);
  await checkout.addShippingAddress(page);
  await checkout.placeOrder(page);

  // get orderId:
  const orderWrapper = page.getByText("Your Order ID is:").locator("..");
  const orderId = await orderWrapper
    .getByRole("paragraph")
    .nth(1)
    .textContent();
  if (orderId === null) {
    throw new Error("order Id was not found");
  }

  // open the contact page:
  await page.getByRole("button", { name: "Track Your Order" }).click();
  await contact.fillOrderIdAndEmail(page, orderId, orderEmail);
  await contact.clickTrackOrder(page);

  // check if ordered item is returned:
  const firstOrder = page.getByText(addedproduct.name);
  await expect(firstOrder).toBeVisible();
});
