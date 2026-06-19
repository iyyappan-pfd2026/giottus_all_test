import {test, expect} from '@playwright/test';

test.use({
  video: 'on',
  launchOptions: {
    slowMo: 500
  }
});

//"Successfully reset password" with valid email and code

test.skip('forgot password test', async ({page}) => {
    await page.goto('https://stage3.giottus.com/')
    await page.getByRole('link', { name: 'login login' }).click();
    await page.getByText('Forgot password?').click();
    await page.getByRole('textbox', { name: 'Email address' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('iyyappan@giottus.com');
    await page.getByRole('button', { name: 'Reset Password' }).click();
    await page.pause();
    await page.getByRole('textbox', { name: 'Enter code here' }).click();
    await page.getByRole('textbox', { name: 'Enter code here' }).fill('123456');
    await page.getByRole('textbox', { name: 'Enter New Password' }).click();
    await page.getByRole('textbox', { name: 'Enter New Password' }).fill('Iyyappan@123');
    await page.getByRole('textbox', { name: 'Enter Confirm Password' }).click();
    await page.getByRole('textbox', { name: 'Enter Confirm Password' }).fill('Iyyappan@123');
    await page.getByRole('button', { name: 'Save New Password' }).click();
    await page.getByRole('button', { name: 'Login' }).click();
    await page.close();

});

// Successfully "invalid Email" enter verify the error message in forgot password flow.

test.skip('forgot password test with invalid email', async ({page}) => {
    await page.goto('https://stage3.giottus.com/')
    await page.getByRole('link', { name: 'login login' }).click();
    await page.getByText('Forgot password?').click();
    await page.getByRole('textbox', { name: 'Email address' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('abc@giottus');
    await page.getByRole('button', { name: 'Reset Password' }).click();
    await expect(page.getByText('Please give a valid username!')).toBeVisible();
    await page.close();

});

// Successfully valid Email enter and "invalid code" verify the error message in forgot password flow.

test.skip('forgot password test with invalid code', async ({page}) => {
    await page.goto('https://stage3.giottus.com/')
    await page.getByRole('link', { name: 'login login' }).click();
    await page.getByText('Forgot password?').click();
    await page.getByRole('textbox', { name: 'Email address' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('iyyappan@giottus.com');
    await page.getByRole('button', { name: 'Reset Password' }).click();
    await page.pause();
    await page.getByRole('textbox', { name: 'Enter code here' }).click();
    await page.getByRole('textbox', { name: 'Enter code here' }).fill('000000');
    await expect(page.getByText('No Error Message')).toBeVisible({timeout: 30000});
    await page.close();
    
});

// Successfully valid Email enter and "Expired code" verify the error message in forgot password flow.

test.skip('forgot password test with Expired code', async ({page}) => {
    await page.goto('https://stage3.giottus.com/')
    await page.getByRole('link', { name: 'login login' }).click();
    await page.getByText('Forgot password?').click();
    await page.getByRole('textbox', { name: 'Email address' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('iyyappan@giottus.com');
    await page.getByRole('button', { name: 'Reset Password' }).click();
    await page.pause();
    await page.getByRole('textbox', { name: 'Enter code here' }).click();
    await page.getByRole('textbox', { name: 'Enter code here' }).fill('000000');
    await expect(page.getByText('No Error Message')).toBeVisible({timeout: 30000});
    await page.close();
    
});


// Successfully valid Email enter and valid code but "password and confirm password not match" verify the error message in forgot password flow.

test.skip('forgot password test with password and confirm password not match', async ({page}) => {
    await page.goto('https://stage3.giottus.com/')
    await page.getByRole('link', { name: 'login login' }).click();
    await page.getByText('Forgot password?').click();
    await page.getByRole('textbox', { name: 'Email address' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('iyyappan@giottus.com');
    await page.getByRole('button', { name: 'Reset Password' }).click();
    await page.getByRole('textbox', { name: 'Enter code here' }).click();
    await page.getByRole('textbox', { name: 'Enter code here' }).fill('123456');
    await page.pause();
    await page.getByRole('textbox', { name: 'Enter New Password' }).click();
    await page.getByRole('textbox', { name: 'Enter New Password' }).fill('Iyyappan@123');
    await page.getByRole('textbox', { name: 'Enter Confirm Password' }).click();
    await page.getByRole('textbox', { name: 'Enter Confirm Password' }).fill('Iyyappan@1234');
    await page.getByRole('button', { name: 'Save New Password' }).click();
    await expect(page.getByText('The passwords you entered do not match')).toBeVisible({timeout: 30000});
    await page.close();

});

// Successfully valid Email enter and valid code but "password not meet the password policy" verify the error message in forgot password flow.

test('forgot password test with password not meet the password policy', async ({page}) => {
    await page.goto('https://stage3.giottus.com/')
    await page.getByRole('link', { name: 'login login' }).click();
    await page.getByText('Forgot password?').click();
    await page.getByRole('textbox', { name: 'Email address' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('iyyappan@giottus.com');
    await page.getByRole('button', { name: 'Reset Password' }).click();
    await page.getByRole('textbox', { name: 'Enter code here' }).click();
    await page.getByRole('textbox', { name: 'Enter code here' }).fill('123456');
    await page.pause();
    await page.getByRole('textbox', { name: 'Enter New Password' }).click();
    await page.getByRole('textbox', { name: 'Enter New Password' }).fill('123456789');
    await page.getByRole('textbox', { name: 'Enter Confirm Password' }).click();
    await page.getByRole('textbox', { name: 'Enter Confirm Password' }).fill('123456789');
    await page.getByRole('button', { name: 'Save New Password' }).click();
    await expect(page.getByText('The password you entered must')).toBeVisible({timeout: 10000});
    await page.close();

});


