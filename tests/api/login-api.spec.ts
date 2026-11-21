// spec: specs/login-api-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Login API - negative', () => {
  test("should return 401 and an 'Invalid credentials' error when logging in with a wrong password", async ({ request }) => {
    // 1. Send the login request with a wrong password and parse the response
    const response = await request.post('/api/login', {
      data: { email: 'demo@techmart.com', password: 'wrong-password' },
    });
    const body = await response.json();

    // 2. Assert on the response status
    expect(response.status()).toBe(401);

    // 3. Assert on the JSON body
    expect(body.error).toBe('Invalid credentials');
  });
});
