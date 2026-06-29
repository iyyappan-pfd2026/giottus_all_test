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


test.describe('Giottus Futures BTC/USDT Short Market Order Flow', () => {

       

        test.skip('Successful Short Order purchase for USDT amount', async ({ page }) => {
            
            await page.getByRole('link', { name: 'futures futures Sub menu' }).click();                    
            await page.getByText('SHORT', { exact: true }).click();
            await page.locator('.orderSizeInput').nth(1).click();
            await page.locator('.orderSizeInput').nth(1).fill('300');
            await page.getByRole('button', { name: 'Sell / Short' }).click();
            await page.getByRole('button', { name: 'Confirm short' }).click();
            await page.getByRole('button', { name: 'Confirm long' }).click();    
            await expect(page.getByText('Order created successfully.')).toBeVisible();

        });

        test.skip('Successful Short Order purchase for BTC Quantity', async ({ page }) => {
            
            await page.getByRole('link', { name: 'futures futures Sub menu' }).click();     
            await page.getByText('SHORT', { exact: true }).click();
            await page.getByRole('combobox').selectOption('BTC');
            await page.locator('.orderSizeInput').nth(1).click();  
            await page.locator('.orderSizeInput').nth(1).fill('0.0010');
            await page.getByRole('button', { name: 'Sell / Short' }).click();
            await page.getByRole('button', { name: 'Confirm short' }).click();
            await expect(page.getByText('Order created successfully.')).toBeVisible();       


        });

       test.skip('Should display minimum amount error', async ({ page }) => {

            
            await page.getByRole('link', { name: 'futures futures Sub menu' }).click();                    
            await page.getByText('SHORT', { exact: true }).click();
            const orderSizeInput = await page.locator('.orderSizeInput').nth(1).getAttribute('placeholder');
            const amount = parseFloat(orderSizeInput.match(/[\d,]+/)[0].replace(/,/g, ''));
            const newAmount = amount - 10;
            await page.locator('.orderSizeInput').nth(1).click();  
            await page.locator('.orderSizeInput').nth(1).fill(newAmount.toString()); // 1 to below Min amount USDT
            await page.getByRole('button', { name: 'Sell / Short' }).click();
            await expect(page.getByText(/Minimum amount should be/)).toBeVisible();
            await page.getByRole('img', { name: 'close', exact: true }).click();

        });


        test.skip('Should display minimum quantity error', async ({ page }) => {

            await page.getByRole('link', { name: 'futures futures Sub menu' }).click();     
            await page.getByText('SHORT', { exact: true }).click();
            await page.getByRole('combobox').selectOption('BTC');
            const minQuantity = await page.locator('.orderSizeInput').nth(1).getAttribute('placeholder');
            const quantity = minQuantity?.match(/[\d,]+\.?\d*/)?.[0];
            const newQuantity = quantity - 0.0001;
            await page.locator('.orderSizeInput').nth(1).click();  
            await page.locator('.orderSizeInput').nth(1).fill(newQuantity.toString()); 
            await page.getByRole('button', { name: 'Sell / Short' }).click();
            await expect(page.getByText(/Minimum quantity should be/)).toBeVisible();
            await page.getByRole('img', { name: 'close', exact: true }).click();

        });


        test.skip('Should display error for no amount and quantity', async ({ page }) => {

            await page.getByRole('link', { name: 'futures futures Sub menu' }).click();     
            await page.getByText('SHORT', { exact: true }).click();            
            await page.getByRole('button', { name: 'Sell / Short' }).click();
            await expect(page.getByText('Invalid quantity entered!')).toBeVisible();
            await page.getByRole('img', { name: 'close', exact: true }).click();
            await page.getByRole('combobox').selectOption('BTC');
            await page.getByRole('button', { name: 'Sell / Short' }).click();
            await expect(page.getByText('Invalid quantity entered!')).toBeVisible();
            await page.getByRole('img', { name: 'close', exact: true }).click();

        });

        test.skip('Should display error for amount and quantity was 0', async ({ page }) => {

            await page.getByRole('link', { name: 'futures futures Sub menu' }).click();     
            await page.getByText('SHORT', { exact: true }).click();   
            await page.locator('.orderSizeInput').nth(1).click();  
            await page.locator('.orderSizeInput').nth(1).fill('0');         
            await page.getByRole('button', { name: 'Sell / Short' }).click();
            await expect(page.getByText('Invalid quantity entered!')).toBeVisible();
            await page.getByRole('img', { name: 'close', exact: true }).click();
            await page.getByRole('combobox').selectOption('BTC');
            await page.locator('.orderSizeInput').nth(1).click();  
            await page.locator('.orderSizeInput').nth(1).fill('0'); 
            await page.getByRole('button', { name: 'Sell / Short' }).click();
            await expect(page.getByText('Invalid quantity entered!')).toBeVisible();
            await page.getByRole('img', { name: 'close', exact: true }).click();

        });


});


test.describe('Giottus Futures BTC/USDT Short Limit Order Flow', () => {



        test.skip('Successful Short Limit Order purchase', async ({ page }) => {
        
            await page.getByRole('link', { name: 'futures futures Sub menu' }).click();
            await page.getByText('SHORT', { exact: true }).click();
            await page.locator('#bsform_2').getByText('Limit Order').click();
            const currentPrice = await page.getByRole('textbox').first().inputValue();
            const updatedPrice = (parseFloat(currentPrice.replace(/,/g, '')) - 500)
            await page.getByRole('textbox').first().click();
            await page.getByRole('textbox').first().fill(updatedPrice.toString());
            const orderSizeInput = await page.locator('.orderSizeInput').nth(0).getAttribute('placeholder');
            const amount = parseFloat(orderSizeInput.match(/[\d,]+/)[0].replace(/,/g, ''));
            const newAmount = amount + 200;
            await page.locator('.orderSizeInput').nth(1).click();  
            await page.locator('.orderSizeInput').nth(1).fill(newAmount.toString()); 
            await page.getByRole('button', { name: 'Sell / Short' }).click();
            await page.getByRole('button', { name: 'Confirm short' }).click();
            await expect(page.getByText('Order created successfully.')).toBeVisible();

        });
});