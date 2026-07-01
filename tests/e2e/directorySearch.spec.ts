import { test, expect } from '@playwright/test';
import { DirectoryPage } from '../../pages/DirectoryPage';
import { MenuPage } from '../../pages/MenuPage';


test('Search and validate user in the directory', async ({ page }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');
    const menuPage = new MenuPage(page);
    const directoryPage = new DirectoryPage(page);
    menuPage.navigateToDirectoryPage();
    await directoryPage.setJobTitle('HR Manager');
    await directoryPage.setLocation('Texas R&D');
    await directoryPage.search();
    await expect(directoryPage.cardResult).not.toHaveCount(0);
    const cardHeader = await directoryPage.getCardHeaderAt(0);
    await expect(cardHeader).toContain('John Smith');

});