import { expect, test } from "@playwright/test";
import { productData } from "../../../data/products.data";
import { ProductsPage } from "../pages/ProductsPage";

test("Block resources", async ({ page }) => {
  const blockedImages: string[] = [];
  await page.route("**/*", route => {
    if (route.request().resourceType() === "image") {
      blockedImages.push(route.request().url());
      return route.abort();
    }
    return route.continue();
  });
  const products = new ProductsPage(page);
  await products.goto();
  await expect(products.productHeading(productData.name)).toBeVisible();
  await expect.poll(() => blockedImages.length).toBeGreaterThan(0);
});
