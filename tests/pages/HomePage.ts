import { Page, Locator } from '@playwright/test';
import { routes } from '../data/loginData';

export class HomePage {
  readonly authArea: Locator;
  readonly greeting: Locator;
  readonly logoutButton: Locator;
  readonly loginLink: Locator;
  readonly signUpLink: Locator;
  readonly toast: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly cartCount: Locator;
  readonly productCards: Locator;

  constructor(private readonly page: Page) {
    this.authArea = page.locator('#authArea');
    this.greeting = page.locator('.user-name');
    this.logoutButton = page.locator('#logoutBtn');
    this.loginLink = this.authArea.getByRole('link', { name: 'Login' });
    this.signUpLink = this.authArea.getByRole('link', { name: 'Sign Up' });
    this.toast = page.locator('#toast');
    this.searchInput = page.getByRole('textbox', { name: 'Search products' });
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.cartCount = page.getByRole('link', { name: /Cart \(\d+\)/ });
    this.productCards = page.locator('.product-card');
  }

  async goto() {
    await this.page.goto(routes.home);
  }

  async logout() {
    await this.logoutButton.click();
  }

  async getCurrentUserResponse() {
    return this.page.request.get(routes.currentUserApi);
  }

  /** Card for a product, located by its visible name. */
  productCard(name: string): Locator {
    return this.productCards.filter({ has: this.page.getByRole('heading', { name, exact: true }) });
  }

  /** Price text shown on a product card, e.g. "$49.99". */
  async getProductPrice(name: string): Promise<string> {
    return (await this.productCard(name).locator('.product-price').textContent())!.trim();
  }

  async getProductName(card: Locator): Promise<string> {
    return (await card.locator('h3').textContent())!.trim();
  }

  async addToCart(name: string) {
    await this.productCard(name).getByRole('button', { name: 'Add to Cart' }).click();
  }

  async searchFor(term: string) {
    await this.searchInput.fill(term);
    await this.searchInput.press('Enter');
  }
}
