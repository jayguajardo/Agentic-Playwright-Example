import { test, expect } from '@playwright/test';

test.describe('Checkout API', () => {
  test('should return 200 and an order confirmation when checking out with a cart item', async ({ request }) => {
    // Add a product to the cart (setup, same request context keeps the session cookie)
    const addResponse = await request.post('/api/cart', {
      data: { productId: 1, quantity: 1 },
    });
    if (!addResponse.ok()) {
      throw new Error(`Setup failed: POST /api/cart returned ${addResponse.status()}`);
    }

    // Check out with fake shipping details
    const response = await request.post('/api/checkout', {
      data: {
        shipping: { address: '123 Test Street', city: 'Testville', zip: '12345' },
      },
    });
    const body = await response.json();

    // The API responds successfully
    expect(response.status()).toBe(200);

    // The order confirmation message is returned
    expect(body.message).toBe('Order placed successfully');
  });
});
