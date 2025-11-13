
import { Product, CompanyProfile } from './types';

export const ADMIN_MOBILE_NUMBER = '9876543210';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Modern Ergonomic Chair',
    description: 'A comfortable and stylish chair designed for long hours of work, featuring adjustable lumbar support and breathable mesh.',
    price: 350,
    imageUrl: 'https://picsum.photos/seed/chair/600/400',
  },
  {
    id: 2,
    name: 'Wireless Mechanical Keyboard',
    description: 'Experience tactile typing with this RGB backlit wireless mechanical keyboard. Perfect for gamers and programmers.',
    price: 120,
    imageUrl: 'https://picsum.photos/seed/keyboard/600/400',
  },
  {
    id: 3,
    name: '4K Ultra-HD Monitor',
    description: 'A 27-inch 4K UHD monitor with stunning color accuracy and HDR support. Ideal for creative professionals.',
    price: 450,
    imageUrl: 'https://picsum.photos/seed/monitor/600/400',
  },
  {
    id: 4,
    name: 'Noise-Cancelling Headphones',
    description: 'Immerse yourself in sound with these premium noise-cancelling headphones with up to 30 hours of battery life.',
    price: 250,
    imageUrl: 'https://picsum.photos/seed/headphones/600/400',
  },
  {
    id: 5,
    name: 'Smart Desk Lamp',
    description: 'A minimalist desk lamp with adjustable brightness and color temperature, controllable via a mobile app.',
    price: 80,
    imageUrl: 'https://picsum.photos/seed/lamp/600/400',
  },
  {
    id: 6,
    name: 'High-Speed Document Scanner',
    description: 'Digitize your documents quickly with this high-speed scanner featuring automatic document feeding.',
    price: 220,
    imageUrl: 'https://picsum.photos/seed/scanner/600/400',
  },
];

export const INITIAL_COMPANY_PROFILE: CompanyProfile = {
  name: 'InnovateX Supplies',
  address: '123 Tech Avenue, Silicon Valley, CA 94002',
  contactEmail: 'support@innovatex.com',
  contactPhone: '1-800-555-TECH',
};
