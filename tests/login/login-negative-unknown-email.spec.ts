// spec: specs/login-page-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { unknownEmailUser, messages, routes } from '../data/loginData';

test.describe('Login', () => {
  test('login fails with unknown email', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // 1. Open /login.html
    await loginPage.goto();

    // 2. Log in with nobody@techmart.com / demo123
    await loginPage.login(unknownEmailUser.email, unknownEmailUser.password);

    // 3. Expect #errorMessage visible with text "Invalid credentials"
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(messages.invalidCredentials);

    // 4. Expect URL to remain /login.html
    await expect(page).toHaveURL(routes.login);

    // 5. Expect localStorage user to be null
    expect(await loginPage.getStoredUser()).toBeNull();
  });
});
