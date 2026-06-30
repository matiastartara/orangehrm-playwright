import { test, expect } from '@playwright/test';
import { DirectoryPage } from '../../pages/DirectoryPage';


test('Search and validate user in the directory', async ({ page }) => {

    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');
    await page.getByRole('link', { name: 'Directory' }).click();

    const directoryPage = new DirectoryPage(page);
    await directoryPage.setJobTitle('HR Manager');
    await directoryPage.setLocation('Texas R&D');
    await directoryPage.search();

});