import { test, expect } from "@playwright/test";
import * as products from "../pages/products";
import * as cart from "../pages/cart";
import * as checkout from "../pages/checkout";
import * as contact from "../pages/contact";

test("Complete workflow for product order - with steps", async ({ page }) => {
  await page.goto("/products");

  let addedProduct: Awaited<ReturnType<typeof products.addproductToCart>> =
    {} as any;
  //| undefined;
  let orderEmail: string;
  await test.step("add product to cart", async () => {
    addedProduct = await products.addproductToCart(page, "Colombian Supreme");
  });
  await test.step("go to checkout page", async () => {
    const cartButton = page
      .getByTestId("header-cart-button")
      .getByRole("button");
    await cartButton.click();
    await cart.assertProduct(page, addedProduct.name);
    const subTotal = await cart.getSubTotal(page);
    expect(subTotal).toEqual(addedProduct.price);
    await page.getByRole("button", { name: "Proceed to Checkout" }).click();
  });

  await test.step("complete checkout information", async () => {
    //await checkout.addContactInfo(page);
    await expect(page.getByTestId("checkout-firstname-input")).toHaveValue(
      /\S+/,
    );
    await expect(page.getByTestId("checkout-lastname-input")).toHaveValue(
      /\S+/,
    );
    await expect(page.getByTestId("checkout-email-input")).toHaveValue(
      /\S+@\S+\.\S+/,
    );
    orderEmail = await page.getByTestId("checkout-email-input").inputValue();
    await checkout.addShippingAddress(page);
    await checkout.addPaymentInfo(page);
    await checkout.placeOrder(page);
  });

  let orderId: string | null;

  await test.step("get the orderID", async () => {
    const orderWrapper = page.getByText("Your Order ID is:").locator("..");
    orderId = await orderWrapper.getByRole("paragraph").nth(1).textContent();
  });

  await test.step("open the contact page", async () => {
    await page.getByRole("button", { name: "Track Your Order" }).click();
    await contact.fillOrderIdAndEmail(page, orderId!, orderEmail);
    await contact.clickTrackOrder(page);
  });

  await test.step("check if ordered item is returned", async () => {
    const firstOrder = page.getByText(addedProduct.name);
    await expect(firstOrder).toBeVisible();
  });
});
