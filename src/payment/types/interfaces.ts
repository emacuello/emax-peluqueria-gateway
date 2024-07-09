export interface Products {
  _id: string;
  name: string;
  price: number;
  totalPrice: number;
  description: string;
  image: string[];
  stock: number;
  offerprice: number;
  offer: boolean;
  quantity: number;
  __v: number;
  total: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  birthdate: string;
  nDni: number;
  role: string;
  socialUser: boolean;
  appointment: any[];
  serverPrincipal?: boolean;
}

export interface UpdateStocks {
  products: ProductId[];
}

interface ProductId {
  _id: string;
  quantity: number;
}
