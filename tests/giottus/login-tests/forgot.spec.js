import {test, expect} from '@playwright/test';

test.use({
  video: 'on',
  launchOptions: {
    slowMo: 500
  }
});

test('forgot password test', async ({page}) => {
    await page.goto('https://stage3.giottus.com/')
    await page.getByRole('link', { name: 'login login' }).click();
    await page.getByText('Forgot password?').click();
    await page.getByRole('textbox', { name: 'Email address' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('Selva@giottus.com');
    await page.getByRole('button', { name: 'Reset Password' }).click();
    await page.getByRole('textbox', { name: 'Enter code here' }).click();
    await page.getByRole('textbox', { name: 'Enter code here' }).fill('123456');
    await page.getByRole('textbox', { name: 'Enter New Password' }).click();
    await page.getByRole('textbox', { name: 'Enter New Password' }).fill('Selva@123');
    await page.getByRole('textbox', { name: 'Enter Confirm Password' }).click();
    await page.getByRole('textbox', { name: 'Enter Confirm Password' }).fill('Selva@123');
    await page.getByRole('button', { name: 'Save New Password' }).click();
    await page.getByRole('button', { name: 'Login' }).click();
    await page.close();

});