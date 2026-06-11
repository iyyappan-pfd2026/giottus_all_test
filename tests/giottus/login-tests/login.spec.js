import { test, expect } from '@playwright/test'
import { permission } from 'node:process';

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
    slowMo: 500
  }
});


// "Successful login test" case with valid credentials and 2FA code, and then logout.
test.skip('login test', async ({page}) => {

   
    await page.goto('https://stage3.giottus.com/')
    await page.getByRole('link', { name: 'login login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('Selva@giottus.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('Selva@123');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.locator('div').filter({ hasText: /^Allow Giottus to access your location$/ }).click();
    await page.getByRole('textbox', { name: 'Enter code here' }).fill('123456');
    await page.getByRole('link', { name: 'more more' }).click();
    await page.getByRole('link', { name: 'logout logout' }).click();
    await expect(page.locator('text=You have been logged out!')).toBeVisible();
    await page.close();    
    
})

// Successful login test case with "invalid credentials" and correct Email, and then verify the error message.

test.skip('login test with invalid credentials and correct Email', async ({page}) => {

    await page.goto('https://stage3.giottus.com/')
    await page.getByRole('link', { name: 'login login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('iyyappan@giottus.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('123456789');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.locator('div').filter({ hasText: /^Allow Giottus to access your location$/ }).click();
    await expect(page.locator('text=Either Username or Password is invalid.')).toBeVisible();
    await page.close();
});

// Successful login test case with "invalid Email" and correct Password verify the error message.

test.skip('login test with invalid Email', async ({page}) => {

    await page.goto('https://stage3.giottus.com/')
    await page.getByRole('link', { name: 'login login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('abc@giottus.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('Iyyappan@123');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.locator('div').filter({ hasText: /^Allow Giottus to access your location$/ }).click();
    await expect(page.locator('text=Either Username or Password is invalid.')).toBeVisible();
    await page.close();
});

// Successful login test case with "Empty Email and Password" and verify the error message.

test.skip('login test with empty Email and password', async ({page}) => {

    await page.goto('https://stage3.giottus.com/')
    await page.getByRole('link', { name: 'login login' }).click();
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
    await page.close();
});

// Successful login test case with "Unregistered Email and Password" and verify the error message.


test.skip('login test with Unregistered Email and Password', async ({page}) => {

    await page.goto('https://stage3.giottus.com/')
    await page.getByRole('link', { name: 'login login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('xyz@giottus.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('123456789');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.locator('div').filter({ hasText: /^Allow Giottus to access your location$/ }).click();
    await expect(page.locator('text=Either Username or Password is invalid.')).toBeVisible();
    await page.close();
});

// Successful login test case with valid credentials and "invalid 2FA code", and then verify the error message.

test.skip('login test with invalid OTP', async ({page}) => {

   
    await page.goto('https://stage3.giottus.com/')
    await page.getByRole('link', { name: 'login login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('iyyappan@giottus.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('Iyyappan@123');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.locator('div').filter({ hasText: /^Allow Giottus to access your location$/ }).click();
    await page.getByRole('textbox', { name: 'Enter code here' }).fill('123456');    
    await expect(page.locator('Invalid OTP. Kindly enter the OTP we have sent to your registered mobile number.')).toBeVisible({timeout: 30000});
    await page.close();    
    
})

// Successful login test case with valid credentials and "Expired 2FA code", and then verify the error message.

test.skip('login test with Expired OTP', async ({page}) => {

   
    await page.goto('https://stage3.giottus.com/')
    await page.getByRole('link', { name: 'login login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('iyyappan@giottus.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('Iyyappan@123');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.locator('div').filter({ hasText: /^Allow Giottus to access your location$/ }).click();
    await page.getByRole('textbox', { name: 'Enter code here' }).fill('123456');
    await expect(page.getByText('Invalid OTP. Kindly enter the')).toBeVisible({timeout: 30000});
    await page.close();    
    
    
})
