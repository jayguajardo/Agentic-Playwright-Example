# TechMart Login Page – Test Plan

> NOTE: Derived from app source (server.js, public/login.html, public/app.js), NOT from live browser exploration. Locators and messages are unverified against the running app. Verify via seed.spec.ts before relying on it.

**Seed file:** `tests/seed.spec.ts` (base URL https://localhost:3000; fallback http://localhost:3000 – the server is plain Express so http is likely). Each scenario runs in a fresh browser context (no cookies, empty localStorage) and is independent.
**Page under test:** `/login.html`
**Valid user:** demo@techmart.com / demo123 (name "Demo User")

## 1. Test Architecture (Page Object Model)

Set `baseURL` in `playwright.config.ts` (and `ignoreHTTPSErrors: true` if https). Spec files contain no locators, URLs or credentials.

### 1.1 Page objects (`tests/pages/`)

**LoginPage.ts**
- Locators: `emailInput` = getByLabel('Email Address'); `passwordInput` = getByLabel('Password'); `submitButton` = getByRole('button',{name:'Login'}); `errorMessage` = `#errorMessage`; `toast` = `#toast`; `heading` = h1; `signUpLink` = 'Sign up here'; `logoLink`; `cartLink` = `.cart-link`; `cartCount` = `#cartCount`; `demoCredentials` = `.demo-credentials`; `form` = `#loginForm`.
- Actions: `goto()`, `fillEmail()`, `fillPassword()`, `submit()`, `submitWithEnter()`, `login(email, password)`, `loginAndWaitForRedirect(email, password)`.
- Queries: `getErrorMessage()`, `isErrorVisible()`, `getToastText()`, `getPasswordType()`, `getEmailValidationMessage()`, `getActiveElementId()`, `clickSignUp()`, `clickLogo()`, `clickCart()`.

**HomePage.ts** – `greeting` (`.user-name`), `logoutButton` (`#logoutBtn`), `loginLink`, `signUpLink`, `productGrid`, `toast`; `goto()`, `logout()`, `getGreeting()`, `isLoggedIn()`, `getStoredUser()` (localStorage.user), `waitForProducts()`.

**RegisterPage.ts, CartPage.ts, CheckoutPage.ts** – minimal (`goto()`, `heading`), used for navigation/session scenarios.

**Optional `tests/fixtures.ts`** – extends `test` to provide `loginPage` and `homePage`.

### 1.2 Test data (`tests/data/`)

**users.ts** – `validUser = { email:'demo@techmart.com', password:'demo123', name:'Demo User' }` (overridable via env `TM_EMAIL`, `TM_PASSWORD`).

**loginData.ts**
- `invalidCredentials` (`{id, email, password, expectedError}`): wrong password; unknown email nobody@techmart.com; both wrong; uppercase email DEMO@TECHMART.COM; uppercase password DEMO123; password `' demo123 '`; SQL injection `' OR '1'='1`; XSS `<script>alert(1)</script>@x.com`; 300-char string. All expect "Invalid credentials".
- `invalidEmailFormats`: `plainaddress`, `@techmart.com`, `demo@`, `demo@@techmart.com`, `demo techmart@x.com`.
- `messages`: invalidCredentials 'Invalid credentials'; missingFields 'Email and password required'; networkError 'Network error. Please try again.'; loginToast 'Login successful! Redirecting...'; logoutToast 'Logged out successfully'; greeting 'Hi, Demo User'.
- `routes`: login `/login.html`, home `/`, register `/register.html`, cart `/cart.html`, checkout `/checkout.html`.
- `timeouts`: redirectMs 1500.

## 2. Scenarios

Starting state for all: fresh context, logged out, via `tests/seed.spec.ts`, then `loginPage.goto()`.

### 2.1 Page load and structure
1. Open login page. Expect title "Login - TechMart", h1 "Login to TechMart", empty Email/Password fields, enabled "Login" button, hidden error, visible "Sign up here" link.
2. Placeholders: "you@example.com" and "Enter your password".
3. Demo credentials block visible and matches `validUser`.
4. Cart count is 0 on a fresh session.

### 2.2 Successful login
1. `login(validUser)`.
2. Toast "Login successful! Redirecting...".
3. Redirect to `/` within ~1.5–3 s.
4. "Hi, Demo User" and Logout visible; Login/Sign Up links gone.
5. `localStorage.user` contains id, email, name and no password.
6. `GET /api/user` returns 200 with the demo email.

### 2.3 Invalid password
1. Valid email + wrong password; submit.
2. `#errorMessage` visible with "Invalid credentials".
3. URL stays `/login.html`; `localStorage.user` null; no redirect after 3 s.
4. Email retains its value (record whether password is kept or cleared).

### 2.4 Unknown email
1. nobody@techmart.com / demo123; submit.
2. "Invalid credentials", identical to wrong-password message (no user enumeration).

### 2.5 Empty fields (native validation)
1. Click Login with both empty: no request to `/api/login`, native validation on email, URL unchanged, error hidden.
2. Only email filled: password invalid, no request.
3. Only password filled: email invalid.
4. API-level check: `request.post('/api/login', {data:{}})` returns 400 "Email and password required".

### 2.6 Invalid email format
1. Data-driven over `invalidEmailFormats` with a valid password.
2. Native validation blocks submit (`validationMessage` non-empty); no API call.
3. Observation: `type=email` accepts `a@b`; expect server "Invalid credentials".

### 2.7 Whitespace and case handling
1. Email with trailing space: record result (browser may trim).
2. Password with leading/trailing space: "Invalid credentials".
3. Uppercase email: "Invalid credentials" – possible defect (emails normally case-insensitive).
4. Uppercase password: "Invalid credentials".
5. Whitespace-only password: record behavior.

### 2.8 Special and malicious input
1. Data-driven SQLi, XSS, 300-char strings.
2. "Invalid credentials" (or native email validation); no dialog, no injected script, no crash.
3. Error text set via textContent (not parsed as HTML).

### 2.9 Password masking
1. Password input `type="password"`.
2. No show/hide toggle (record).
3. Password not echoed in error message or URL after failed login.
4. Password not in localStorage after success.

### 2.10 Keyboard interaction
1. Enter in password field submits and logs in.
2. Enter in email field with both filled submits.
3. Tab order: logo, cart link, email, password, Login, "Sign up here".
4. Shift+Tab reverses it.
5. Space/Enter activate Login button.
6. Visible focus indicator on each control.
7. Enter with empty fields shows native validation, no request.

### 2.11 Accessibility and labels
1. Labels resolve to exactly one element each.
2. `html lang="en"`, single h1.
3. Error container lacks `role="alert"`/`aria-live` – record as gap.
4. Inputs have `required`.
5. Optional axe-core scan: no critical violations.
6. Contrast of error text; whole form keyboard operable.

### 2.12 Error message behaviour
1. Failed login shows error with error styling.
2. Second failed login: message shown, not duplicated.
3. Valid login after failure succeeds; note whether stale error clears.
4. `page.route('**/api/login', r => r.abort())` → "Network error. Please try again."; no redirect.
5. Mock 500: error element does not show "undefined"; record.
6. Slow response / double-click Login: no duplicate navigations; note no loading/disabled state.

### 2.13 Logout and re-login
1. Log in, click Logout: toast "Logged out successfully", auth area shows Login/Sign Up, `localStorage.user` removed, `/api/user` returns 401.
2. Log in again: success and greeting.
3. After logout, browser Back shows no logged-in UI.
4. Wrong password after logout: error, no logged-in state.

### 2.14 Navigation links
1. "Sign up here" → `/register.html`.
2. Logo → `/`.
3. Cart → `/cart.html`.
4. No "Forgot password" link (record as gap).
5. Back/Forward between login and register works.

### 2.15 Session persistence and redirects
1. Reload home after login: greeting persists.
2. New tab in same context: still logged in.
3. Visit `/login.html` while logged in: form still shown (no auto-redirect); record.
4. Logged-out visit to `/cart.html` and `/checkout.html`: pages load (no guard); record.
5. Clear `sessionId` cookie, keep localStorage: UI shows "Hi, Demo User" while `/api/user` is 401; record inconsistency.
6. Clear localStorage, keep cookie: logged-out UI, server session valid.
7. Guest cart item then login: cart count unchanged.
8. Two contexts concurrently: sessions don't interfere.

### 2.16 Repeated attempts
1. 10 consecutive failed logins show "Invalid credentials" each time; no lockout/rate limiting (record).
2. Valid login afterward succeeds.

### 2.17 Responsive layout (optional)
1. At 375x667 the form is fully usable; run successful login.

## 3. Execution notes
- Spec files: `tests/login/login-success.spec.ts`, `login-negative.spec.ts`, `login-validation.spec.ts`, `login-keyboard-a11y.spec.ts`, `login-session.spec.ts`. They import page objects and data modules only.
- Use `expect(...).toHaveText(messages.invalidCredentials)` with data-file constants.
- Server state is in-memory/global; tests must not depend on registration state.
- `beforeEach` goes through seed navigation with a fresh context.

## 4. Potential defects / observations to confirm
- Email matching is case-sensitive; no whitespace trimming.
- No "forgot password" link.
- No auto-redirect when already logged in.
- Client localStorage and server session can drift apart.
- Error container has no aria-live / role=alert.
- Stale error may not clear on resubmit/retype.
- No rate limiting or lockout.
- `/cart` and `/checkout` have no auth guard.
- Server stores passwords in plain text and keeps full user object (incl. password) in the session.
