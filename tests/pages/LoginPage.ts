import { Page, Locator } from '@playwright/test';
import { routes } from '../data/loginData';

export class LoginPage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly toast: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = page.getByLabel('Email Address');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.locator('#errorMessage');
    this.toast = page.locator('#toast');
  }

  async goto() {
    await this.page.goto(routes.login);
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async getStoredUser() {
    return this.page.evaluate(() => localStorage.getItem('user'));
  }
}
