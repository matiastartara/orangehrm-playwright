import { test, expect } from '@playwright/test';
import { MenuPage } from '../../pages/MenuPage';
import { PimPage } from '../../pages/PimPage';
import { PersonalDetailsPage } from '../../pages/PersonalDetailsPage';

test('Add new employee and complete personal details subsection', async ({ page }) => {
  // Arrange
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');
  await expect(page).toHaveURL(/.*dashboard/);

  const menuPage = new MenuPage(page);
  const pimPage = new PimPage(page);
  const personalDetailsPage = new PersonalDetailsPage(page);

  await menuPage.navigateToPimPage();

  // Act
  await pimPage.clickAdd();
  await pimPage.fillEmployeeName('John', 'Doe', 'Smith');
  await pimPage.save();

  await personalDetailsPage.fillFirstSubsectionDetails('9876');
  await personalDetailsPage.savePersonalDetails();

  // Assert
  await expect(personalDetailsPage.successToast).toBeVisible();
});
