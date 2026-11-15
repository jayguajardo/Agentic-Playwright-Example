// spec: specs/home-page-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Home page - add to cart', () => {
  test('should show an error toast and keep the cart count when the add request fails', async ({ page }) => {
    const home = new HomePage(page);

    // 1. Intercept the POST to the cart API and respond with HTTP 500
    // (non-JSON body, so app.js response.json() throws and its catch shows "Failed to add item")
    await page.route('**/api/cart', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({ status: 500, contentType: 'text/plain', body: 'Internal Server Error' });
      } else {
        await route.continue();
      }
    });

    // 2. Open the home page
    await home.goto();

    // 3. Click Add to Cart on a product
    await home.addToCart('USB-C Hub');

    // 4. The error toast is shown
    await expect(home.toast).toHaveText('Failed to add item');

    // 5. The header cart count is unchanged
    await expect(home.cartCount).toContainText('Cart (0)');
  });
});
