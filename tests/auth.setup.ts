import { test as setup , expect} from '@playwright/test';
import fs from 'fs';

const authDir = '.auth';
if (!fs.existsSync(authDir)) {
  fs.mkdirSync(authDir, { recursive: true });
}

const authFile = '.auth/user.json';

setup('Authenticate', async ({ page }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    await page.getByRole('textbox', { name: 'Username' }).fill('Admin');
    await page.getByRole('textbox', { name: 'Password' }).fill('admin123')
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByRole('button', { name: 'Upgrade' })).toBeVisible();
    await page.context().storageState({ path: authFile });
})