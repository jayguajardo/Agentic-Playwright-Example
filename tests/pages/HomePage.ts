import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly greeting: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.greeting = page.locator('.user-name');
    this.logoutButton = page.locator('#logoutBtn');
  }
}
