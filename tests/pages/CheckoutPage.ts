import { Page, Locator } from '@playwright/test';
import { checkoutCustomer } from '../data/checkoutData';

export class CheckoutPage {
  readonly heading: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly address: Locator;
  readonly city: Locator;
  readonly state: Locator;
  readonly zip: Locator;
  readonly phone: Locator;
  readonly cardName: Locator;
  readonly cardNumber: Locator;
  readonly expiry: Locator;
  readonly cvv: Locator;
  readonly placeOrderButton: Locator;
  readonly confirmationHeading: Locator;
  readonly orderId: Locator;
  readonly continueShoppingLink: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Checkout', exact: true });
    this.firstName = page.getByRole('textbox', { name: 'First Name' });
    this.lastName = page.getByRole('textbox', { name: 'Last Name' });
    this.address = page.getByRole('textbox', { name: 'Street Address' });
    this.city = page.getByRole('textbox', { name: 'City' });
    this.state = page.getByLabel('State');
    this.zip = page.getByRole('textbox', { name: 'ZIP Code' });
    this.phone = page.getByRole('textbox', { name: 'Phone Number' });
    this.cardName = page.getByRole('textbox', { name: 'Name on Card' });
    this.cardNumber = page.getByRole('textbox', { name: 'Card Number' });
    this.expiry = page.getByRole('textbox', { name: 'Expiration Date' });
    this.cvv = page.getByRole('textbox', { name: 'CVV' });
    this.placeOrderButton = page.getByRole('button', { name: 'Place Order' });
    this.confirmationHeading = page.getByRole('heading', { name: /Order Confirmed!/ });
    this.orderId = page.locator('#orderId');
    this.continueShoppingLink = page.getByRole('link', { name: 'Continue Shopping' });
  }

  async fillForm(customer: typeof checkoutCustomer) {
    await this.firstName.fill(customer.firstName);
    await this.lastName.fill(customer.lastName);
    await this.address.fill(customer.address);
    await this.city.fill(customer.city);
    await this.state.selectOption(customer.state);
    await this.zip.fill(customer.zip);
    await this.phone.fill(customer.phone);
    await this.cardName.fill(customer.cardName);
    await this.cardNumber.fill(customer.cardNumber);
    await this.expiry.fill(customer.expiry);
    await this.cvv.fill(customer.cvv);
  }

  async placeOrder() {
    await this.placeOrderButton.click();
  }
}
