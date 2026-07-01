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
        this.jobTitle = page.locator('.oxd-icon.bi-caret-down-fill.oxd-select-text--arrow').first();
        this.location = page.locator('div:nth-child(3) > .oxd-input-group > div:nth-child(2) > .oxd-select-wrapper > .oxd-select-text > .oxd-select-text--after > .oxd-icon');
        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.cardResult = page.locator('.orangehrm-container .orangehrm-directory-card');
    }

    async setJobTitle(title: string) {
        await this.jobTitle.click();
        await this.page.locator('.oxd-grid-item.oxd-grid-item--gutters .oxd-select-option span', { hasText: title }).click();
    }

    async setLocation(location: string) {
        await this.location.click();
        await this.page.locator('.oxd-grid-item.oxd-grid-item--gutters .oxd-select-option span', { hasText: location }).click();
    }

    async search() {
        await this.searchButton.click();
        await this.page.waitForResponse(response =>
            response.url().includes('/api/v2/directory/employees') &&
            response.status() === 200
        );
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