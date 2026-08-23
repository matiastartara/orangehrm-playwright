import { test, expect } from '@playwright/test';
import { DirectoryPage } from '../../pages/DirectoryPage';
import { MenuPage } from '../../pages/MenuPage';


test('Search and validate user in the directory', async ({ page }) => {
  // Arrange
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');
  await expect(page).toHaveURL(/.*dashboard/);
  const menuPage = new MenuPage(page);
  const directoryPage = new DirectoryPage(page);
  await menuPage.navigateToDirectoryPage();

  // Act
  await directoryPage.setJobTitle('HR Manager');
  await directoryPage.setLocation('Texas R&D');
  await directoryPage.search();

  // Assert
  await expect(directoryPage.cardResult).not.toHaveCount(0);
  const cardHeader = await directoryPage.getCardHeaderAt(0);
  await expect(cardHeader).toContain('manda akhil user');
});