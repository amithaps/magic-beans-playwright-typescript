import { expect, test } from "@playwright/test";
import { mockedProducts, productsApiUrl } from "../../../data/products.data";
import { ProductsPage } from "../pages/ProductsPage";
import { Header } from "../pages/Header";
import { CartPage } from "../pages/CartPage";

test("print api calls to products", async ({ page }) => {
  page.on("request", request => console.log(request.method(), request.url()));
  await new ProductsPage(page).goto();
});

test("print api calls to products - complete", async ({ page }) => {
  page.on("request", request => console.log(request.method(), request.url()));
  const products = new ProductsPage(page);
  const response = page.waitForResponse(productsApiUrl);
  await products.goto();
  expect((await response).ok()).toBeTruthy();
});

test("intercept api call to products", async ({ page }) => {
  await page.route(productsApiUrl, route => route.fulfill({ json: mockedProducts }));
  const products = new ProductsPage(page);
  const header = new Header(page);
  const cart = new CartPage(page);

  await products.goto();
  await products.addProductToCart(mockedProducts.data[0].name);
  await header.openCart();
  await expect(cart.productHeading(mockedProducts.data[0].name)).toBeVisible();
});
