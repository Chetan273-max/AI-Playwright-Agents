// spec: spec/products.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';
import type { CartPage } from '../pages/CartPage';
import type { LoginPage } from '../pages/LoginPage';
import type { ProductsPage } from '../pages/ProductsPage';

const PASSWORD = 'secret_sauce';

const products = [
  { name: 'Sauce Labs Backpack', price: '$29.99', id: '4' },
  { name: 'Sauce Labs Bike Light', price: '$9.99', id: '0' },
  { name: 'Sauce Labs Bolt T-Shirt', price: '$15.99', id: '1' },
  { name: 'Sauce Labs Fleece Jacket', price: '$49.99', id: '5' },
  { name: 'Sauce Labs Onesie', price: '$7.99', id: '2' },
  { name: 'Test.allTheThings() T-Shirt (Red)', price: '$15.99', id: '3' },
] as const;

async function login(page: Page, loginPage: LoginPage, productsPage: ProductsPage): Promise<void> {
  await loginPage.goto();
  await loginPage.login('standard_user', PASSWORD);
  await expect(page).toHaveURL(productsPage.url);
  await expect(productsPage.heading).toBeVisible();
}

async function expectCartCount(cartPage: CartPage, count: number): Promise<void> {
  await expect(cartPage.cartButton(count)).toBeVisible();
}

test.describe('Products and Sorting', () => {
  test.beforeEach(async ({ page, loginPage, productsPage }) => {
    await login(page, loginPage, productsPage);
  });

  test('TC-PROD-001 - Verify all six products are displayed', async ({ page, productsPage, cartPage }) => {
    // 1. Log in with standard_user and secret_sauce, then open the Products page.
    await expect(productsPage.productCards).toHaveCount(6);
    await expectCartCount(cartPage, 0);

    // 2. Record the visible product names from the listing.
    await expect(productsPage.productNames).toHaveText(products.map(({ name }) => name));

    // 3. Refresh the Products page and repeat the count and name check.
    await page.reload();
    await expect(productsPage.productCards).toHaveCount(6);
    await expect(productsPage.productNames).toHaveText(products.map(({ name }) => name));
    await expectCartCount(cartPage, 0);
  });

  test('TC-PROD-002 - Verify product names and prices', async ({ productsPage }) => {
    // 1. Starting from a fresh logged-in session, inspect each of the six product cards.
    await expect(productsPage.productCards).toHaveCount(6);
    await expect(productsPage.productNames).toHaveText(products.map(({ name }) => name));
    await expect(productsPage.productPrices).toHaveText(products.map(({ price }) => price));

    // 2. Record the exact displayed price for Sauce Labs Backpack.
    await expect(productsPage.productPrice('Sauce Labs Backpack')).toHaveText('$29.99');

    // 3. Record and compare the displayed prices for the other five products.
    for (const product of products.slice(1)) {
      await expect(productsPage.productPrice(product.name)).toHaveText(product.price);
    }

    // 4. Open the Products page again after reviewing all cards.
    await productsPage.goto();
    await expect(productsPage.productNames).toHaveText(products.map(({ name }) => name));
    await expect(productsPage.productPrices).toHaveText(products.map(({ price }) => price));
  });

  test('TC-SORT-001 - Verify all four product sorting options', async ({ page, productsPage }) => {
    const sort = productsPage.sortControl;

    // 1. Open the Sort products control on a fresh Products page.
    await expect(sort).toHaveValue('az');

    // 2. Inspect the available choices without selecting one.
    await expect(productsPage.sortOptions).toHaveText([
      'Name (A to Z)',
      'Name (Z to A)',
      'Price (low to high)',
      'Price (high to low)',
    ]);

    // 3. Select Name (A to Z).
    await productsPage.selectSortOption('az');
    await expect(sort).toHaveValue('az');
    await expect(productsPage.productNames).toHaveText([
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt',
      'Sauce Labs Fleece Jacket',
      'Sauce Labs Onesie',
      'Test.allTheThings() T-Shirt (Red)',
    ]);

    // 4. Select Name (Z to A).
    await productsPage.selectSortOption('za');
    await expect(sort).toHaveValue('za');
    await expect(productsPage.productNames).toHaveText([
      'Test.allTheThings() T-Shirt (Red)',
      'Sauce Labs Onesie',
      'Sauce Labs Fleece Jacket',
      'Sauce Labs Bolt T-Shirt',
      'Sauce Labs Bike Light',
      'Sauce Labs Backpack',
    ]);

    // 5. Select Price (low to high).
    await productsPage.selectSortOption('lohi');
    await expect(sort).toHaveValue('lohi');
    await expect(productsPage.productPrices).toHaveText([
      '$7.99', '$9.99', '$15.99', '$15.99', '$29.99', '$49.99',
    ]);

    // 6. Select Price (high to low).
    await productsPage.selectSortOption('hilo');
    await expect(sort).toHaveValue('hilo');
    await expect(productsPage.productPrices).toHaveText([
      '$49.99', '$29.99', '$15.99', '$15.99', '$9.99', '$7.99',
    ]);

    // 7. Refresh the page after selecting a sort option.
    await page.reload();
    await expect(sort).toHaveValue('az');
  });
});

test.describe('Product Details and Cart', () => {
  test.beforeEach(async ({ page, loginPage, productsPage }) => {
    await login(page, loginPage, productsPage);
  });

  test('TC-DETAIL-001 - Verify navigation to product details', async ({ page, productsPage }) => {
    // 1. From Products, select the product details control for each of the six products.
    for (const product of products) {
      await productsPage.openProductDetails(product.id);
      await expect(productsPage.detailName).toHaveText(product.name);
      await expect(productsPage.detailImage).toHaveAttribute('alt', product.name);
      await expect(productsPage.detailDescription).toBeVisible();
      await expect(productsPage.detailPrice).toHaveText(product.price);
      await expect(productsPage.detailsAddButton).toBeVisible();
      await expect(productsPage.backToProductsButton).toBeVisible();
      await productsPage.backToProducts();
      await expect(page).toHaveURL(productsPage.url);
    }

    // 2. On the Sauce Labs Backpack details page, compare the displayed information with the Products card.
    await productsPage.openProductDetails(products[0].id);
    await expect(productsPage.detailName).toHaveText('Sauce Labs Backpack');
    await expect(productsPage.detailPrice).toHaveText('$29.99');

    // 3. Use Back to products and repeat for the remaining five products.
    await productsPage.backToProducts();
    await expect(page).toHaveURL(productsPage.url);
  });

  test('TC-CART-001 - Verify adding products to the cart', async ({ page, productsPage, cartPage }) => {
    // 1. Start with an empty cart and open the Sauce Labs Backpack details page.
    await expectCartCount(cartPage, 0);
    await productsPage.openProductDetails(products[0].id);
    await expect(productsPage.detailsAddButton).toBeVisible();

    // 2. Click Add to cart.
    await productsPage.addDetailsProductToCart();
    await expect(productsPage.detailsRemoveButton).toBeVisible();
    await expectCartCount(cartPage, 1);

    // 3. Return to Products and add each of the other five products once.
    await productsPage.backToProducts();
    for (const [index, product] of products.slice(1).entries()) {
      await productsPage.addProductToCart(product.name);
      await expect(productsPage.removeFromListingButton(product.name)).toBeVisible();
      await expectCartCount(cartPage, index + 2);
    }

    // 4. Open the cart.
    await cartPage.open(6);
    await expect(page).toHaveURL(cartPage.url);
    await expect(cartPage.cartItems).toHaveCount(6);
    await expect(cartPage.productNames).toHaveText(products.map(({ name }) => name));
  });

  test('TC-CART-002 - Verify removing products from the cart and product details', async ({ page, productsPage, cartPage }) => {
    // 1. Add Sauce Labs Backpack and open its details page.
    await productsPage.openProductDetails(products[0].id);
    await productsPage.addDetailsProductToCart();
    await expect(productsPage.detailsRemoveButton).toBeVisible();
    await expectCartCount(cartPage, 1);

    // 2. Click Remove on the product details page.
    await productsPage.removeDetailsProductFromCart();
    await expect(productsPage.detailsAddButton).toBeVisible();
    await expectCartCount(cartPage, 0);

    // 3. Add Sauce Labs Backpack again, open the cart, and click Remove for the cart line item.
    await productsPage.addDetailsProductToCart();
    await cartPage.open(1);
    await cartPage.removeProduct(products[0].name);
    await expect(cartPage.cartItems).toHaveCount(0);
    await expectCartCount(cartPage, 0);

    // 4. Repeat add and remove once for each of the other five products.
    for (const product of products.slice(1)) {
      await cartPage.continueShopping();
      await productsPage.addProductToCart(product.name);
      await expectCartCount(cartPage, 1);
      await cartPage.open(1);
      await cartPage.removeProduct(product.name);
      await expect(cartPage.cartItems).toHaveCount(0);
      await expectCartCount(cartPage, 0);
    }
  });
});

test('authenticatedPage fixture opens the Products page', async ({ authenticatedPage }) => {
  await expect(authenticatedPage).toHaveURL(/inventory/);
  await expect(authenticatedPage.getByText('Products', { exact: true })).toBeVisible();
});

test.describe('Products with saved authentication', () => {
  test.use({ storageState: 'playwright/.auth/saucedemo.json' });

  test('Verify products using saved authentication', async ({ productsPage }) => {
    await productsPage.goto();
    await expect(productsPage.heading).toBeVisible();
  });
});
