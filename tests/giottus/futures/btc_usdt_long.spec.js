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

        test('Successful Long Order purchase', async ({ page }) => {


            
            await page.getByRole('link', { name: 'futures futures Sub menu' }).click();
            await page.getByText('LONG', { exact: true }).click();            
            await page.locator('.orderSizeInput').nth(0).click();
            await page.locator('.orderSizeInput').nth(0).fill('300'); // Valid amount 300 USDT to 20,00,000 USDT
            await page.getByRole('button', { name: 'Buy / Long' }).click();
            const avgEntryPrice = await page.locator('.is-muted').textContent();
            const updatedPrice = avgEntryPrice?.match(/[\d,]+\.?\d*/)?.[0];  
            const updatedPriceWithoutComma = updatedPrice?.replace(/,/g, '').toString(); // Remove commas from the price          
            await page.getByRole('button', { name: 'Confirm long' }).click();    
            await expect(page.getByText('Order created successfully.')).toBeVisible();
            await page.getByText('active positions').click();
            await expect(page.locator('#table_5').getByText(updatedPriceWithoutComma)).toBeVisible();             

        });

        // Successfully "Amount below minimum" enter verify the error message in futures flow.

        test('Should display minimum amount error', async ({ page }) => {

            
            await page.getByRole('link', { name: 'futures futures Sub menu' }).click();
            await page.getByText('LONG', { exact: true }).click();
            const orderSizeInput = await page.locator('.orderSizeInput').nth(0).getAttribute('placeholder');
            const amount = parseFloat(orderSizeInput.match(/[\d,]+/)[0].replace(/,/g, ''));
            const newAmount = amount - 5;
            await page.locator('.orderSizeInput').nth(0).click();  
            await page.locator('.orderSizeInput').nth(0).fill(newAmount.toString()); // 1 to below Min amount USDT
            await page.getByRole('button', { name: 'Buy / Long' }).click();
            await expect(page.getByText(/Minimum amount should be/)).toBeVisible();
            await page.getByRole('img', { name: 'close', exact: true }).click();

        });

        // Successfully "Quantity below minimum" enter verify the error message in futures flow.

        test('Should display minimum quantity error', async ({ page }) => {

            
            await page.getByRole('link', { name: 'futures futures Sub menu' }).click();
            await page.getByText('LONG', { exact: true }).click();       
            await page.getByRole('combobox').selectOption('BTC');
            const minQuantity = await page.locator('.orderSizeInput').nth(0).getAttribute('placeholder');
            const quantity = minQuantity?.match(/[\d,]+\.?\d*/)?.[0];
            const newQuantity = quantity - 0.0001;
            await page.locator('.orderSizeInput').nth(0).click();  
            await page.locator('.orderSizeInput').nth(0).fill(newQuantity.toString()); // 0.001 to below Min quantity BTC
            await page.getByRole('button', { name: 'Buy / Long' }).click();
            await expect(page.getByText(/Minimum quantity should be/)).toBeVisible();
            await page.getByRole('img', { name: 'close', exact: true }).click();

        });

        // Successfully "No Enter amount and Quantity" enter verify the error message in futures flow.

        test('Should display error for no amount and quantity', async ({ page }) => {
        
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


        // Successfully "Long Order purchase Flow" for BTC/USDT in futures flow with TP and SL.
        test('Long Order purchase TP and SL', async ({ page }) => {

            
            await page.getByRole('link', { name: 'futures futures Sub menu' }).click();
            await page.getByText('LONG', { exact: true }).click();
            const currentPrice = await page.getByRole('textbox').first().inputValue();
            const updatedPrice = parseFloat(currentPrice.replace(/,/g, '')).toString();
            console.log('Current Price:', updatedPrice);
            await page.locator('.orderSizeInput').nth(0).click();
            await page.locator('.orderSizeInput').nth(0).fill('300');              
            await page.locator('[id="tpsl-btn buy"]').click();            
            await page.locator('#take-profit-input-Long').click();
            const takeProfitPrice = (parseFloat(updatedPrice) + 100).toFixed(1).toString(); // Set take profit price above current price
            console.log('Take Profit Price:', takeProfitPrice);
            await page.locator('#take-profit-input-Long').fill(takeProfitPrice);
            const stopLossPrice = (parseFloat(updatedPrice) - 100).toFixed(1).toString(); // Set stop loss price below current price
            console.log('Stop Loss Price:', stopLossPrice);
            await page.locator('#stop-loss-input-Long').click();
            await page.locator('#stop-loss-input-Long').fill(stopLossPrice);
            await page.getByRole('button', { name: 'Buy / Long' }).click();
            await page.getByRole('button', { name: 'Confirm long' }).click();
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


        test.only('Long Order purchase positions and history check', async ({ page }) => {
            
            await page.getByRole('link', { name: 'futures futures Sub menu' }).click();
            await page.getByText('LONG', { exact: true }).click(); 
            await page.pause();           
            await page.locator('.orderSizeInput').nth(0).click();
            await page.locator('.orderSizeInput').nth(0).fill('300'); // Valid amount 300 USDT to 20,00,000 USDT
            await page.getByRole('button', { name: 'Buy / Long' }).click();
            const avgEntryPrice = await page.locator('.is-muted').textContent();
            const updatedPrice = avgEntryPrice?.match(/[\d,]+\.?\d*/)?.[0];  
            const updatedPriceWithoutComma = updatedPrice?.replace(/,/g, '').toString(); // Remove commas from the price          
            await page.getByRole('button', { name: 'Confirm long' }).click();    
            await expect(page.getByText('Order created successfully.')).toBeVisible();
            await page.getByText('active positions').click();
            await expect(page.locator('#table_5').getByText(updatedPriceWithoutComma)).toBeVisible();       


        });



});

test.describe('Giottus Futures BTC/USDT Long Limit Order Flow', () => {

        // Successfully "Long Limit Order purchase Flow" for BTC/USDT in futures flow.

        test('Successful Long Limit Order purchase', async ({ page }) => {
        
        await page.getByRole('link', { name: 'futures futures Sub menu' }).click();
        await page.getByText('LONG', { exact: true }).click(); 
        await page.locator('#bsform_1').getByText('Limit Order').click();
        const currentPrice = await page.getByRole('textbox').first().inputValue();
        const updatedPrice = (parseFloat(currentPrice.replace(/,/g, '')) - 1000).toString(); // Subtract from the current price
        await page.getByRole('textbox').first().click();
        await page.getByRole('textbox').first().fill(updatedPrice.toString()); // Enter a price lower than the current price

                    // const orderSizeInput = await page.locator('.orderSizeInput').nth(0).getAttribute('placeholder');
                    // const amount = parseFloat(orderSizeInput.match(/[\d,]+/)[0].replace(/,/g, ''));
                    // const newAmount = amount + 100;
                    // await page.locator('.orderSizeInput').nth(0).click();  
                    // await page.locator('.orderSizeInput').nth(0).fill(newAmount.toString()); 


        await page.getByRole('combobox').selectOption('BTC');
        await page.getByRole('textbox', { name: 'Min Qty: 0.002 BTC' }).click();
        await page.getByRole('textbox', { name: 'Min Qty: 0.002 BTC' }).fill('0.005');               
        await page.getByRole('button', { name: 'Buy / Long' }).click();    
        await page.getByRole('button', { name: 'Confirm long' }).click();        
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
     
        // Successfully "No Enter amount and Quantity" enter verify the error message in futures flow.

        test('Should display error for no amount and quantity', async ({ page }) => {
        
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

        test('Should display minimum amount error', async ({ page }) => {
        
            await page.getByRole('link', { name: 'futures futures Sub menu' }).click();
            await page.getByText('LONG', { exact: true }).click();    
            await page.locator('#bsform_1').getByText('Limit Order').click(); 
            const orderSizeInput = await page.locator('.orderSizeInput').nth(0).getAttribute('placeholder');
            const amount = parseFloat(orderSizeInput.match(/[\d,]+/)[0].replace(/,/g, ''));
            const newAmount = amount - 10;
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


        test('Not Enter Price or below 556.8', async ({ page }) => {
        
            await page.getByRole('link', { name: 'futures futures Sub menu' }).click();
            await expect(page).toHaveURL(/BTC-USDT/);
            await page.getByText('LONG', { exact: true }).click();    
            await page.locator('#bsform_1').getByText('Limit Order').click();       
            await page.getByRole('textbox').first().click();
            await page.getByRole('textbox').first().fill(''); // Empty or Below 566.8
            const orderSizeInput = await page.locator('.orderSizeInput').nth(0).getAttribute('placeholder');
            const amount = parseFloat(orderSizeInput.match(/[\d,]+/)[0].replace(/,/g, ''));
            const newAmount = amount + 100;
            await page.locator('.orderSizeInput').nth(0).click();  
            await page.locator('.orderSizeInput').nth(0).fill(newAmount.toString());
            await page.getByRole('button', { name: 'Buy / Long' }).click();
            await expect(page.getByText('Price is below the minimum allowed price 556.8')).toBeVisible();
            await page.getByRole('img', { name: 'close', exact: true }).click();

        });      
        


    });








