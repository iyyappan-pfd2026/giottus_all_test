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

       

        test('Successful Short Order purchase for USDT amount', async ({ page }) => {
            
            await page.getByRole('link', { name: 'futures futures Sub menu' }).click();                    
            await page.getByText('SHORT', { exact: true }).click();
            await page.locator('.orderSizeInput').nth(1).click();
            await page.locator('.orderSizeInput').nth(1).fill('300');
            await page.getByRole('button', { name: 'Sell / Short' }).click();
            await page.getByRole('button', { name: 'Confirm short' }).click();
            await expect(page.getByText('Order created successfully.')).toBeVisible();

        });

        test('Successful Short Order purchase for BTC Quantity', async ({ page }) => {
            
            await page.getByRole('link', { name: 'futures futures Sub menu' }).click();     
            await page.getByText('SHORT', { exact: true }).click();
            await page.getByRole('combobox').selectOption('BTC');
            await page.locator('.orderSizeInput').nth(1).click();  
            await page.locator('.orderSizeInput').nth(1).fill('0.0010');
            await page.getByRole('button', { name: 'Sell / Short' }).click();
            await page.getByRole('button', { name: 'Confirm short' }).click();
            await expect(page.getByText('Order created successfully.')).toBeVisible();       


        });

       test('Should display minimum amount error', async ({ page }) => {

            
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


        test('Should display minimum quantity error', async ({ page }) => {

            await page.getByRole('link', { name: 'futures futures Sub menu' }).click();     
            await page.getByText('SHORT', { exact: true }).click();
            await page.getByRole('combobox').selectOption('BTC');
            const minQuantity = await page.locator('.orderSizeInput').nth(1).getAttribute('placeholder');
            const quantity = minQuantity?.match(/[\d,]+\.?\d*/)?.[0];
            const newQuantity = (parseFloat(quantity) - 0.0001);
            await page.locator('.orderSizeInput').nth(1).click();  
            await page.locator('.orderSizeInput').nth(1).fill(newQuantity.toString()); 
            await page.getByRole('button', { name: 'Sell / Short' }).click();
            await expect(page.getByText(/Minimum quantity should be/)).toBeVisible();
            await page.getByRole('img', { name: 'close', exact: true }).click();

        });


        test('Should display error for no amount and quantity', async ({ page }) => {

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

        test('Should display error for amount and quantity was 0', async ({ page }) => {

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


         test('Short Order purchase with test of TP and SL', async ({ page }) => {
           
            
            await page.getByRole('link', { name: 'futures futures Sub menu' }).click();                    
            await page.getByText('SHORT', { exact: true }).click();
            const currentPrice = await page.getByRole('textbox').first().inputValue();
            const updatedPrice = (parseFloat(currentPrice.replace(/,/g, '')).toString());
            console.log('Current Price:', updatedPrice);
            await page.locator('.orderSizeInput').nth(1).click();  
            await page.locator('.orderSizeInput').nth(1).fill('300');
            await page.locator('[id="tpsl-btn sell"]').click();            
            await page.locator('#take-profit-input-Short').click();
            const takeProfitPrice = (parseFloat(updatedPrice) - 100).toFixed(1).toString(); // Set take profit price above current price
            console.log('Take Profit Price:', takeProfitPrice);
            await page.locator('#take-profit-input-Short').fill(takeProfitPrice);
            const stopLossPrice = (parseFloat(updatedPrice) + 100).toFixed(1).toString(); // Set stop loss price below current price
            console.log('Stop Loss Price:', stopLossPrice);
            await page.locator('#stop-loss-input-Short').click();
            await page.locator('#stop-loss-input-Short').fill(stopLossPrice);
            await page.getByRole('button', { name: 'Sell / Short' }).click();
            await page.getByRole('button', { name: 'Confirm short' }).click();
            await expect(page.getByText('Order created successfully.')).toBeVisible();  
            await page.getByText('open orders').click({timeout: 5000});
            const table = await page.locator('#table_6')
            const rows = await table.locator('tbody tr');
            const matchRow = rows.filter({

                    has: page.locator('td'),
                    hasText: updatedPrice

                })
            await expect(page.locator('td', { hasText: takeProfitPrice })).toBeVisible();  
            await expect(page.locator('td', { hasText: stopLossPrice })).toBeVisible();
         });


});


test.describe('Giottus Futures BTC/USDT Short Limit Order Flow', () => {



        test('Successful Short Limit Order purchase for USDT', async ({ page }) => {
        
            await page.getByRole('link', { name: 'futures futures Sub menu' }).click();
            await page.getByText('SHORT', { exact: true }).click();
            await page.locator('#bsform_2').getByText('Limit Order').click();
            const currentPrice = await page.getByRole('textbox').first().inputValue();
            const updatedPrice = (parseFloat(currentPrice.replace(/,/g, '')) + 1000);
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
       
            await page.getByText('open orders').click();
            const table = await page.locator('#table_6')
            const rows = await table.locator('tbody tr');
            const matchRow = rows.filter({

                    has: page.locator('td'),
                    hasText: updatedPrice

                })
            await expect(page.locator('td', { hasText: updatedPrice })).toBeVisible();  

        });

        test('Successful Short Limit Order purchase for BTC', async ({ page }) => {
        
            await page.getByRole('link', { name: 'futures futures Sub menu' }).click();
            await page.getByText('SHORT', { exact: true }).click();
            await page.locator('#bsform_2').getByText('Limit Order').click();
            const currentPrice = await page.getByRole('textbox').first().inputValue();
            const updatedPrice = (parseFloat(currentPrice.replace(/,/g, '')) + 1000);
            await page.getByRole('textbox').first().click();
            await page.getByRole('textbox').first().fill(updatedPrice.toString());
            await page.getByRole('combobox').selectOption('BTC');
            const minQuantity = await page.locator('.orderSizeInput').nth(1).getAttribute('placeholder');
            const quantity = minQuantity?.match(/[\d,]+\.?\d*/)?.[0];
            const newQuantity = (parseFloat(quantity.replace(/,/g, '')) + 0.003);
            await page.locator('.orderSizeInput').nth(1).click();  
            await page.locator('.orderSizeInput').nth(1).fill(newQuantity.toString()); 
            await page.getByRole('button', { name: 'Sell / Short' }).click();
            await page.getByRole('button', { name: 'Confirm short' }).click();
            await expect(page.getByText('Order created successfully.')).toBeVisible();
            await page.getByText('open orders').click({timeout: 2000});
            const table = await page.locator('#table_6')
            const rows = await table.locator('tbody tr');
            const matchRow = rows.filter({

                    has: page.locator('td'),
                    hasText: updatedPrice

                })
            await expect(page.locator('td', { hasText: updatedPrice })).toBeVisible();  

        });

        test('Short Limit Order minimum amount error', async ({ page }) => {
        
            await page.getByRole('link', { name: 'futures futures Sub menu' }).click();
            await page.getByText('SHORT', { exact: true }).click();
            await page.locator('#bsform_2').getByText('Limit Order').click();
            const orderSizeInput = await page.locator('.orderSizeInput').nth(1).getAttribute('placeholder');
            const amount = parseFloat(orderSizeInput.match(/[\d,]+/)[0].replace(/,/g, ''));
            const newAmount = amount - 10;
            await page.locator('.orderSizeInput').nth(1).click();  
            await page.locator('.orderSizeInput').nth(1).fill(newAmount.toString()); // 1 to below Min amount USDT
            await page.getByRole('button', { name: 'Sell / Short' }).click();
            await expect(page.getByText(/Minimum amount should be/)).toBeVisible();
            await page.getByRole('img', { name: 'close', exact: true }).click();

        });

        test('Short Limit Order minimum quantity error', async ({ page }) => {
        
            await page.getByRole('link', { name: 'futures futures Sub menu' }).click();
            await page.getByText('SHORT', { exact: true }).click();
            await page.locator('#bsform_2').getByText('Limit Order').click();
            await page.getByRole('combobox').selectOption('BTC');
            const minQuantity = await page.locator('.orderSizeInput').nth(1).getAttribute('placeholder');
            const quantity = minQuantity?.match(/[\d,]+\.?\d*/)?.[0];
            const newQuantity = (parseFloat(quantity) - 0.0001);
            await page.locator('.orderSizeInput').nth(1).click();  
            await page.locator('.orderSizeInput').nth(1).fill(newQuantity.toString()); 
            await page.getByRole('button', { name: 'Sell / Short' }).click();
            await expect(page.getByText(/Minimum quantity should be/)).toBeVisible();
            await page.getByRole('img', { name: 'close', exact: true }).click();

        });


        test('Short Limit Order without Enter amount or quantity', async ({ page }) => {
        
            await page.getByRole('link', { name: 'futures futures Sub menu' }).click();
            await page.getByText('SHORT', { exact: true }).click();
            await page.locator('#bsform_2').getByText('Limit Order').click();
            await page.getByRole('button', { name: 'Sell / Short' }).click();
            await expect(page.getByText('Invalid quantity entered!')).toBeVisible();
            await page.getByRole('img', { name: 'close', exact: true }).click();
            await page.getByRole('combobox').selectOption('BTC');
            await page.getByRole('button', { name: 'Sell / Short' }).click();
            await expect(page.getByText('Invalid quantity entered!')).toBeVisible();
            await page.getByRole('img', { name: 'close', exact: true }).click();


        });


        test('Short Limit Order Enter amount or quantity was 0', async ({ page }) => {
        
            await page.getByRole('link', { name: 'futures futures Sub menu' }).click();
            await page.getByText('SHORT', { exact: true }).click();
            await page.locator('#bsform_2').getByText('Limit Order').click();
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



        test('Short Limit Order price was empty or 0 or below minimum amount', async ({ page }) => {
        

            // Test for empty price
            await page.getByRole('link', { name: 'futures futures Sub menu' }).click();
            await page.getByText('SHORT', { exact: true }).click();
            await page.locator('#bsform_2').getByText('Limit Order').click();            
            await page.getByRole('textbox').first().click();
            await page.getByRole('textbox').first().fill('');
            await page.pause();
            const orderSizeInput = await page.locator('.orderSizeInput').nth(0).getAttribute('placeholder');
            const amount = parseFloat(orderSizeInput.match(/[\d,]+/)[0].replace(/,/g, ''));
            const newAmount = amount + 200;
            await page.locator('.orderSizeInput').nth(1).click();  
            await page.locator('.orderSizeInput').nth(1).fill(newAmount.toString()); 
            await page.getByRole('button', { name: 'Sell / Short' }).click();            
            await expect(page.getByText(/Price is below the minimum allowed price/)).toBeVisible();
            await page.getByRole('img', { name: 'close', exact: true }).click();

            // // Test for price below amount was 0
            await page.getByRole('textbox').first().click();
            await page.getByRole('textbox').first().fill('0');            
            await page.getByRole('button', { name: 'Sell / Short' }).click();            
            await expect(page.getByText(/Price is below the minimum allowed price/)).toBeVisible();
            await page.getByRole('img', { name: 'close', exact: true }).click();

            // Test for price below minimum amount
            await page.locator('#bsform_2').getByText('Market Order').click();
            await page.locator('#bsform_2').getByText('Limit Order').click();
            const currentPrice = await page.getByRole('textbox').first().inputValue();
            const updatedPrice = (parseFloat(currentPrice.replace(/,/g, '')) - 5000);
            await page.getByRole('textbox').first().click();
            await page.getByRole('textbox').first().fill(updatedPrice.toString());
            await page.getByRole('button', { name: 'Sell / Short' }).click();  
            await expect(page.getByText(/Price is below the minimum allowed price/)).toBeVisible();
            await page.getByRole('img', { name: 'close', exact: true }).click();
            



        });
        
});