// Product names as seeded in sample-app/server.js
export const productNames = [
  'Mechanical Keyboard',
  'Monitor Stand',
  'Mouse Pad XL',
  'USB-C Hub',
  'Webcam HD',
  'Wireless Headphones',
];

export const cartMessages = {
  added: 'Added to cart!',
};

export function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}
