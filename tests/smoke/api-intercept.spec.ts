import { test, expect } from "@playwright/test";

test("print api calls to products", async ({ page }) => {
  // print requests:
  page.on("request", (request) => console.log(request.method(), request.url()));

  await page.goto("/products");
});

test("print api calls to products - complete", async ({ page }) => {
  // print requests:
  page.on("request", (request) => console.log(request.method(), request.url()));

  await page.goto("/products");
  await page.waitForLoadState("networkidle");
});

test("intercept api call to products", async ({ page }) => {
  const someProducts = {
    success: true,
    source: "dynamodb",
    data: [
      {
        name: "Mocha coffee",
        price: 10.99,
        id: "0",
      },
      {
        name: "Java cool",
        price: 5.99,
        id: "1",
      },
    ],
  };

  await page.route(
    "https://api.valentinos-magic-beans.click/products",
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(someProducts),
      });
    },
  );

  await page.goto("/products");
  // this will allow intercepting fetch requests
  await page.waitForLoadState("networkidle");

  await page
    .locator('[data-test-id="product-card-add-to-cart-button-0"]')
    .click();

  await page
    .locator('[data-test-id="header-cart-button"]')
    .getByRole("button")
    .click();

  // assert product name
  const firstProductHeading = page.getByRole("heading", {
    name: someProducts.data[0].name,
  });
  await expect(firstProductHeading).toBeVisible();
});

// Scenario	                | Why mock?	                        | Example
// Backend unavailable	    | Continue frontend testing         | Product API is down
// Difficult test data	    | Create an unusual condition       | Product price is $0
// Error handling	          | Verify how the UI handles failures| API returns HTTP 500
// Empty data	              | Verify empty-state UI             | API returns zero products
// Slow API	                | Test loading indicators           | Simulate a delayed response
// Stable regression tests	| Avoid changes in backend data     | Always return the same two products
// route.fetch() → Gets the backend response without delivering it to the waiting browser page.
// route.fulfill() → Supplies the response that completes the browser's intercepted request.
