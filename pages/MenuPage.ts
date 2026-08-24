import { Page, Locator } from '@playwright/test'
import { BasePage } from './BasePage';

export class MenuPage extends BasePage {
    readonly adminMenu: Locator;
    readonly pimMenu: Locator;
    readonly directoryMenu: Locator;

    constructor(page: Page) {
        super(page);
        this.adminMenu = page.getByRole('link', { name: 'Admin' });
        this.directoryMenu = page.getByRole('link', { name: 'Directory' });
        this.pimMenu = page.getByRole('link', { name: 'PIM' });
    }
    
    async navigateToAdminPage() {   
        await Promise.all([
            this.page.waitForResponse(response =>
                response.url().includes('/api/v2/admin/users') &&
                (response.status() === 200 || response.status() === 304)
            ),
            this.adminMenu.click(),
        ]);
    }
    
    async navigateToDirectoryPage() {
        await Promise.all([
            this.page.waitForResponse(response =>
                response.url().includes('/api/v2/directory/employees') &&
                (response.status() === 200 || response.status() === 304)
            ),
            this.directoryMenu.click(),
        ]);
    }

    async navigateToPimPage() {
        await Promise.all([
            this.page.waitForResponse(response =>
                response.url().includes('/api/v2/pim/employees') &&
                (response.status() === 200 || response.status() === 304)
            ),
            this.pimMenu.click(),
        ]);
    }
}
