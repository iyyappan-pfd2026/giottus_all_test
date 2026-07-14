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
                await page.getByText('Buy BTC').click();         
                await page.getByRole('textbox').nth(1).click();
                await page.getByRole('textbox').nth(1).fill('300');
                await page.getByRole('textbox').first().click();
                await page.getByRole('textbox').first().fill('0.00000099'); // minimum quantity is 0.00000100 BTC
                await page.getByRole('textbox').nth(2).click();              
                await page.getByRole('button', { name: 'Buy Now Right Arrow' }).click(); 
                await expect(page.getByText('Minimum quantity should be 0.00000100')).toBeVisible();
                await page.getByRole('img', { name: 'close', exact: true }).click();

            });

            test('spot trade Buy BTC/INR less than minimum amount', async ({ page }) => {  // frontend validation for minimum amount is 0.1 to 0.9 INR

                
                await page.getByRole('link', { name: 'trade trade Sub menu' }).click();
                await page.getByText('Buy BTC').click();
                await page.getByRole('textbox').nth(1).click();
                await page.getByRole('textbox').nth(1).fill('300');
                await page.getByRole('textbox').nth(2).click();
                await page.getByRole('textbox').nth(2).fill('0.1'); // minimum amount is 0.1 to 0.9 INR
                await page.getByRole('textbox').first().click();
                await page.getByRole('button', { name: 'Buy Now Right Arrow' }).click(); 
                await page.getByRole('button', { name: 'Confirm Buy' }).click();
                await expect(page.getByText('Success')).toBeVisible();
                await expect(page.getByText('Error')).toBeVisible();

            });


            test('spot trade Buy BTC/INR invalid account balance', async ({ page }) => {  // frontend validation for invalid account balance
                
                await page.getByRole('link', { name: 'trade trade Sub menu' }).click();
                await page.getByText('Buy BTC').click();
                const balance =  await page.locator('#bsform_1 .basecoinBalance').textContent();
                const balanceValue = parseFloat(balance?.replace(/,/g, '').replace('INR', '').trim() || '0');
                const amountToSpend = balanceValue + 1000;    
                await page.getByRole('textbox').nth(1).click();
                await page.getByRole('textbox').nth(1).fill('3000');
                await page.getByRole('textbox').nth(2).click();
                await page.getByRole('textbox').nth(2).fill(amountToSpend.toString()); // Enter an amount greater than the account balance
                await page.getByRole('textbox').first().click();
                await page.getByRole('button', { name: 'Buy Now Right Arrow' }).click(); 
                await page.getByRole('button', { name: 'Confirm Buy' }).click();
                await expect(page.getByText('Success')).toBeVisible();
                await expect(page.getByText('Error')).toBeVisible();      
                
            });

});



test.describe('Spot Trade BTC/INR Market Order', () => { 

            test.only('Successful spot trade Buy BTC/INR', async ({ page }) => {
                
                await page.getByRole('link', { name: 'trade trade Sub menu' }).click();   //paircoinBalance
                await page.getByText('Buy BTC').click(); 
                const btcBalance =  await page.locator('#bsform_1 .paircoinBalance').textContent();
                const btcBalanceValue = parseFloat(btcBalance?.replace(/,/g, '').trim() || '0');                                  
                await page.locator('#bsform_1').getByText('Market Order').click();
                await page.getByRole('textbox').first().click();
                await page.getByRole('textbox').first().fill('0.00000100');
                const btcQuantity = await page.getByRole('textbox').first().inputValue(); 
                const btcQuantityValue = parseFloat(btcQuantity?.replace(/,/g, '').trim() || '0');        
                const addBtcBalance = btcBalanceValue + btcQuantityValue;
                const updateBtcBalance = parseFloat(addBtcBalance.toFixed(8)).toString();                          
                await page.getByRole('button', { name: 'Buy Now Right Arrow' }).click();
                await page.getByRole('button', { name: 'Confirm Buy' }).click();
                await expect(page.getByText('Success')).toBeVisible(); 
                await expect(page.getByText('Success')).toBeVisible({timeout: 5000}); 
                await expect(page.getByText('Success')).toBeVisible(); 
                await page.locator('#bsform_1').getByText('Limit Order').click();
                await page.locator('#bsform_1').getByText('Market Order').click();                
                const btcCurrentBalance =  await page.locator('#bsform_1 .paircoinBalance').textContent();
                const btcCurrentBalanceValue = parseFloat(btcCurrentBalance?.replace(/,/g, '').trim() || '0');                 
                await expect(page.locator('#bsform_1 .paircoinBalance')).toHaveText(`${updateBtcBalance} BTC`);       
            
            });



            test('spot trade Buy BTC/INR quantity', async ({ page }) => {
                
                await page.getByRole('link', { name: 'trade trade Sub menu' }).click();
                await page.getByText('Buy BTC').click();                                 
                await page.locator('#bsform_1').getByText('Market Order').click();
                await page.getByRole('textbox').first().click();
                await page.getByRole('textbox').first().fill('0.00000001');  //min amount 0.00000001 to 0.00000099
                await page.getByRole('button', { name: 'Buy Now Right Arrow' }).click(); 
                await expect(page.getByText('Minimum quantity should be 0.00000100')).toBeVisible();
                await page.getByRole('img', { name: 'close', exact: true }).click();                

            });


             test('spot trade Buy BTC/INR quantity 0 or Empty', async ({ page }) => {
                
                await page.getByRole('link', { name: 'trade trade Sub menu' }).click();
                await page.getByText('Buy BTC').click();                                 
                await page.locator('#bsform_1').getByText('Market Order').click();
                await page.getByRole('textbox').first().click();
                await page.getByRole('textbox').first().fill('');  // Quantity was Empty
                await page.getByRole('button', { name: 'Buy Now Right Arrow' }).click();                 
                await expect(page.getByText('Invalid quantity entered!')).toBeVisible();
                await page.getByRole('img', { name: 'close', exact: true }).click();
                await page.getByRole('textbox').first().click();
                await page.getByRole('textbox').first().fill('0');  // Quantity was 0
                await page.getByRole('button', { name: 'Buy Now Right Arrow' }).click();                 
                await expect(page.getByText('Invalid quantity entered!')).toBeVisible();
                await page.getByRole('img', { name: 'close', exact: true }).click();


            });
});