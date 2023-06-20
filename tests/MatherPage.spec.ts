import { test, expect } from '@playwright/test';
import { Mathler } from '../components/Mathler';

test('should submit the correct answer', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  const expression = Mathler.getTodaysAnswers()
    .expression.replaceAll(' ', '')
    .split('');
  for (let i = 0; i < expression.length; i += 1) {
    // justification, want sync checks on this.
    // eslint-disable-next-line no-await-in-loop
    await page
      .getByRole('button', { name: expression[i], exact: true })
      .click();
  }
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByTestId('0-0')).toHaveClass(/bg-success/);
  await expect(page.getByTestId('0-1')).toHaveClass(/bg-success/);
  await expect(page.getByTestId('0-2')).toHaveClass(/bg-success/);
  await expect(page.getByTestId('0-3')).toHaveClass(/bg-success/);
  await expect(page.getByTestId('0-4')).toHaveClass(/bg-success/);
  await expect(page.getByTestId('0-5')).toHaveClass(/bg-success/);
});

test('should have an error message if the expression is invalid', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: '0' }).click();
  await page.getByRole('button', { name: '0' }).click();
  await page.getByRole('button', { name: '0' }).click();
  await page.getByRole('button', { name: '0' }).click();
  await page.getByRole('button', { name: '0' }).click();
  await page.getByRole('button', { name: '0' }).click();
  await page.getByRole('button', { name: 'Submit' }).click();

  await expect(
    page.getByRole('button', { name: 'error-close-button' })
  ).toBeVisible();
  await page.getByRole('button', { name: 'error-close-button' }).click();
  await expect(
    page.getByRole('button', { name: 'error-close-button' })
  ).not.toBeVisible();
});

test('should enter and delete entries', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: '0' }).click();
  await page.getByRole('button', { name: '1' }).click();
  await page.getByRole('button', { name: '2' }).click();
  await page.getByRole('button', { name: '3' }).click();
  await page.getByRole('button', { name: '4' }).click();
  await page.getByRole('button', { name: '5' }).click();
  await page.getByRole('button', { name: 'Delete' }).click();

  await expect(page.getByTestId('0-5')).toHaveText('');
  await page.getByRole('button', { name: '+' }).click();
  await expect(page.getByTestId('0-5')).toHaveText('+');
  await page.getByRole('button', { name: 'Delete' }).click();
  await page.getByRole('button', { name: 'Delete' }).click();
  await page.getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByTestId('0-5')).toHaveText('');
  await expect(page.getByTestId('0-4')).toHaveText('');
  await expect(page.getByTestId('0-3')).toHaveText('');
});

test('should have the equation answer at the top', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  const val = Mathler.getTodaysAnswers().value;
  await expect(
    page.getByText(`Find the hidden calculation that equals ${val}`)
  ).toBeVisible();
});
