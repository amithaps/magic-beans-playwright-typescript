import { type Page } from "@playwright/test";
import { productsSelectors as selectors } from "../selectors/products.selectors";

export type Product = { name: string; price: number };

export class ProductsPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto("/products");
  }

  productHeading(name: string) {
    return this.page.getByRole("heading", {
      name, level: selectors.headingLevel, exact: true,
    });
  }

  async addProductToCart(name: string): Promise<Product> {
    const card = this.page.locator(selectors.card).filter({
      has: this.page.getByRole("heading", { name, level: selectors.headingLevel, exact: true }),
    });
    const priceText = await card.locator(selectors.price).textContent();
    const price = Number(priceText?.substring(1));
    await card.getByRole("button", { name: selectors.addToCart, exact: true }).click();
    return { name, price };
  }
}
