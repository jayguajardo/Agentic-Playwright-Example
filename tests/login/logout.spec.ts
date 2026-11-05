import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { validUser } from '../data/users';
import { wrongPasswordUser, messages, routes } from '../data/loginData';

test.describe('Logout and re-login', () => {
  test('logout clears the logged-in state', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);

    await loginPage.goto();
    await loginPage.login(validUser.email, validUser.password);
    await expect(homePage.greeting).toHaveText(messages.greeting);

    await homePage.logout();

    await expect(homePage.toast).toHaveText(messages.logoutToast);
    await expect(homePage.loginLink).toBeVisible();
    await expect(homePage.signUpLink).toBeVisible();
    await expect(homePage.greeting).toBeHidden();
    expect(await loginPage.getStoredUser()).toBeNull();

    const response = await page.request.get(routes.currentUserApi);
    expect(response.status()).toBe(401);
  });

  test('user can log in again after logging out', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);

    await loginPage.goto();
    await loginPage.login(validUser.email, validUser.password);
    await expect(homePage.greeting).toHaveText(messages.greeting);
    await homePage.logout();
    await expect(homePage.loginLink).toBeVisible();

    await homePage.loginLink.click();
    await loginPage.login(validUser.email, validUser.password);

    await expect(page).toHaveURL(routes.home);
    await expect(homePage.greeting).toHaveText(messages.greeting);
    await expect(homePage.logoutButton).toBeVisible();
  });

  test('browser back and forward after logout shows no logged-in UI', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);

    await loginPage.goto();
    await loginPage.login(validUser.email, validUser.password);
    await expect(homePage.greeting).toHaveText(messages.greeting);
    await homePage.logout();
    await expect(homePage.loginLink).toBeVisible();

    await page.goBack();
    await expect(page).toHaveURL(routes.login);
    await page.goForward();

    await expect(page).toHaveURL(routes.home);
    await expect(homePage.greeting).toBeHidden();
    await expect(homePage.loginLink).toBeVisible();
  });

  test('wrong password after logout does not restore the logged-in state', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);

    await loginPage.goto();
    await loginPage.login(validUser.email, validUser.password);
    await expect(homePage.greeting).toHaveText(messages.greeting);
    await homePage.logout();
    await expect(homePage.loginLink).toBeVisible();

    await homePage.loginLink.click();
    await loginPage.login(wrongPasswordUser.email, wrongPasswordUser.password);

    await expect(loginPage.errorMessage).toHaveText(messages.invalidCredentials);
    await expect(page).toHaveURL(routes.login);
    expect(await loginPage.getStoredUser()).toBeNull();
  });
});
