import { test, expect } from '@playwright/test';
import { AdminPage } from '../../pages/AdminPage';

test('Go to admin section and search valid user', async ({ page }) => {
   await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');
   await page.getByRole('link', { name: 'Admin' }).click();

   const adminPage = new AdminPage(page);
   await adminPage.completeUsername('Admin');
   await adminPage.selectRole('Admin');
   await adminPage.completeEmployeeName('Abril Vazquez User');
   await adminPage.setStatus('Enabled');
   await adminPage.search();

   const row = adminPage.getRowByUsername('Admin');
   await expect(adminPage.getCellFromRow(row, 1)).toHaveText('Admin');
   await expect(adminPage.getCellFromRow(row, 2)).toHaveText('Admin');
   await expect(adminPage.getCellFromRow(row, 3)).toHaveText('Abril user');
   await expect(adminPage.getCellFromRow(row, 4)).toHaveText('Enabled');

});

