import { test, expect } from '@playwright/test';

test.describe('Home API - products', () => {
  test('should return 200 and a non-empty product list from the products API', async ({ request }) => {
    // Request the product list
    const response = await request.get('/api/products');
    const products = await response.json();

    // The API responds successfully
    expect(response.status()).toBe(200);

    // The body is an array with at least one product
    expect(Array.isArray(products) && products.length > 0).toBe(true);
  });
});
