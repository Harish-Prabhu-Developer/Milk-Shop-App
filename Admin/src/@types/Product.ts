export interface Product {
  _id: string;
  name: string;
  price: number;
  unit: string;         // e.g., "1L", "500g"
  description: string;
  nutrition: string;
  image: string;
  __v?: number;
  createdBy?: createdBy;
  category?: string;    // Optional: Milk, Curd, Paneer, etc.
  isActive?: boolean;   // If set to false, hide from client
}

interface createdBy{
  _id: string;
  branchName: string;
  email: string;
  phone: string;

}




export interface ProductWithQuantity extends Product {
  quantity: number;
}
