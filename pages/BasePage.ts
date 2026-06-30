import { Page } from '@playwright/test'

export abstract class BasePage {

    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async waitForPageLoad() {
        await this.page.waitForLoadState('domcontentloaded');
    }

    async getTitle() {
        return await this.page.title();
    }

    async reload() {
        await this.page.reload();
        await this.waitForPageLoad();
    }
}