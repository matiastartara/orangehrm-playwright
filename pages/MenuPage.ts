import { Page, Locator } from '@playwright/test'
import { BasePage } from './BasePage';

export class MenuPage extends BasePage {
    readonly adminMenu: Locator;
    readonly directoryMenu: Locator;

    constructor(page: Page) {
        super(page);
        this.adminMenu = page.getByRole('link', { name: 'Admin' });
        this.directoryMenu = page.getByRole('link', { name: 'Directory' });
    }
    
    async navigateToAdminPage() {   
        await this.adminMenu.click();
    }
    
    async navigateToDirectoryPage() {
        await this.directoryMenu.click();
    }                   
}
