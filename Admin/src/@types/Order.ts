import { Product } from "./Product";


type OrderStatus = 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';
type PaymentStatus = 'Pending' | 'Completed' | 'Failed';
// type DeliveryStatus = 'Pending' | 'Out for Delivery' | 'Delivered' | 'Returned';
type ReceivedStatus = 'Pending' | 'Confirmed' | 'Partial' | 'Issue Reported';

// type BranchType = 'NKC Local' | 'NKC OUT' | 'AKC Local' | 'AKC OUT';
// type ROUTETYPES = 'ROUTE 1' | 'ROUTE 2' | 'ROUTE 3';

// export interface ClientBranch {
//   id: string;                 // Unique client ID
//   branchName: string;        // e.g., "KALLIKUPPAM NKC"
//   branchType: BranchType;    // e.g., "NKC Local"
//   phone?: string;             // Contact number
//   location: string;          // Local NKC / Thiruvallur, etc.
//   routeType: ROUTETYPES;     // e.g., "ROUTE 1"
//   routeName: string;         // e.g., "KALLIKUPPAM NKC"
//   address?: string;          // Optional full address
//   contactPerson?: string;    // Optional contact person name
//   isActive?: boolean;         // For deactivating branches
//   registeredDate?: string;    // ISO date
// }

// export interface OrderProduct {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
//   total: number;
//   image: any;
//   unit: string;
//   description: string;
// }

export interface Items {
  product:Product;
  quantity: number;
  _id: string;
  Total?: number; 
};
export interface ReceivedItem {
  productId: string;
  receivedQty: number;
}

export interface Order {
  _id: string;
  OrderId: string;
  ProductData: Items[];
  Branch?: {
    _id: string;
    branchName: string;
    email: string;
    phone: string;
    role: string;
  }; // e.g., "KALLIKUPPAM NKC"
  TotalAmount: number;
  OrderStatus: OrderStatus;
  PaymentStatus: PaymentStatus;
  //DeliveryStatus: DeliveryStatus;
  ReceivedStatus: ReceivedStatus;
  OrderDate: string;
  ReceivedItems?: ReceivedItem[];
  ReceivedDate?: string;
  createdAt: string;
  updatedAt: string;
  __v: string;
  ConfirmOrderDate?: string;
  CancelOrderDate?: string;
}

export interface UpdateReceivedItems {
  OrderId: string;
  Items: {
    ReceivedItems?: ReceivedItem[];
    OrderStatus?: OrderStatus;
    CancelOrderDate?: string;
  };
  
}
