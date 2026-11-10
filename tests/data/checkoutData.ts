// Obviously fake test data only. 4242... is a well-known non-real test card number.
export const checkoutCustomer = {
  firstName: 'Test',
  lastName: 'Tester',
  address: '123 Test Street',
  city: 'Testville',
  state: 'Texas',
  zip: '12345',
  phone: '(555) 010-0000',
  cardName: 'Test Tester',
  cardNumber: '4242 4242 4242 4242',
  expiry: '12/30',
  cvv: '123',
};

export const checkoutMessages = {
  confirmedHeading: /Order Confirmed!/,
};

// The app renders the order id as a plain number (observed: 13 digits, e.g. 1794294234848).
export const orderIdPattern = /^\d+$/;
