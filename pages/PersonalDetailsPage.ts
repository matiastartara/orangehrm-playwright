import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class PersonalDetailsPage extends BasePage {
    readonly otherIdInput: Locator;
    readonly savePersonalDetailsButton: Locator;
    readonly successToast: Locator;

    constructor(page: Page) {
        super(page);
        this.otherIdInput = page.locator('.oxd-input-group', { hasText: 'Other Id' }).locator('input');
        this.savePersonalDetailsButton = page.locator('form').filter({ hasText: 'Employee Full Name' }).getByRole('button', { name: 'Save' });
        this.successToast = page.locator('.oxd-toast--success');
    }

    async fillFirstSubsectionDetails(otherId: string) {
        await this.otherIdInput.fill(otherId);
    }

    async savePersonalDetails() {
        await this.savePersonalDetailsButton.click();
    }
}
