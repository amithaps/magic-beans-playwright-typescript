import { expect, test } from "@playwright/test";
import { checkoutData } from "../../../data/checkout.data";
import { productData } from "../../../data/products.data";
import { ProductsPage } from "../pages/ProductsPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { ContactPage } from "../pages/ContactPage";
import { Header } from "../pages/Header";
import { OrderConfirmationPage } from "../pages/OrderConfirmationPage";

test("item is added to the shopping cart", async ({ page }) => {
  const products = new ProductsPage(page);
  const cart = new CartPage(page);
  const header = new Header(page);

  await products.goto();
  const addedProduct = await products.addProductToCart(productData.name);
  await header.openCart();
  await expect(cart.productHeading(addedProduct.name)).toBeVisible();
  expect(await cart.getSubtotal()).toEqual(addedProduct.price);
});

test.describe("guest checkout", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("Complete workflow for product order", async ({ page }) => {
    const products = new ProductsPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);
    const confirmation = new OrderConfirmationPage(page);
    const contact = new ContactPage(page);
    const header = new Header(page);

    await products.goto();
    const addedProduct = await products.addProductToCart(productData.name);
    await header.openCart();
    await expect(cart.productHeading(addedProduct.name)).toBeVisible();
    expect(await cart.getSubtotal()).toEqual(addedProduct.price);
    await cart.proceedToCheckout();
    await checkout.addContactInfo(checkoutData.contact);
    await checkout.addShippingAddress(checkoutData.shipping);
    await checkout.addPaymentInfo(checkoutData.payment);
    await checkout.placeOrder();

    await expect(confirmation.orderIdValue).toHaveText(/\S+/);
    const orderId = await confirmation.getOrderId();
    await confirmation.openOrderTracking();
    await contact.fillOrderIdAndEmail(orderId, checkoutData.contact.email);
    await contact.trackOrder();
    await expect(contact.orderedProduct(addedProduct.name)).toBeVisible();
  });
});
