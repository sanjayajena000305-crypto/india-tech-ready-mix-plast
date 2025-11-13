
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  negotiatedPrice?: number;
}

export interface User {
  mobile: string;
  role: 'customer' | 'admin';
}

export interface CompanyProfile {
  name: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
