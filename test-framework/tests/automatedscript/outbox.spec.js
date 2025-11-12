const { test } = require('@playwright/test');
const { click } = require('../../commonFunctions'); // adjust path as needed

test('open Google and click search button', async ({ page }) => {
    await page.goto('https://www.google.com');

    // ensure search input is visible, type a query so the search button appears
    await page.waitForSelector('input[name="q"]', { state: 'visible' });
    await page.fill('input[name="q"]', 'playwright');

    // call click from commonFunctions.js to click the search button
    await click(page, 'input[name="btnK"]');

    // optional: wait for results to load
    await page.waitForLoadState('networkidle');
});