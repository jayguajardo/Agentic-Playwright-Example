import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { CartPage } from '../pages/CartPage';
import { cartMessages, productNames, randomItem } from '../data/products';

test.describe('Home page - search and add to cart', () => {
  test('should search for a random product, add it to the cart and verify its price', async ({ page }) => {
    const home = new HomePage(page);
    const cart = new CartPage(page);

    await home.goto();

    // Search for a random product name and confirm only that product matches
    const name = randomItem(productNames);
    await home.searchFor(name);
    await expect(home.productCards).toHaveCount(1);
    await expect(home.productCard(name)).toBeVisible();
    const expectedPrice = await home.getProductPrice(name);

    // Add the search result to the cart
    await home.addToCart(name);
    await expect(home.toast).toHaveText(cartMessages.added);
    await expect(home.cartCount).toContainText('Cart (1)');

    // The cart shows the same product at the same price
    await cart.goto();
    await expect(cart.itemByName(name)).toBeVisible();
    const actualPrice = await cart.getItemPrice(name);
    expect(actualPrice).toBe(expectedPrice);
  });
});
