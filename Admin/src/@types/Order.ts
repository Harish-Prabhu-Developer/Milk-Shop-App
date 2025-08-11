// Order.ts
import { Branch } from "./User";


type OrderStatus = 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';
type PaymentStatus = 'Pending' | 'Completed' | 'Failed';
type ReceivedStatus = 'Pending' | 'Confirmed' | 'Partial' | 'Issue Reported';

export interface OrderProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  image: any;
  unit: string;
  description: string;
}

export interface ReceivedItem {
  id: string;           // Product ID
  receivedQty: number;  // Quantity received
}

export interface Order {
  id: string;
  OrderId: string;
  ProductData: OrderProduct[];
  Branch?:Branch;         // e.g., "KALLIKUPPAM NKC"
  OrderDate: string;
  TotalAmount: number;
  OrderStatus: OrderStatus;
  PaymentStatus: PaymentStatus;
  ReceivedStatus: ReceivedStatus;
  ReceivedDate?: string;
  ReceivedItems?: ReceivedItem[];
  ConfirmOrderDate?: string;
  CancelOrderDate?: string;
}
