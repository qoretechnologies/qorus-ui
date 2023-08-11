import { expect, Page, test } from '@playwright/test';

let page: Page;

/* A configuration object for the screenshot comparison. */
const screenshotConfig: any = {
  animations: 'disabled',
  fullPage: true,
  maxDiffPixelRatio: 0.08,
};

/* Declaring a variable called localServerUrl and assigning it the value of 'https://localhost:3000/'. */
const localServerUrl = 'http://localhost:3000/';

/* A test suite that checks every page for visual regressions. */
test.describe('Checks HTTP site', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  test('HTTP login page works', async () => {
    // Go to the login page
    await page.goto(localServerUrl);
    await page.waitForSelector('text=Log in');
    await expect(page).toHaveScreenshot('http-login.png', screenshotConfig);
  });
});
