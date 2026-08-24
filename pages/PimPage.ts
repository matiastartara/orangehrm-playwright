import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class PimPage extends BasePage {
    readonly addButton: Locator;
    readonly firstNameInput: Locator;
    readonly middleNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly employeeIdInput: Locator;
    readonly saveButton: Locator;

    constructor(page: Page) {
        super(page);
        this.addButton = page.getByRole('button', { name: 'Add' });
        this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
        this.middleNameInput = page.getByRole('textbox', { name: 'Middle Name' });
        this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
        this.employeeIdInput = page.locator('.oxd-input-group', { hasText: 'Employee Id' }).locator('input');
        this.saveButton = page.getByRole('button', { name: 'Save' });
    }

    async clickAdd() {
        await this.addButton.click();
    }

    async fillEmployeeName(firstName: string, middleName: string, lastName: string) {
        await this.firstNameInput.fill(firstName);
        await this.middleNameInput.fill(middleName);
        await this.lastNameInput.fill(lastName);
    }

    async setEmployeeId(employeeId: string) {
        await this.employeeIdInput.fill(employeeId);
    }

    async save() {
        await this.saveButton.click();
    }
}
