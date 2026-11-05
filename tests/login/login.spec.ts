import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { validUser } from '../data/users';
import { wrongPasswordUser, messages, routes } from '../data/loginData';

test.describe('Login', () => {
  test('successful login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);

    await loginPage.goto();
    await loginPage.login(validUser.email, validUser.password);

    await expect(loginPage.toast).toHaveText(messages.loginToast);
    await expect(page).toHaveURL(routes.home);
    await expect(homePage.greeting).toHaveText(messages.greeting);
    await expect(homePage.logoutButton).toBeVisible();
  });

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
