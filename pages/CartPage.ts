import type { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly url = 'https://www.saucedemo.com/cart.html';
  readonly cartItems: Locator;
  readonly productNames: Locator;
  readonly continueShoppingButton: Locator;

  constructor(private readonly page: Page) {
    this.cartItems = page.locator('.cart_item');
    this.productNames = this.cartItems.locator('.inventory_item_name');
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
  }

  cartButton(itemCount: number): Locator {
    const accessibleName = itemCount === 0 ? 'Cart, empty' : `Cart, ${itemCount} items`;
    return this.page.getByRole('button', { name: accessibleName });
  }

  async open(itemCount: number): Promise<void> {
    await this.cartButton(itemCount).click();
  }

  async removeProduct(name: string): Promise<void> {
    await this.cartItems
      .filter({ hasText: name })
      .getByRole('button', { name: 'Remove' })
      .click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }
}
