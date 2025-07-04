export interface Product{
  id: string;
  name: string;
  price: number;
  unit: string;
  description: string;
  nutrition: string;
  image: any;
}


export interface CartProduct {
  id: string;
  name: string;
  price: number;
  unit: string;
  description: string;
  nutrition: string;
  image: any;
  quantity: number;
}