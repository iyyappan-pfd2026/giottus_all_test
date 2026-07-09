// @ts-check
import { test, expect } from '@playwright/test';

//sample test

test('giottus', async ({ page }) => {
  await page.goto('https://stage3.giottus.com/'); // Go to the portal page
  await expect(page).toHaveTitle(/Giottus/); // Verify the title of the page

});

