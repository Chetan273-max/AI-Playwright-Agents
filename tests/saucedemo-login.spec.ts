import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';
import type { CartPage } from '../pages/CartPage';
import type { LoginPage } from '../pages/LoginPage';
import type { ProductsPage } from '../pages/ProductsPage';

const PASSWORD = 'secret_sauce';

async function login(loginPage: LoginPage, username: string, password: string): Promise<void> {
  await loginPage.login(username, password);
}

async function expectInventory(page: Page, productsPage: ProductsPage, cartPage: CartPage): Promise<void> {
  await expect(page).toHaveURL(productsPage.url);
  await expect(productsPage.heading).toBeVisible();
  await expect(productsPage.sortControl).toBeVisible();
  await expect(cartPage.cartButton(0)).toBeVisible();
}

test.describe('SauceDemo Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('AUTH-UI-001: verifies login page structure and default state', async ({ page, loginPage }) => {
    await expect(page).toHaveTitle('Swag Labs');
    await expect(loginPage.form).toBeVisible();
    await expect(loginPage.username).toBeVisible();
    await expect(loginPage.password).toBeVisible();
    await expect(loginPage.password).toHaveAttribute('type', 'password');
    await expect(loginPage.loginButton).toBeEnabled();
    await expect(loginPage.acceptedUsernamesHeading).toBeVisible();
    await expect(loginPage.passwordHint).toBeVisible();
    await expect(loginPage.username).toHaveValue('');
    await expect(loginPage.password).toHaveValue('');
    await expect(loginPage.error).toHaveCount(0);
  });

  test('AUTH-POS-001: signs in successfully with standard_user', async ({ page, loginPage, productsPage, cartPage }) => {
    await login(loginPage, 'standard_user', PASSWORD);
    await expectInventory(page, productsPage, cartPage);
    await expect(productsPage.inventoryList).toBeVisible();
    await expect(productsPage.productCard('Sauce Labs Backpack')).toBeVisible();
  });

  for (const username of ['problem_user', 'performance_glitch_user', 'error_user', 'visual_user']) {
    test(`AUTH-POS-002: signs in successfully with ${username}`, async ({ page, loginPage, productsPage, cartPage }) => {
      await login(loginPage, username, PASSWORD);
      await expectInventory(page, productsPage, cartPage);
      await expect(loginPage.error).toHaveCount(0);
    });
  }

  test('AUTH-POS-003: signs in with the Enter key', async ({ page, loginPage, productsPage, cartPage }) => {
    await loginPage.fillUsername('standard_user');
    await loginPage.fillPassword(PASSWORD);
    await loginPage.submitByEnter();
    await expectInventory(page, productsPage, cartPage);
  });

  test('AUTH-NEG-001: rejects blank username and password', async ({ page, loginPage }) => {
    await loginPage.clickLogin();
    await expect(loginPage.error).toContainText('Epic sadface: Username is required');
    await expect(loginPage.dismissErrorButton).toBeVisible();
    await expect(page).toHaveURL(loginPage.url);
    await expect(loginPage.username).toBeVisible();
    await expect(loginPage.password).toBeVisible();
  });

  test('AUTH-NEG-002: rejects a missing password', async ({ page, loginPage }) => {
    await loginPage.fillUsername('standard_user');
    await loginPage.clickLogin();
    await expect(loginPage.error).toContainText('Epic sadface: Password is required');
    await expect(page).toHaveURL(loginPage.url);
  });

  test('AUTH-NEG-003: rejects a missing username', async ({ page, loginPage }) => {
    await loginPage.fillPassword(PASSWORD);
    await loginPage.clickLogin();
    await expect(loginPage.error).toContainText('Epic sadface: Username is required');
    await expect(page).toHaveURL(loginPage.url);
  });

  test('AUTH-NEG-004: rejects invalid username and password', async ({ page, loginPage }) => {
    await login(loginPage, 'invalid_user', 'wrong_password');
    await expect(loginPage.error).toContainText('Epic sadface: Username and password do not match any user in this service');
    await expect(loginPage.dismissErrorButton).toBeVisible();
    await expect(page).toHaveURL(loginPage.url);
    await expect(loginPage.username).toHaveValue('invalid_user');
    await expect(loginPage.password).toHaveValue('wrong_password');
  });

  test('AUTH-NEG-005: rejects a valid username with a wrong password', async ({ page, loginPage }) => {
    await login(loginPage, 'standard_user', 'incorrect_password');
    await expect(loginPage.error).toContainText('Epic sadface: Username and password do not match any user in this service');
    await expect(page).toHaveURL(loginPage.url);
  });

  test('AUTH-NEG-006: rejects an invalid username with a valid password', async ({ page, loginPage }) => {
    await login(loginPage, 'not_a_demo_user', PASSWORD);
    await expect(loginPage.error).toContainText('Epic sadface: Username and password do not match any user in this service');
    await expect(page).toHaveURL(loginPage.url);
  });

  test('AUTH-NEG-007: rejects a locked-out account', async ({ page, loginPage }) => {
    await login(loginPage, 'locked_out_user', PASSWORD);
    await expect(loginPage.error).toContainText('Epic sadface: Sorry, this user has been locked out.');
    await expect(loginPage.dismissErrorButton).toBeVisible();
    await expect(page).toHaveURL(loginPage.url);
  });

  test('AUTH-ERR-001: dismisses validation and credential errors', async ({ page, loginPage }) => {
    await loginPage.clickLogin();
    await expect(loginPage.error).toBeVisible();
    await loginPage.dismissError();
    await expect(loginPage.error).toHaveCount(0);
    await expect(loginPage.form).toBeVisible();
    await expect(page).toHaveURL(loginPage.url);

    await loginPage.login('invalid_user', 'wrong_password');
    await expect(loginPage.error).toBeVisible();
    await loginPage.dismissError();
    await expect(loginPage.error).toHaveCount(0);

    await loginPage.login('locked_out_user', PASSWORD);
    await expect(loginPage.error).toContainText('locked out');
    await loginPage.dismissError();
    await expect(loginPage.error).toHaveCount(0);
    await expect(page).toHaveURL(loginPage.url);
  });

  test('AUTH-ERR-002: rejects whitespace and uppercase username variants', async ({ page, loginPage }) => {
    await loginPage.fillUsername(' standard_user ');
    await loginPage.fillPassword(PASSWORD);
    await loginPage.clickLogin();
    await expect(loginPage.error).toContainText('Epic sadface: Username and password do not match any user in this service');
    await expect(page).toHaveURL(loginPage.url);

    await loginPage.dismissError();
    await loginPage.fillUsername('STANDARD_USER');
    await loginPage.fillPassword(PASSWORD);
    await loginPage.clickLogin();
    await expect(loginPage.error).toContainText('Epic sadface: Username and password do not match any user in this service');
    await expect(page).toHaveURL(loginPage.url);
  });

  test('AUTH-SEC-001: redirects direct inventory access for an unauthenticated user', async ({ page, loginPage, productsPage }) => {
    await productsPage.goto();
    await expect(page).toHaveURL(loginPage.url);
    await expect(loginPage.form).toBeVisible();
    await expect(loginPage.username).toHaveValue('');
    await expect(loginPage.password).toHaveValue('');
  });

  test('AUTH-SEC-002: preserves the inventory session across refresh', async ({ page, loginPage, productsPage, cartPage }) => {
    await login(loginPage, 'standard_user', PASSWORD);
    await expectInventory(page, productsPage, cartPage);
    await page.reload();
    await expectInventory(page, productsPage, cartPage);
  });

  test('AUTH-SEC-003: logs out and prevents back navigation from exposing inventory', async ({ page, loginPage, productsPage, cartPage }) => {
    await login(loginPage, 'standard_user', PASSWORD);
    await expectInventory(page, productsPage, cartPage);
    await productsPage.openMenu();
    await productsPage.logout();
    await expect(page).toHaveURL(loginPage.url);
    await expect(loginPage.form).toBeVisible();
    await page.goBack();
    await expect(page).toHaveURL(loginPage.url);
    await expect(loginPage.form).toBeVisible();
  });

  test('AUTH-A11Y-001: supports keyboard navigation and Enter submission', async ({ page, loginPage, productsPage, cartPage }) => {
    await loginPage.focusUsername();
    await expect(loginPage.username).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(loginPage.password).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(loginPage.loginButton).toBeFocused();

    await loginPage.fillUsername('standard_user');
    await loginPage.fillPassword(PASSWORD);
    await loginPage.submitByEnter();
    await expectInventory(page, productsPage, cartPage);

    await loginPage.goto();
    await loginPage.clickLogin();
    await expect(loginPage.error).toBeVisible();

    await loginPage.focusDismissErrorButton();
    await expect(loginPage.dismissErrorButton).toBeFocused();
    await loginPage.dismissErrorByEnter();
    await expect(loginPage.error).toHaveCount(0);
  });
});
