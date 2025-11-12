const { test, expect } = require('@playwright/test');
const { gotoUrl } = require('./coreEngine/commonFunctions/commonFunctions');

/**
 * Clicks on a button element using Playwright.
 * @param {import('playwright').Page} page - The Playwright page object.
 * @param {string} selector - The selector for the button (CSS, text, etc.).
 * @param {object} [options] - Optional click options.
 */
async function clickButton(page, selector, options = {}) {
    await page.waitForSelector(selector, { state: 'visible' });
    await page.click(selector, options);
}

module.exports = { clickButton };

/**
 * Enters text into a textbox (or any editable element) with dynamic waits.
 * @param {import('playwright').Page} page
 * @param {string} selector
 * @param {string} text
 * @param {object} [options]
 * @param {number} [options.timeout=30000] - wait timeout in ms
 * @param {boolean} [options.replace=true] - use fill (true) or type (false)
 * @param {boolean} [options.clear=true] - clear before typing when using type
 * @param {number} [options.delay=0] - delay between keystrokes when using type
 */
async function enterText(page, selector, text, options = {}) {
    const {
        timeout = 30000,
        replace = true,
        clear = true,
        delay = 0,
    } = options;

    await page.waitForSelector(selector, { state: 'visible', timeout });
    const handle = await page.$(selector);
    if (!handle) throw new Error(`Element not found for selector: ${selector}`);

    // Wait until the element is enabled/interactive
    try {
        await handle.waitForElementState('enabled', { timeout });
    } catch (_) {
        // fallback: continue, Playwright may still allow interaction
    }

    const value = text == null ? '' : String(text);

    if (replace) {
        // fill clears and sets the value
        await page.fill(selector, value, { timeout });
    } else {
        if (clear) {
            // select all and remove existing content
            await handle.click({ clickCount: 3 });
            await page.keyboard.press('Backspace');
        }
        await page.type(selector, value, { delay });
        }
    }

    /**
     * Selects a checkbox element using Playwright.
     * @param {import('playwright').Page} page - The Playwright page object.
     * @param {string} selector - The selector for the checkbox (CSS, text, etc.).
     * @param {boolean} [checked=true] - Whether to check (true) or uncheck (false) the checkbox.
     * @param {object} [options] - Optional options.
     * @param {number} [options.timeout=30000] - wait timeout in ms
     */
    async function selectCheckbox(page, selector, checked = true, options = {}) {
        const { timeout = 30000 } = options;
        
        await page.waitForSelector(selector, { state: 'visible', timeout });
        const isChecked = await page.isChecked(selector);
        
        if (isChecked !== checked) {
        await page.check(selector, { timeout });
        }
    }

    /**
     * Selects a radio button element using Playwright.
     * @param {import('playwright').Page} page - The Playwright page object.
     * @param {string} selector - The selector for the radio button (CSS, text, etc.).
     * @param {object} [options] - Optional options.
     * @param {number} [options.timeout=300000] - wait timeout in ms
     */
    async function selectRadioButton(page, selector, options = {}) {
        const { timeout = 30000 } = options;

        await page.waitForSelector(selector, { state: 'visible', timeout });
        const isChecked = await page.isChecked(selector);

        if (!isChecked) {
            await page.check(selector, { timeout });
        }
    }

    /**
     * Switches to a frame using Playwright.
     * @param {import('playwright').Page} page - The Playwright page object.
     * @param {string|HTMLElement} frame - The frame selector (CSS selector or element handle).
     * @param {object} [options] - Optional options.
     * @param {number} [options.timeout=30000] - wait timeout in ms
     */
    async function switchToFrame(page, frame, options = {}) {
        const { timeout = 30000 } = options;

        if (typeof frame === 'string') {
            await page.waitForSelector(frame, { state: 'visible', timeout });
            const frameHandle = await page.$(frame);
            if (!frameHandle) throw new Error(`Frame not found for selector: ${frame}`);
            await page.frameLocator(frameHandle).waitFor();
        } else {
            await frame.waitForElementState('attached', { timeout });
            await page.frameLocator(frame).waitFor();
        }
    }

    /**
     * Selects a date from a date picker using Playwright.
     * @param {import('playwright').Page} page - The Playwright page object.
     * @param {string} datePickerSelector - The selector for the date picker.
     * @param {string} date - The date to select in 'YYYY-MM-DD' format.
     * @param {object} [options] - Optional options.
     * @param {number} [options.timeout=30000] - wait timeout in ms
     */
    async function selectDate(page, datePickerSelector, date, options = {}) {
        const { timeout = 30000 } = options;

        await page.waitForSelector(datePickerSelector, { state: 'visible', timeout });
        await page.click(datePickerSelector);

        const [year, month, day] = date.split('-');
        // Assuming the date picker has a way to navigate to the correct month/year
        await page.click(`.datepicker__header [data-year="${year}"]`);
        await page.click(`.datepicker__header [data-month="${month - 1}"]`); // month is 0-indexed
        await page.click(`.datepicker__day[data-day="${day}"]`);
    }

    /**
     * Accepts or dismisses an alert dialog using Playwright.
     * @param {import('playwright').Page} page - The Playwright page object.
     * @param {boolean} accept - Whether to accept (true) or dismiss (false) the alert.
     * @param {object} [options] - Optional options.
     * @param {number} [options.timeout=30000] - wait timeout in ms
     */
    async function handleAlert(page, accept = true, options = {}) {
        const { timeout = 30000 } = options;

        // Wait for the alert to appear
        const [dialog] = await Promise.all([
            page.waitForEvent('dialog', { timeout }),
            page.evaluate(() => window.alert('Test Alert')), // Trigger an alert for demonstration
        ]);

        if (accept) {
            await dialog.accept();
        } else {
            await dialog.dismiss();
        }
    }

    /**
     * Navigates to a specified URL after validating it.
     * @param {import('playwright').Page} page - The Playwright page object.
     * @param {string} url - The URL to navigate to.
     * @throws {Error} Throws an error if the URL is invalid.
     */
    async function gotoUrl(page, url) {
        const urlPattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z0-9](?:[a-z0-9-]*[a-z0-9])?)\\.)+[a-z]{2,}|' + // domain name
            'localhost|' + // localhost
            '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}|' + // IP address
            '\\[?[a-f0-9]*:[a-f0-9:%.~]+\\]?)' + // IPv6
            '(\\:\\d+)?(\\/[-a-z0-9+&@#/%=~_|$?!:.]*[a-z0-9+&@#/%=~_|$])?$', 'i'); // path

        if (!urlPattern.test(url)) {
            throw new Error(`Invalid URL: ${url}`);
        }

        await page.goto(url);
    }

    // Example test using gotoUrl function

    test('navigate to google.com', async ({ page }) => {
        await gotoUrl(page, 'https://www.google.com');
        await expect(page).toHaveURL('https://www.google.com');
    });
    module.exports = { clickButton, enterText, selectCheckbox };