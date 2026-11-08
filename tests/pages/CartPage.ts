import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly heading: Locator;
  readonly items: Locator;
  readonly total: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Your Shopping Cart' });
    this.items = page.locator('.cart-item');
    this.total = page.locator('#total');
  }

  async goto() {
    await this.page.goto('/cart.html');
  }

  itemByName(name: string): Locator {
    return this.items.filter({ has: this.page.getByRole('heading', { name, exact: true }) });
  }

  /** Unit price shown on the cart line for a product, e.g. "$49.99". */
  async getItemPrice(name: string): Promise<string> {
    return (await this.itemByName(name).locator('.item-price').textContent())!.trim();
  }
}
