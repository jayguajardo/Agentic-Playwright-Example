import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { wrongPasswordUser, messages, routes } from '../data/loginData';

// Successful login is covered in login-success.spec.ts (plan section 2.2)
test.describe('Login', () => {
  test('login fails with wrong password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(wrongPasswordUser.email, wrongPasswordUser.password);

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(messages.invalidCredentials);
    await expect(page).toHaveURL(routes.login);
    expect(await loginPage.getStoredUser()).toBeNull();
  });
});
