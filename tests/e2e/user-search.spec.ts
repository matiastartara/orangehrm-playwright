import { test, expect } from '@playwright/test';
import { AdminPage } from '../../pages/AdminPage';
import { MenuPage } from '../../pages/MenuPage';

test('Go to admin section and search valid user', async ({ page }) => {
  // Arrange
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');
  const menuPage = new MenuPage(page);
  const adminPage = new AdminPage(page);
  await menuPage.navigateToAdminPage();

  // Act
  await adminPage.completeUsername('Admin');
  await adminPage.selectRole('Admin');
  await adminPage.completeEmployeeName('manda');
  await adminPage.setStatus('Enabled');
  await adminPage.search();

  // Assert
  const row = adminPage.getRowByUsername('Admin');
  await expect(adminPage.getCellFromRow(row, 1)).toHaveText('Admin');
  await expect(adminPage.getCellFromRow(row, 2)).toHaveText('Admin');
  await expect(adminPage.getCellFromRow(row, 3)).toContainText('manda');
  await expect(adminPage.getCellFromRow(row, 4)).toHaveText('Enabled');
});

