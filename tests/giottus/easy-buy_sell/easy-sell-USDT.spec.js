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

    //Sucessfully Easy-buy-sell USDT sell folw

    test.skip('Easy Buy Flow', async ({ page }) => {

        

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




    test.skip('Amount was 0', async ({ page }) => {

        

            await page.getByRole('link', { name: 'easy&nbsp;buy/sell easy buy/' }).click();            
            await page.locator('#buyMarkets').getByText('USDT', { exact: true }).click();
            await page.getByText('Sell USDT').click();                      
            await page.getByRole('textbox').first().click();
            await page.getByRole('textbox').first().fill('0');
            await page.getByRole('button', { name: 'Easy Sell' }).click();
            await expect(page.getByText('Invalid price entered!')).toBeVisible();
            await page.getByRole('img', { name: 'close', exact: true }).click();


    });


    test.skip('Min Quantity below 0 to 0.12', async ({ page }) => {

            await page.getByRole('link', { name: 'easy&nbsp;buy/sell easy buy/' }).click();
            await page.getByText('Buy BTCSell BTC1 BTC65,01,094').click();
            await page.locator('#buyMarkets').getByText('USDT', { exact: true }).click();               
            await page.getByText('Sell USDT').click();
            await page.getByRole('textbox').first().click();
            await page.getByRole('textbox').first().fill('0.1');
            await page.getByRole('button', { name: 'Easy Sell' }).click();
            await expect(page.getByText('You cannot sell less than 0.')).toBeVisible();
            await page.getByRole('img', { name: 'close', exact: true }).click();
            


    });

    test.skip('Max Quantity for 10001 ', async ({ page }) => {

            await page.getByRole('link', { name: 'easy&nbsp;buy/sell easy buy/' }).click();
            await page.getByText('Buy BTCSell BTC1 BTC65,01,094').click();
            await page.locator('#buyMarkets div').filter({ hasText: /^USDT$/ }).click();      
            
            await page.getByText('Sell USDT').click();
            await page.getByRole('textbox').first().click();
            await page.getByRole('textbox').first().fill('1,0001');
            await page.getByRole('button', { name: 'Easy Sell' }).click();
            await expect(page.getByText('You cannot sell more than 10,')).toBeVisible();
            await page.getByRole('img', { name: 'close', exact: true }).click();


    });

    test.skip('Buy the USDT update INR account balance and verify the updated INR account balance', async ({ page }) => {

            await page.getByRole('link', { name: 'easy&nbsp;buy/sell easy buy/' }).click();
            await page.getByText('Buy BTCSell BTC1 BTC65,01,094').click();
            await page.locator('#buyMarkets').getByText('USDT', { exact: true }).click();            
            await page.getByText('Sell USDT').click();            
            const usdtBalance = await page.locator('#bsform_2').getByText('USDT Balance:').textContent();            
            const usdtBalanceinput = usdtBalance?.match(/[\d,]+\.?\d*/)?.[0];
            const usdtBalanceValue = parseFloat(usdtBalanceinput.replace(/,/g, ''));            
            await page.getByRole('textbox').first().click();
            const userquantity = await page.getByRole('textbox').first().fill('1'); 
            const userquantityValue = parseFloat(await page.getByRole('textbox').first().inputValue().then(text => text.replace(/,/g, ''))); // Get the user amount and convert to number
            await page.getByRole('button', { name: 'Easy Sell' }).click();
            await page.getByRole('button', { name: 'Confirm Sell' }).click();
            await expect(page.getByText('Simple Order Processed')).toBeVisible();
            await page.getByRole('button', { name: 'Done' }).click();            
            const userdebitedAmountbalance =  usdtBalanceValue - userquantityValue; // Calculate the expected debited amount
            const currentUsdtBalance = await page.locator('#bsform_2').getByText('USDT Balance:').textContent();
            const usdtBalanceinputvalue = currentUsdtBalance?.match(/[\d,]+\.?\d*/)?.[0];
            const currentUsdtBalanceValue = parseFloat(usdtBalanceinputvalue.replace(/,/g, '')); // Get the updated INR balance and convert to number
            await expect(currentUsdtBalanceValue).toBe(userdebitedAmountbalance); 

    });

    


});