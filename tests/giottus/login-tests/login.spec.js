import { test, expect } from '@playwright/test'
import { permission } from 'node:process';

test.use({
  permissions: ['geolocation'],
  geolocation: {
    latitude: 13.0827,
    longitude: 80.2707
  }
});

test.use({
  video: 'on',
  launchOptions: {
    slowMo: 500
  }
});

test('login test', async ({page}) => {

   
    await page.goto('https://stage3.giottus.com/')
    await page.getByRole('link', { name: 'login login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('Selva@giottus.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('Selva@123');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.locator('div').filter({ hasText: /^Allow Giottus to access your location$/ }).click();
    await page.getByRole('textbox', { name: 'Enter code here' }).fill('123456');
    await page.getByRole('link', { name: 'more more' }).click();
    await page.getByRole('link', { name: 'logout logout' }).click();
    await page.close();    
    
})