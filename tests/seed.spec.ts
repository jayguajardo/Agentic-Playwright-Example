import { test, expect } from '@playwright/test';

test.describe('Test group', () => {
  test('seed', async ({ page }) => {
    page.goto("https://localhost:3000")
    // generate code here.
  });
});
