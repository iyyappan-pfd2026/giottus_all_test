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

test.describe('Giottus Futures BTC/USDT Long Market Order Flow', () => {

        // Successfully "Long Order purchase Flow" for BTC/USDT in futures flow.

        test.skip('Successful Long Order purchase', async ({ page }) => {

            
            await page.getByRole('link', { name: 'futures futures Sub menu' }).click();
            await page.getByText('LONG', { exact: true }).click();
            await page.locator('.orderSizeInput').nth(0).click();
            await page.locator('.orderSizeInput').nth(0).fill('300'); // Valid amount 300 USDT to 20,00,000 USDT
            await page.getByRole('button', { name: 'Buy / Long' }).click();
            await page.getByRole('button', { name: 'Confirm long' }).click();    
            await expect(page.getByText('Order created successfully.')).toBeVisible();

        });

        // Successfully "Amount below minimum" enter verify the error message in futures flow.

        test.skip('Should display minimum amount error', async ({ page }) => {

            
            await page.getByRole('link', { name: 'futures futures Sub menu' }).click();
            await page.getByText('LONG', { exact: true }).click();
            const orderSizeInput = await page.locator('.orderSizeInput').nth(0).getAttribute('placeholder');
            const amount = parseFloat(orderSizeInput.match(/[\d,]+/)[0].replace(/,/g, ''));
            const newAmount = amount - 100;
            await page.locator('.orderSizeInput').nth(0).click();  
            await page.locator('.orderSizeInput').nth(0).fill(newAmount.toString()); // 1 to below Min amount USDT
            await page.getByRole('button', { name: 'Buy / Long' }).click();
            await expect(page.getByText(/Minimum amount should be/)).toBeVisible();
            await page.getByRole('img', { name: 'close', exact: true }).click();

        });

        // Successfully "Quantity below minimum" enter verify the error message in futures flow.

        test.skip('Should display minimum quantity error', async ({ page }) => {

            
            await page.getByRole('link', { name: 'futures futures Sub menu' }).click();
            await page.getByText('LONG', { exact: true }).click();       
            await page.getByRole('combobox').selectOption('BTC');
            await page.getByRole('textbox', { name: 'Min Qty: 0.004 BTC' }).click();
            await page.getByRole('textbox', { name: 'Min Qty: 0.004 BTC' }).fill('0.001'); // 0.001 to below Min quantity BTC
            await page.getByRole('button', { name: 'Buy / Long' }).click();
            expect(page.getByText('Minimum quantity should be 0.004 BTC')).toBeVisible();
            await page.getByRole('img', { name: 'close', exact: true }).click();

        });

        // Successfully "No Enter amount and Quantity" enter verify the error message in futures flow.

        test.skip('Should display error for no amount and quantity', async ({ page }) => {
        
            await page.getByRole('link', { name: 'futures futures Sub menu' }).click();
            await page.getByText('LONG', { exact: true }).click();                          
            await page.getByRole('button', { name: 'Buy / Long' }).click();
            await expect(page.getByText('Invalid quantity entered!')).toBeVisible();
            await page.getByRole('img', { name: 'close', exact: true }).click();
            await page.getByRole('combobox').selectOption('BTC');
            await page.getByRole('button', { name: 'Buy / Long' }).click();
            await expect(page.getByText('Invalid quantity entered!')).toBeVisible();
            await page.getByRole('img', { name: 'close', exact: true }).click();

        });

});

test.describe('Giottus Futures BTC/USDT Short Limit Order Flow', () => {

        // Successfully "Short Limit Order purchase Flow" for BTC/USDT in futures flow.

        test.skip('Successful Short Limit Order purchase', async ({ page }) => {
        
        await page.getByRole('link', { name: 'futures futures Sub menu' }).click();
        await page.getByText('LONG', { exact: true }).click();  

        await page.locator('#bsform_1').getByText('Limit Order').click();
        const currentPrice = await page.getByRole('textbox').first().inputValue();
        const updatedPrice = (parseFloat(currentPrice.replace(/,/g, '')) + 1000).toString(); // Add to the current price
        await page.getByRole('textbox').first().click();
        await page.getByRole('textbox').first().fill(updatedPrice.toString()); // Enter a price higher than the current price

        const orderSizeInput = await page.locator('.orderSizeInput').nth(0).getAttribute('placeholder');
        const amount = parseFloat(orderSizeInput.match(/[\d,]+/)[0].replace(/,/g, ''));
        const newAmount = amount + 100;
        await page.locator('.orderSizeInput').nth(0).click();  
        await page.locator('.orderSizeInput').nth(0).fill(newAmount.toString());     
        await page.getByRole('button', { name: 'Buy / Long' }).click();    
        await page.getByRole('button', { name: 'Confirm long' }).click();
        await expect(page.getByText('Order created successfully.')).toBeVisible();

        });

        // Successfully "No Enter amount and Quantity" enter verify the error message in futures flow.

        test.skip('Should display error for no amount and quantity', async ({ page }) => {
        
            await page.getByRole('link', { name: 'futures futures Sub menu' }).click();
            await page.getByText('LONG', { exact: true }).click();    
            await page.locator('#bsform_1').getByText('Limit Order').click();                      
            await page.getByRole('button', { name: 'Buy / Long' }).click();
            await expect(page.getByText('Invalid quantity entered!')).toBeVisible();
            await page.getByRole('img', { name: 'close', exact: true }).click();
            await page.getByRole('combobox').selectOption('BTC');
            await page.getByRole('button', { name: 'Buy / Long' }).click();
            await expect(page.getByText('Invalid quantity entered!')).toBeVisible();
            await page.getByRole('img', { name: 'close', exact: true }).click();

        });

        // Successfully "Amount below minimum" enter verify the error message in futures flow.

        test.skip('Should display minimum amount error', async ({ page }) => {
        
            await page.getByRole('link', { name: 'futures futures Sub menu' }).click();
            await page.getByText('LONG', { exact: true }).click();    
            await page.locator('#bsform_1').getByText('Limit Order').click(); 
            const orderSizeInput = await page.locator('.orderSizeInput').nth(0).getAttribute('placeholder');
            const amount = parseFloat(orderSizeInput.match(/[\d,]+/)[0].replace(/,/g, ''));
            const newAmount = amount - 100;
            await page.locator('.orderSizeInput').nth(0).click();  
            await page.locator('.orderSizeInput').nth(0).fill(newAmount.toString()); // 1 to below Min amount USDT
            await page.getByRole('button', { name: 'Buy / Long' }).click();
            await expect(page.getByText(/Minimum amount should be/)).toBeVisible();
            await page.getByRole('img', { name: 'close', exact: true }).click();

        });

        // Successfully "Quantity below minimum" enter verify the error message in futures flow.


        test('Should display minimum quantity error', async ({ page }) => {
        
            await page.getByRole('link', { name: 'futures futures Sub menu' }).click();
            await expect(page).toHaveURL(/BTC-USDT/);
            await page.getByText('LONG', { exact: true }).click();    
            await page.locator('#bsform_1').getByText('Limit Order').click(); 
            await page.getByRole('combobox').selectOption('BTC');
            await page.getByRole('textbox', { name: 'Min Qty: 0.002 BTC' }).click();
            await page.getByRole('textbox', { name: 'Min Qty: 0.002 BTC' }).fill('0.001'); // 0.001 to below Min quantity BTC
            await page.getByRole('button', { name: 'Buy / Long' }).click();
            expect(page.getByText('Minimum quantity should be 0.002 BTC')).toBeVisible();
            await page.getByRole('img', { name: 'close', exact: true }).click();
        });


    });








