import { type Page, expect } from "@playwright/test";

export async function assertProduct(page: Page, heading: string) {
  const productNameInCart = page.getByRole("heading", {
    name: heading,
    level: 3,
    exact: true,
  });

  await expect(productNameInCart).toBeVisible();
}

export async function getSubTotal(page: Page) {
  const subTotal = page
    .getByText("Subtotal")
    .locator("..")
    .locator(".font-semibold");
  const subTotalText = await subTotal.textContent();
  return Number(subTotalText?.substring(1));
}
