import { Page, Locator } from '@playwright/test'
import { BasePage } from './BasePage';

export class DirectoryPage extends BasePage {
    readonly employeeName: Locator;
    readonly jobTitle: Locator;
    readonly location: Locator;
    readonly searchButton: Locator;
    readonly cardResult: Locator;

    constructor(page: Page) {
        super(page);
        this.employeeName = page.getByText('Employee Name');
        this.jobTitle = page.locator('.oxd-input-group', { hasText: 'Job Title' }).locator('.oxd-select-wrapper');
        this.location = page.locator('.oxd-input-group', { hasText: 'Location' }).locator('.oxd-select-wrapper');
        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.cardResult = page.locator('.orangehrm-container .orangehrm-directory-card');
    }

    async setJobTitle(title: string) {
        await this.jobTitle.click();
        await this.page.locator('.oxd-select-dropdown .oxd-select-option', { hasText: title }).click();
    }

    async setLocation(location: string) {
        await this.location.click();
        await this.page.locator('.oxd-select-dropdown .oxd-select-option', { hasText: location }).click();
    }

    async search() {
        await Promise.all([
            this.page.waitForResponse(response =>
                response.url().includes('/api/v2/directory/employees') &&
                (response.status() === 200 || response.status() === 304)
            ),
            this.searchButton.click(),
        ]);
    }

    async getCardResultSize(): Promise<number> {
        return await this.cardResult.count();
    }

    getCardResultAt(index: number): Locator {
        return this.cardResult.nth(index);
    }

    async getCardHeaderAt(index: number): Promise<string> {
        return await this.getCardResultAt(index).locator('.orangehrm-directory-card-header').innerText();
    }
}