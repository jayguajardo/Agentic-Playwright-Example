import { Page, Locator } from '@playwright/test';
import { routes } from '../data/loginData';

export class HomePage {
  readonly authArea: Locator;
  readonly greeting: Locator;
  readonly logoutButton: Locator;
  readonly loginLink: Locator;
  readonly signUpLink: Locator;
  readonly toast: Locator;

  constructor(private readonly page: Page) {
    this.authArea = page.locator('#authArea');
    this.greeting = page.locator('.user-name');
    this.logoutButton = page.locator('#logoutBtn');
    this.loginLink = this.authArea.getByRole('link', { name: 'Login' });
    this.signUpLink = this.authArea.getByRole('link', { name: 'Sign Up' });
    this.toast = page.locator('#toast');
  }

  async goto() {
    await this.page.goto(routes.home);
  }

  async logout() {
    await this.logoutButton.click();
  }
}
