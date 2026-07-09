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

    test('Successful spot trade', async ({ page }) => {

        
        await page.getByRole('link', { name: 'trade trade Sub menu' }).click();
        await page.getByText('Buy BTC').click();
        await page.locator('div').filter({ hasText: /^BTC\/INR$/ }).click();        
        await page.getByText('USDT', { exact: true }).click();
        await page.getByRole('link', { name: 'BTC BTC/USDT' }).click();
        await expect(page).toHaveURL(/tradeview\/BTC-USDT/);


    });