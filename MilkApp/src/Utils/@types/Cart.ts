import { Product } from "./Products";

export interface Items {
  product:Product;
  quantity: number;
  _id: string;
  Total?: number; 
};
export interface CartProduct {
    _id: string;
    user: string;
    items: Items[];
    createdAt: string;
    updatedAt: string;
    __v?: number;
    totalAmount?: number;
}


export interface AddToCart {
  productId: string;
  quantity: number;

}

