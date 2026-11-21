# Login API Test Plan

## Application Overview

API negative test for POST /api/login on the TechMart app (http://localhost:3000). Uses the Playwright `request` fixture with relative paths, matching tests/api/home-api.spec.ts. No real credentials are used; the wrong password is intentionally fake.

## Test Scenarios

### 1. Login API - negative

**Seed:** `tests/seed.spec.ts`

#### 1.1. should return 401 and an 'Invalid credentials' error when logging in with a wrong password

**File:** `tests/api/login-api.spec.ts`

**Steps:**
  1. Send request.post('/api/login', { data: { email: 'demo@techmart.com', password: 'wrong-password' } }) and parse the response with response.json().
    - expect: The request completes and returns a JSON response.
  2. Assert on the response status.
    - expect: response.status() equals 401.
  3. Assert on the JSON body.
    - expect: body.error equals 'Invalid credentials'.
