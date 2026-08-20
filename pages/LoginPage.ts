import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly invalidCredentialsMessage: Locator;
    readonly requiredErrorMessages: Locator;
    readonly dashboardHeading: Locator;

    constructor(page: Page) {
        super(page);
        this.usernameInput = page.getByRole('textbox', { name: 'Username' });
        this.passwordInput = page.getByRole('textbox', { name: 'Password' });
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.invalidCredentialsMessage = page.getByText('Invalid credentials');
        this.requiredErrorMessages = page.getByText('Required');
        this.dashboardHeading = page.getByRole('heading', { name: 'Dashboard' });
    }

    async navigateToLogin() {
        await this.page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
        await this.waitForPageLoad();
    }

    async forceLogout() {
        await this.page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/logout');
        await this.navigateToLogin();
    }

    async login(username?: string, password?: string) {
        if (username !== undefined) {
            await this.usernameInput.fill(username);
        }
        if (password !== undefined) {
            await this.passwordInput.fill(password);
        }
        await this.loginButton.click();
    }
}
