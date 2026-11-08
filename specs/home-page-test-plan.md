# TechMart Home Page – Test Plan

## Application Overview

TechMart is a demo e-commerce store served at http://localhost:3000. The home page (/) shows a "Welcome to TechMart" hero, a filter bar (Category select, Max Price slider defaulting to $200, Sort by select), a grid of product cards (image, name, category, price, stock, Add to Cart button), a header with search box, cart link (Cart (0)) and Login / Sign Up links when logged out, and a footer. Verified live: 6 products on load sorted by name; search "usb" returns only USB-C Hub; Sort by "Price: High to Low" is selectable. Source reference (sample-app/public/app.js, server.js): filters call GET /api/products with category, search and maxPrice; sorting is client-side; Add to Cart posts to the cart API and shows a toast. Plan derived from live exploration plus source reading; selectors and messages should be confirmed by the seed test before implementation.

## Test Scenarios

### 1. Page load and structure

**Seed:** `tests/seed.spec.ts`

#### 1.1. should show title, hero heading and subtitle

**File:** `tests/home/home-page-load.spec.ts`

**Steps:**
  1. Navigate to / 
    - expect: Page title is 'TechMart - Your Tech Essentials Store'
    - expect: h1 'Welcome to TechMart' is visible
    - expect: Paragraph 'Find the best tech accessories for your setup' is visible

#### 1.2. should render all six seeded products with name, category, price and stock

**File:** `tests/home/home-page-load.spec.ts`

**Steps:**
  1. Navigate to /
    - expect: Product grid contains 6 cards: Mechanical Keyboard, Monitor Stand, Mouse Pad XL, USB-C Hub, Webcam HD, Wireless Headphones
    - expect: Each card shows a category, a price formatted as $xx.xx and an 'N in stock' line
    - expect: Each card has an image with alt text equal to the product name and an 'Add to Cart' button

#### 1.3. should show filter controls with default values

**File:** `tests/home/home-page-load.spec.ts`

**Steps:**
  1. Navigate to /
    - expect: Category select shows 'All Categories' with options Electronics and Accessories
    - expect: Max Price slider shows 'Max Price: $200' with value 200
    - expect: Sort by select shows 'Name' selected with options 'Price: Low to High' and 'Price: High to Low'

#### 1.4. should show cart count 0 and Login / Sign Up links for a guest

**File:** `tests/home/home-page-load.spec.ts`

**Steps:**
  1. Navigate to / in a fresh context
    - expect: Header link reads 'Cart (0)' and points to /cart.html
    - expect: 'Login' links to /login.html and 'Sign Up' links to /register.html
    - expect: Footer shows '© 2024 TechMart. Demo store for testing purposes.'

### 2. Navigation

**Seed:** `tests/seed.spec.ts`

#### 2.1. should return to home when clicking the TechMart logo

**File:** `tests/home/home-navigation.spec.ts`

**Steps:**
  1. From /cart.html click the '🛒 TechMart' logo
    - expect: URL is /
    - expect: Home heading is visible

#### 2.2. should navigate to login, sign up and cart from the header

**File:** `tests/home/home-navigation.spec.ts`

**Steps:**
  1. Click 'Login'
    - expect: URL is /login.html
  2. Go back, click 'Sign Up'
    - expect: URL is /register.html
  3. Go back, click 'Cart (0)'
    - expect: URL is /cart.html

### 3. Search

**Seed:** `tests/seed.spec.ts`

#### 3.1. should filter products by name when searching with Enter

**File:** `tests/home/home-search.spec.ts`

**Steps:**
  1. Type 'usb' in 'Search products' and press Enter
    - expect: Only 'USB-C Hub' is shown
    - expect: Other five products are not shown

#### 3.2. should filter products when clicking the Search button

**File:** `tests/home/home-search.spec.ts`

**Steps:**
  1. Type 'usb' and click the Search button
    - expect: Only 'USB-C Hub' is shown

#### 3.3. should match case-insensitively

**File:** `tests/home/home-search.spec.ts`

**Steps:**
  1. Search 'MONITOR' and then 'monitor'
    - expect: 'Monitor Stand' is shown for both

#### 3.4. should show no products for a term that matches nothing

**File:** `tests/home/home-search.spec.ts`

**Steps:**
  1. Search 'zzzznotaproduct'
    - expect: No product cards are shown
    - expect: Record whether an empty-state message appears (possible gap)

#### 3.5. should show all products again when search is cleared

**File:** `tests/home/home-search.spec.ts`

**Steps:**
  1. Search 'usb' then clear the box and press Enter
    - expect: All six products are shown

#### 3.6. should handle special characters without errors

**File:** `tests/home/home-search.spec.ts`

**Steps:**
  1. Search '<script>alert(1)</script>' and "' OR '1'='1"
    - expect: No dialog appears
    - expect: No products are shown and the page does not crash
    - expect: Search text is not rendered as HTML

### 4. Category filter

**Seed:** `tests/seed.spec.ts`

#### 4.1. should show only products in the selected category

**File:** `tests/home/home-filters.spec.ts`

**Steps:**
  1. Select 'Electronics'
    - expect: Only electronics products are shown (Mechanical Keyboard, USB-C Hub, Webcam HD, Wireless Headphones)
  2. Select 'Accessories'
    - expect: Only Monitor Stand and Mouse Pad XL are shown
  3. Select 'All Categories'
    - expect: All six products are shown

### 5. Max price filter

**Seed:** `tests/seed.spec.ts`

#### 5.1. should hide products above the slider value

**File:** `tests/home/home-filters.spec.ts`

**Steps:**
  1. Set Max Price slider to 80
    - expect: Label reads 'Max Price: $80'
    - expect: Only products priced at or below $80 are shown (Mouse Pad XL $24.99, USB-C Hub $49.99, Webcam HD $69.99)

#### 5.2. should show all products at the maximum slider value

**File:** `tests/home/home-filters.spec.ts`

**Steps:**
  1. Set slider to its maximum
    - expect: Label updates and all products at or below the maximum are shown

#### 5.3. should combine with category filter

**File:** `tests/home/home-filters.spec.ts`

**Steps:**
  1. Select 'Electronics' and set slider to 60
    - expect: Only USB-C Hub ($49.99) is shown

### 6. Sorting

**Seed:** `tests/seed.spec.ts`

#### 6.1. should sort by price low to high

**File:** `tests/home/home-sort.spec.ts`

**Steps:**
  1. Select 'Price: Low to High'
    - expect: Products appear in ascending price order, starting with Mouse Pad XL ($24.99)

#### 6.2. should sort by price high to low

**File:** `tests/home/home-sort.spec.ts`

**Steps:**
  1. Select 'Price: High to Low'
    - expect: Products appear in descending price order, starting with Mechanical Keyboard ($129.99)

#### 6.3. should sort by name alphabetically

**File:** `tests/home/home-sort.spec.ts`

**Steps:**
  1. Select 'Price: High to Low' then 'Name'
    - expect: Products appear alphabetically: Mechanical Keyboard, Monitor Stand, Mouse Pad XL, USB-C Hub, Webcam HD, Wireless Headphones

#### 6.4. should keep sort order after filtering

**File:** `tests/home/home-sort.spec.ts`

**Steps:**
  1. Select 'Price: Low to High' then category 'Electronics'
    - expect: Electronics products remain in ascending price order

### 7. Add to cart

**Seed:** `tests/seed.spec.ts`

#### 7.1. should add a product to the cart and show a toast

**File:** `tests/home/home-add-to-cart.spec.ts`

**Steps:**
  1. Click 'Add to Cart' on USB-C Hub
    - expect: Toast 'Added to cart!' appears
    - expect: Header shows 'Cart (1)'

#### 7.2. should increase quantity when adding the same product twice

**File:** `tests/home/home-add-to-cart.spec.ts`

**Steps:**
  1. Click 'Add to Cart' on USB-C Hub twice
    - expect: Header count reflects the total quantity (2); record whether the cart shows one line with quantity 2

#### 7.3. should keep cart count when adding several different products

**File:** `tests/home/home-add-to-cart.spec.ts`

**Steps:**
  1. Add Mouse Pad XL and Webcam HD
    - expect: Header shows 'Cart (2)'

#### 7.4. should show an error toast when the add request fails

**File:** `tests/home/home-add-to-cart.spec.ts`

**Steps:**
  1. Intercept POST to the cart API and fail it (e.g. 500), then click Add to Cart
    - expect: Error toast 'Failed to add item' is shown
    - expect: Header count is unchanged

#### 7.5. should not add an out-of-stock product (if any exist)

**File:** `tests/home/home-add-to-cart.spec.ts`

**Steps:**
  1. Check each card's stock value; if a product reaches 0 stock, click Add to Cart
    - expect: Button is disabled or an error toast is shown; count does not change
    - expect: Skip if all products have stock

#### 7.6. should persist cart count after reload

**File:** `tests/home/home-add-to-cart.spec.ts`

**Steps:**
  1. Add a product, reload /
    - expect: Header still shows the cart count

### 8. Logged-in state

**Seed:** `tests/seed.spec.ts`

#### 8.1. should show greeting and Logout when a user is logged in

**File:** `tests/home/home-session.spec.ts`

**Steps:**
  1. Log in as demo@techmart.com / demo123 on /login.html, then go to /
    - expect: Text 'Hi, Demo User' is visible
    - expect: Logout button is visible
    - expect: Login and Sign Up links are not visible

#### 8.2. should log out from the home page

**File:** `tests/home/home-session.spec.ts`

**Steps:**
  1. Click Logout
    - expect: Toast 'Logged out successfully' appears
    - expect: Login and Sign Up links are shown again
    - expect: localStorage 'user' is removed

#### 8.3. should keep greeting after reload

**File:** `tests/home/home-session.spec.ts`

**Steps:**
  1. Reload / while logged in
    - expect: 'Hi, Demo User' remains visible

### 9. Responsive layout and accessibility

**Seed:** `tests/seed.spec.ts`

#### 9.1. should keep the product grid usable at phone width

**File:** `tests/home/home-layout.spec.ts`

**Steps:**
  1. Resize to 375x667 and open /
    - expect: All product cards and Add to Cart buttons are reachable
    - expect: No horizontal page scroll

#### 9.2. should have one h1 and product headings as h3

**File:** `tests/home/home-layout.spec.ts`

**Steps:**
  1. Inspect headings
    - expect: Exactly one h1
    - expect: Each product name is an h3

#### 9.3. should support keyboard navigation to Add to Cart

**File:** `tests/home/home-layout.spec.ts`

**Steps:**
  1. Tab from the search box through filters to the first Add to Cart button and press Enter
    - expect: Focus is visible on each control
    - expect: Product is added and toast appears

#### 9.4. should have accessible names for filter controls

**File:** `tests/home/home-layout.spec.ts`

**Steps:**
  1. Query by role for Category, Max Price and Sort by controls
    - expect: Each control has a label ('Category:', 'Max Price: $200', 'Sort by:')

### 10. Negative and resilience

**Seed:** `tests/seed.spec.ts`

#### 10.1. should show an error state when the products API fails

**File:** `tests/home/home-resilience.spec.ts`

**Steps:**
  1. Intercept GET /api/products and return 500, then load /
    - expect: Record what the grid shows (empty grid, stale content or error message); no uncaught JS error crashes the page

#### 10.2. should handle a slow products API without breaking the page

**File:** `tests/home/home-resilience.spec.ts`

**Steps:**
  1. Delay GET /api/products by 3 s
    - expect: Hero and filters render; products appear after the delay
