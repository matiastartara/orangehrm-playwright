import { Page, Locator } from '@playwright/test'
import { BasePage } from './BasePage';

export class AdminPage extends BasePage {
    readonly username: Locator;
    readonly role: Locator;
    readonly searchButton: Locator;
    readonly employeeName: Locator;
    readonly status: Locator;

    constructor(page: Page) {
        super(page);
        this.username = page.getByRole('textbox').nth(1);
        this.role = page.getByText('-- Select --').first();
        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.employeeName = page.getByRole('textbox', { name: 'Type for hints...' });
        this.status = page.getByText('-- Select --');
    }

    async completeUsername(username: string) {
        await this.username.fill(username);
    }

    async selectRole(roleValue: string) {
        await this.role.click()
        await this.page.locator('.oxd-select-option > span', { hasText: roleValue }).click();
    }

    async search() {
        await this.searchButton.click();
    }

    async completeEmployeeName(employeeName: string) {
        await this.employeeName.fill(employeeName);
        await this.page.locator('.oxd-autocomplete-option > span', { hasText: employeeName }).click();
    }

    async setStatus(status: string) {
        await this.status.click();
        await this.page.locator('.oxd-select-option > span', { hasText: status }).click();
    }

    getRowByUsername(username: string): Locator {
        return this.page.getByRole('row').filter({ hasText: username });
    }

    getCellFromRow(row: Locator, columnIndex: number): Locator {
        return row.getByRole('cell').nth(columnIndex);
    }
}