import { Page } from '@playwright/test';

export const logIn = async (page: Page) => {
  await page.goto('https://localhost:3000/');

  await page.fill('input[id="username"]', 'fwitosz');
  await page.fill('input[id="password"]', 'fwitosz42');

  await page.click('id=submit');
  await page.waitForTimeout(5000);
};
