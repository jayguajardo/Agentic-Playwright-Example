import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { CartPage } from '../pages/CartPage';
import { cartMessages, randomItem } from '../data/products';

test.describe('Home page - add to cart', () => {
  test('should add a random product to the cart and verify its price', async ({ page }) => {
    const home = new HomePage(page);
    const cart = new CartPage(page);

    await home.goto();

    // Pick a random product card from the grid and read its name and price
    const cards = await home.productCards.all();
    const name = await home.getProductName(randomItem(cards));
    const expectedPrice = await home.getProductPrice(name);

    // Add it to the cart
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
