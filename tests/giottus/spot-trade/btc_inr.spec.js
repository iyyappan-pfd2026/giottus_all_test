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


test.describe('Spot Trade BTC/INR Limit Order', () => { 

            test('Successful spot trade Buy BTC/INR', async ({ page }) => {

                
                await page.getByRole('link', { name: 'trade trade Sub menu' }).click();
                await page.getByText('Buy BTC').click();        
                await page.getByRole('textbox').nth(1).click();
                await page.getByRole('textbox').nth(1).fill('300'); // Enter the amount of INR you want to spend
                const inrAmount = await page.getByRole('textbox').nth(1).inputValue();
                const inramount = inrAmount?.replace(/,/g, '').toString(); // Format the INR amount to 2 decimal places
                await page.getByRole('textbox').first().click();
                await page.getByRole('textbox').first().fill('20'); // Enter the amount of BTC you want to buy
                const btcAmount = await page.getByRole('textbox').first().inputValue();  
                const btcamount = btcAmount?.replace(/,/g, '').toString(); // Format the BTC amount to 8 decimal places      
                await page.getByRole('textbox').nth(2).click();
                await page.getByRole('button', { name: 'Buy Now Right Arrow' }).click();        
                await expect(page.getByText('Entered price is greater than')).toBeVisible();
                await page.getByRole('button', { name: 'ContinueRight Arrow' }).click();
                await page.getByRole('button', { name: 'Confirm Buy' }).click();
                await expect(page.getByText(`Your Buy order of ${btcAmount}`)).toBeVisible();
                await expect(page.locator('#table_26').getByText(inramount)).toBeVisible(); 
                await expect(page.locator('#table_2').getByText(inramount)).toBeVisible(); 


            });


            test('spot trade Buy BTC/INR Empty Fields', async ({ page }) => {

                
                await page.getByRole('link', { name: 'trade trade Sub menu' }).click();
                await page.getByText('Buy BTC').click();         
                await page.getByRole('textbox').nth(1).click();
                await page.getByRole('textbox').nth(1).fill('');
                await page.getByRole('textbox').nth(2).click();
                await page.getByRole('textbox').nth(2).fill('');
                await page.getByRole('button', { name: 'Buy Now Right Arrow' }).click();
                await expect(page.getByText('Invalid quantity entered!')).toBeVisible();
                await page.getByRole('img', { name: 'close', exact: true }).click();

            });

            test('spot trade Buy BTC/INR less than minimum quantity', async ({ page }) => {

                
                await page.getByRole('link', { name: 'trade trade Sub menu' }).click();
                await page.pause();
                await page.getByText('Buy BTC').click();         
                await page.getByRole('textbox').nth(1).click();
                await page.getByRole('textbox').nth(1).fill('100');
                await page.getByRole('textbox').first().click();
                await page.getByRole('textbox').first().fill('0.00000099'); // minimum quantity is 0.00000100 BTC
                await page.getByRole('textbox').nth(2).click();              
                await page.getByRole('button', { name: 'Buy Now Right Arrow' }).click(); 
                await expect(page.getByText('Minimum quantity should be 0.00000100')).toBeVisible();
                await page.getByRole('img', { name: 'close', exact: true }).click();

            });


});
