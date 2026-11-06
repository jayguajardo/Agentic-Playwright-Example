import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { validUser } from '../data/users';
import { messages, routes } from '../data/loginData';

test.describe('Login', () => {
  test('Successful login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);

    // Log in with the valid demo user
    await loginPage.goto();
    await loginPage.login(validUser.email, validUser.password);

    // Success toast is shown
    await expect(loginPage.toast).toHaveText(messages.loginToast);

    // Redirects to the home page within ~1.5-3 s
    await expect(page).toHaveURL(routes.home, { timeout: 3000 });

    // Greeting and Logout are visible; Login / Sign Up links are gone
    await expect(homePage.greeting).toHaveText(messages.greeting);
    await expect(homePage.logoutButton).toBeVisible();
    await expect(homePage.loginLink).toBeHidden();
    await expect(homePage.signUpLink).toBeHidden();

    // localStorage.user holds id, email and name, but never the password
    const storedUser = await loginPage.getStoredUserParsed();
    expect(storedUser).toHaveProperty('id');
    expect(storedUser).toHaveProperty('email', validUser.email);
    expect(storedUser).toHaveProperty('name', validUser.name);
    expect(storedUser).not.toHaveProperty('password');

    // Server session is valid for the demo user
    const response = await homePage.getCurrentUserResponse();
    expect(response.status()).toBe(200);
    expect(await response.json()).toMatchObject({ email: validUser.email });
  });
});
