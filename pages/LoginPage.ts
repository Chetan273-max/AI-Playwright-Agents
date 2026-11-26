import type { Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly url = 'https://www.saucedemo.com/';
  readonly form: Locator;
  readonly username: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;
  readonly error: Locator;
  readonly dismissErrorButton: Locator;
  readonly acceptedUsernamesHeading: Locator;
  readonly passwordHint: Locator;

  constructor(private readonly page: Page) {
    this.form = page.getByRole('form', { name: 'Login' });
    this.username = page.getByRole('textbox', { name: 'Username' });
    this.password = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.error = page.getByRole('alert');
    this.dismissErrorButton = page.getByRole('button', { name: 'Dismiss error' });
    this.acceptedUsernamesHeading = page.getByRole('heading', { name: 'Accepted usernames are:' });
    this.passwordHint = page.getByText('Password for all users:', { exact: true });
  }

  async goto(): Promise<void> {
    await this.page.goto(this.url);
  }

  async fillUsername(username: string): Promise<void> {
    await this.username.fill(username);
  }

  async fillPassword(password: string): Promise<void> {
    await this.password.fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  async login(username: string, password: string): Promise<void> {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLogin();
  }

  async dismissError(): Promise<void> {
    await this.dismissErrorButton.click();
  }

  async focusUsername(): Promise<void> {
    await this.username.focus();
  }

  async focusLoginButton(): Promise<void> {
    await this.loginButton.focus();
  }

  async focusDismissErrorButton(): Promise<void> {
    await this.dismissErrorButton.focus();
  }

  async submitByEnter(): Promise<void> {
    await this.password.press('Enter');
  }

  async dismissErrorByEnter(): Promise<void> {
    await this.dismissErrorButton.press('Enter');
  }
}
