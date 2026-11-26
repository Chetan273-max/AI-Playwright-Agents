import type { Locator, Page } from '@playwright/test';

export class ProductsPage {
  readonly url = 'https://www.saucedemo.com/inventory.html';
  readonly heading: Locator;
  readonly inventoryList: Locator;
  readonly productCards: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;
  readonly sortControl: Locator;
  readonly sortOptions: Locator;
  readonly detailName: Locator;
  readonly detailImage: Locator;
  readonly detailDescription: Locator;
  readonly detailPrice: Locator;
  readonly detailsAddButton: Locator;
  readonly detailsRemoveButton: Locator;
  readonly backToProductsButton: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByText('Products', { exact: true });
    this.inventoryList = page.locator('.inventory_list');
    this.productCards = page.locator('.inventory_item');
    this.productNames = this.productCards.locator('.inventory_item_name');
    this.productPrices = this.productCards.locator('.inventory_item_price');
    this.sortControl = page.getByRole('combobox', { name: 'Sort products' });
    this.sortOptions = this.sortControl.locator('option');
    this.detailName = page.locator('.inventory_details_name');
    this.detailImage = page.locator('.inventory_details_img');
    this.detailDescription = page.locator('.inventory_details_desc');
    this.detailPrice = page.locator('.inventory_details_price');
    this.detailsAddButton = page.getByRole('button', { name: 'Add to cart' });
    this.detailsRemoveButton = page.getByRole('button', { name: 'Remove' });
    this.backToProductsButton = page.getByRole('button', { name: 'Back to products' });
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  productCard(name: string): Locator {
    return this.productCards.filter({ hasText: name });
  }

  productPrice(name: string): Locator {
    return this.productCard(name).locator('.inventory_item_price');
  }

  removeFromListingButton(name: string): Locator {
    return this.productCard(name).getByRole('button', { name: 'Remove' });
  }

  async goto(): Promise<void> {
    await this.page.goto(this.url);
  }

  async selectSortOption(value: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortControl.selectOption(value);
  }

  async openProductDetails(productId: string): Promise<void> {
    await this.page.locator(`#item_${productId}_title_link`).click();
  }

  async addProductToCart(name: string): Promise<void> {
    await this.productCard(name).getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeProductFromListing(name: string): Promise<void> {
    await this.productCard(name).getByRole('button', { name: 'Remove' }).click();
  }

  async addDetailsProductToCart(): Promise<void> {
    await this.detailsAddButton.click();
  }

  async removeDetailsProductFromCart(): Promise<void> {
    await this.detailsRemoveButton.click();
  }

  async backToProducts(): Promise<void> {
    await this.backToProductsButton.click();
  }

  async openMenu(): Promise<void> {
    await this.menuButton.click();
  }

  async logout(): Promise<void> {
    await this.logoutLink.click();
  }
}
