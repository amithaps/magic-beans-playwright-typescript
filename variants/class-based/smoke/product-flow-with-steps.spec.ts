import { expect, test } from "@playwright/test";
import { checkoutData } from "../../../data/checkout.data";
import { productData } from "../../../data/products.data";
import { readLoginData } from "../../../utils/authFileUtils";
import { ProductsPage } from "../pages/ProductsPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { ContactPage } from "../pages/ContactPage";
import { Header } from "../pages/Header";
import { OrderConfirmationPage } from "../pages/OrderConfirmationPage";

test("Complete workflow for product order - with steps", async ({ page }) => {
  const products = new ProductsPage(page);
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);
  const confirmation = new OrderConfirmationPage(page);
  const contact = new ContactPage(page);
  const header = new Header(page);
  const email = process.env.TEST_EMAIL || readLoginData()?.email;
  if (!email) throw new Error("An authenticated user's email is required for order tracking.");

  await products.goto();
  const addedProduct = await test.step("add product to cart", async () => {
    return products.addProductToCart(productData.name);
  });

  await test.step("go to checkout page", async () => {
    await header.openCart();
    await expect(cart.productHeading(addedProduct.name)).toBeVisible();
    expect(await cart.getSubtotal()).toEqual(addedProduct.price);
    await cart.proceedToCheckout();
  });

  await test.step("complete checkout information", async () => {
    await expect(checkout.firstNameInput).toHaveValue(/\S+/);
    await expect(checkout.lastNameInput).toHaveValue(/\S+/);
    await expect(checkout.emailInput).toHaveValue(/\S+@\S+\.\S+/);
    await checkout.addShippingAddress(checkoutData.shipping);
    await checkout.addPaymentInfo(checkoutData.payment);
    await checkout.placeOrder();
  });

  const orderId = await test.step("get the orderID", async () => {
    await expect(confirmation.orderIdValue).toHaveText(/\S+/);
    return confirmation.getOrderId();
  });

  await test.step("open the contact page", async () => {
    await confirmation.openOrderTracking();
    await contact.fillOrderIdAndEmail(orderId, email);
    await contact.trackOrder();
  });

  await test.step("check if ordered item is returned", async () => {
    await expect(contact.orderedProduct(addedProduct.name)).toBeVisible();
  });
});
