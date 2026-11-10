import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { cartMessages } from '../data/products';
import { checkoutCustomer, orderIdPattern } from '../data/checkoutData';

test.describe('Home page - checkout', () => {
  test('should complete checkout with fake data and show an order confirmation with an order id', async ({ page }) => {
    const home = new HomePage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    // 1. Go to the home page
    await home.goto();

    // 2. Add one product to the cart and confirm toast and header count
    await home.addToCart('USB-C Hub');
    await expect(home.toast).toHaveText(cartMessages.added);
    await expect(home.cartCount).toContainText('Cart (1)');

    // 3. Go to the cart and proceed to checkout
    await cart.goto();
    await expect(cart.itemByName('USB-C Hub')).toBeVisible();
    await cart.proceedToCheckout();
    await expect(page).toHaveURL(/\/checkout\.html$/);

    // 4. Fill in the checkout form with fake data and submit the order
    await checkout.fillForm(checkoutCustomer);
    await checkout.placeOrder();

    // 5. Order confirmation is shown with a non-empty, numeric order id
    await expect(checkout.confirmationHeading).toBeVisible();
    await expect(checkout.orderId).toBeVisible();
    const orderId = (await checkout.orderId.textContent())!.trim();
    expect(orderId).not.toBe('');
    expect(orderId).toMatch(orderIdPattern);

    // 6. Return to the main page
    await checkout.continueShoppingLink.click();
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'Welcome to TechMart' })).toBeVisible();
  });
});
