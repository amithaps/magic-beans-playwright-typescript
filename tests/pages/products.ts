import { type Page } from "@playwright/test";

export async function addproductToCart(page: Page, product: string) {
  const productCard = page.locator(".p-6").filter({
    has: page.getByRole("heading", {
      name: product,
      exact: true,
    }),
  });
  const productName = await productCard
    .getByRole("heading", { level: 3 })
    .textContent();

  if (productName === null) {
    throw new Error("Product name was not found");
  }
  const productPriceText = await productCard
    .locator(".font-bold")
    .textContent();
  const productPrice = Number(productPriceText?.substring(1));
  const productButton = productCard.getByRole("button", {
    name: "Add to Cart",
    exact: true,
  });

  await productButton.click();

  return {
    name: productName,
    price: productPrice,
  };
}
