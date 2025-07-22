export interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;         // e.g., "1L", "500g"
  description: string;
  nutrition: string;
  image: any;
  category?: string;    // Optional: Milk, Curd, Paneer, etc.
  isActive?: boolean;   // If set to false, hide from client
}

export interface CartProduct extends Product {
  quantity: number;
}
