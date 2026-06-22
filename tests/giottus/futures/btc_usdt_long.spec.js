import { test, expect } from '@playwright/test'
import { permission } from 'node:process';
import  LoginPage  from '../../../pages/LoginPage.js';


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
        slowMo: 1000
    }
});

test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.openWebsite();
    await login.clickLogin();
    await login.login(
        'iyyappan@giottus.com',
        'Iyyappan@123'
    );
    await login.enterOtp('123456');
    await expect(page).toHaveURL(/dashboard/);

})

test('sample test', async ({ page }) => {

    
    await page.getByRole('link', { name: 'futures futures Sub menu' }).click();
    await page.getByText('LONG', { exact: true }).click();
    await page.locator('.orderSizeInput').nth(0).click();
    await page.locator('.orderSizeInput').nth(0).fill('300');
    await page.getByRole('button', { name: 'Buy / Long' }).click();
    await page.getByRole('button', { name: 'Confirm long' }).click();    
    await expect(page.getByText('Order created successfully.')).toBeVisible();

});