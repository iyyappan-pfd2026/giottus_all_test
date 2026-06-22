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

// Successfully "Easy Buy Flow" for USDT in easy buy flow.

test.skip('Easy Buy Flow', async ({ page }) => {

    await page.getByRole('link', { name: 'easy&nbsp;buy/sell easy buy/' }).click();
    await page.getByText('Buy BTCSell BTC1 BTC65,01,094').click();
    await page.locator('#buyMarkets').getByText('USDT', { exact: true }).click();
    await page.getByText('Buy USDT').click();    
    await page.getByRole('textbox').nth(1).click();
    await page.getByRole('textbox').nth(1).fill('1');  // Amount 1 INR to 20,00,000 INR
    await page.getByRole('button', { name: 'Easy Buy' }).click();
    await page.getByRole('button', { name: 'Confirm Buy' }).click();
    await expect(page.getByText('Success Simple Order Processed')).toBeVisible();
    await page.getByRole('button', { name: 'Done' }).click();
});




// Successfully "Amount 0 " enter verify the error message in easy buy flow.

test.skip('Amount was 0', async ({ page }) => {

    await page.getByRole('link', { name: 'easy&nbsp;buy/sell easy buy/' }).click();
    await page.getByText('Buy BTCSell BTC1 BTC65,01,094').click();
    await page.locator('#buyMarkets').getByText('USDT', { exact: true }).click();
    await page.getByText('Buy USDT').click();
    await page.getByRole('textbox').nth(1).click();
    await page.getByRole('textbox').nth(1).fill('0');
    await page.getByRole('button', { name: 'Easy Buy' }).click();
    await expect(page.getByText('Invalid price entered!')).toBeVisible();
    await page.getByRole('button', { name: 'Left ArrowGo Back' }).click();

    
});

// Successfully "Min amount below 0 to 0.9" enter verify the error message in easy buy flow.

test.skip('Min amount below 0 to 0.9', async ({ page }) => {

    await page.getByRole('link', { name: 'easy&nbsp;buy/sell easy buy/' }).click();
    await page.getByText('Buy BTCSell BTC1 BTC65,01,094').click();
    await page.locator('#buyMarkets').getByText('USDT', { exact: true }).click();
    await page.getByText('Buy USDT').click();
    await page.getByRole('textbox').nth(1).click();
    await page.getByRole('textbox').nth(1).fill('0.5'); // Amount 0.1 to 0.9
    await page.getByRole('button', { name: 'Easy Buy' }).click();
    await expect(page.getByText('You cannot buy less than 1')).toBeVisible();
    await page.getByRole('button', { name: 'Left ArrowGo Back' }).click();

    
});

// Successfully "Max amount for 20,00,001 " enter verify the error message in easy buy flow.

test.skip('Max amount for 20,00,001 ', async ({ page }) => {

    await page.getByRole('link', { name: 'easy&nbsp;buy/sell easy buy/' }).click();
    await page.getByText('Buy BTCSell BTC1 BTC65,01,094').click();
    await page.locator('#buyMarkets div').filter({ hasText: /^USDT$/ }).click();
    await page.getByText('20,00,000').click();
    await page.getByRole('textbox').nth(1).click();
    await page.getByRole('textbox').nth(1).fill('2,00,0001');
    await page.getByRole('button', { name: 'Easy Buy' }).click();
    await expect(page.getByText('You cannot buy more than 20,00,000 INR worth of USDT')).toBeVisible();
    await page.getByRole('img', { name: 'close', exact: true }).click();
}); 

// Successfully "Higher then Account Balance to Buy USDT" enter verify the error message in easy buy flow.

test.skip('higher then Account Balance to Buy USDT', async ({ page }) => {

    
    await page.getByRole('link', { name: 'easy&nbsp;buy/sell easy buy/' }).click();
    await page.getByText('Buy BTCSell BTC1 BTC65,01,094').click();
    await page.locator('#buyMarkets').getByText('USDT', { exact: true }).click();
    await page.getByText('Buy USDT').click();    
    const accountInput = await page.getByRole('textbox').nth(1);
    const accountBalance = await accountInput.inputValue();    
    console.log('Account Balance:', accountBalance);
    const accountBalanceValue = parseFloat(accountBalance.replace(/,/g, '')); // Remove commas and convert to number
    console.log('Account Balance Value:', accountBalanceValue);
    const updatedAmount = accountBalanceValue + 100; // Add 1000 to the account balance
    await page.getByRole('textbox').nth(1).click();
    await page.getByRole('textbox').nth(1).fill(updatedAmount.toString());  // Amount higher than account balance
    await page.getByRole('button', { name: 'Easy Buy' }).click();
    await page.getByRole('button', { name: 'Confirm Buy' }).click();
    await expect(page.getByText('Your order is rejected')).toBeVisible();
});
   
//Buy the USDT update INR account balance and verify the updated INR account balance in easy buy flow.

test.skip('Buy the USDT update INR account balance and verify the updated INR account balance', async ({ page }) => {

    await page.getByRole('link', { name: 'easy&nbsp;buy/sell easy buy/' }).click();
    await page.getByText('Buy BTCSell BTC1 BTC65,01,094').click();
    await page.locator('#buyMarkets').getByText('USDT', { exact: true }).click();
    await page.getByText('Buy USDT').click();        
    const inrBalance = await page.locator('#bsform_1').getByText('INR Balance:').textContent();
    const inrBalanceValue = parseFloat(inrBalance.replace(/,/g, '')); // Get the initial INR balance and convert to number
    console.log('INR Balance:', inrBalanceValue);
    await page.getByRole('textbox').nth(1).click();
    const useramount = await page.getByRole('textbox').nth(1).fill('10');
    const useramountValue = parseFloat(await page.getByRole('textbox').nth(1).inputValue().then(text => text.replace(/,/g, ''))); // Get the user amount and convert to number
    console.log('User Amount:', useramountValue);    
    await page.getByRole('button', { name: 'Easy Buy' }).click();
    await page.getByRole('button', { name: 'Confirm Buy' }).click();
    await page.getByRole('button', { name: 'Done' }).click();
    const userdebitedAmountbalance =  inrBalanceValue - useramountValue; // Calculate the expected debited amount
    const currentInrBalance = await page.locator('#bsform_1').getByText('INR Balance:').textContent();
    const currentInrBalanceValue = parseFloat(currentInrBalance.replace(/,/g, '')); // Get the updated INR balance and convert to number
    console.log('Updated INR Balance:', currentInrBalanceValue);
    await expect(currentInrBalanceValue).toBe(userdebitedAmountbalance); // Verify the updated INR balance
});


