import { test, expect } from '@playwright/test';

test('should interact with the board', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await page.getByRole('button', { name: '0' }).click();
  await page.getByRole('button', { name: '0' }).click();
  await page.getByRole('button', { name: '0' }).click();
  await page.getByRole('button', { name: '0' }).click();
  await page.getByRole('button', { name: '0' }).click();
  await page.getByRole('button', { name: '0' }).click();
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('button', { name: 'error-close-button' }).click();
});
