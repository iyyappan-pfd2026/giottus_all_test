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

// Successfully "User Login Flow" for POM Concept

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

test.describe('Giottus Easy Sell USDT Flow', () => {


    test('Easy Buy Flow', async ({ page }) => {

        

            await page.getByRole('link', { name: 'easy&nbsp;buy/sell easy buy/' }).click();            
            await page.locator('#buyMarkets').getByText('USDT', { exact: true }).click();
            await page.getByText('Sell USDT').click();
            await page.getByRole('textbox').first().click();
            await page.getByRole('textbox').first().fill('1');
            await page.getByRole('button', { name: 'Easy Sell' }).click();
            await page.getByRole('button', { name: 'Confirm Sell' }).click();
            await expect(page.getByText('Simple Order Processed')).toBeVisible();
            await page.getByRole('button', { name: 'Done' }).click();    



    });


});