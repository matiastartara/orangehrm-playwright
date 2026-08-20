import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

// Run tests in serial mode to avoid rate limiting on the demo site
test.describe.configure({ mode: 'serial' });

// Run these tests with a clean session (overrides global storageState)
test.use({ storageState: undefined });

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.forceLogout();
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('successful login with valid credentials', async ({ page }) => {
    await loginPage.login('Admin', 'admin123');

    await expect(page).toHaveURL(/\/web\/index\.php\/dashboard\/index$/);
    await expect(loginPage.dashboardHeading).toBeVisible();
  });

  test('login fails with incorrect password', async ({ page }) => {
    await loginPage.login('Admin', 'wrongpassword');

    await expect(loginPage.invalidCredentialsMessage).toBeVisible();
    await expect(page).toHaveURL(/\/web\/index\.php\/auth\/login$/);
  });

  test('login fails with nonexistent user', async ({ page }) => {
    await loginPage.login('nonexistent', 'wrongpassword');

    await expect(loginPage.invalidCredentialsMessage).toBeVisible();
    await expect(page).toHaveURL(/\/web\/index\.php\/auth\/login$/);
  });

  test('login does not process empty fields', async () => {
    await loginPage.loginButton.click();

    // When both fields are empty, two 'Required' error messages appear
    await expect(loginPage.requiredErrorMessages.first()).toBeVisible();
    await expect(loginPage.requiredErrorMessages.nth(1)).toBeVisible();
    await expect(loginPage.page).toHaveURL(/\/web\/index\.php\/auth\/login$/);
  });

  test('protected page redirects to login without session', async ({ page }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');

    await expect(page).toHaveURL(/\/web\/index\.php\/auth\/login$/);
    await expect(loginPage.usernameInput).toBeVisible();
  });
});
