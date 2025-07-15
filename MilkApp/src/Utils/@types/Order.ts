type OrderStatus = 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';
type PaymentStatus = 'Pending' | 'Completed' | 'Failed';
type DeliveryStatus = 'Pending' | 'Out for Delivery' | 'Delivered' | 'Returned';
type ReceivedStatus = 'Pending' | 'Confirmed' | 'Partial' | 'Issue Reported';

type BranchType = 'NKC Local' | 'NKC OUT' | 'AKC Local' | 'AKC OUT';
type ROUTETYPES = 'ROUTE 1' | 'ROUTE 2' | 'ROUTE 3';

export interface ClientBranch {
  id: string;                 // Unique client ID
  branchName: string;        // e.g., "KALLIKUPPAM NKC"
  branchType: BranchType;    // e.g., "NKC Local"
  phone?: string;             // Contact number
  location: string;          // Local NKC / Thiruvallur, etc.
  routeType: ROUTETYPES;     // e.g., "ROUTE 1"
  routeName: string;         // e.g., "KALLIKUPPAM NKC"
  address?: string;          // Optional full address
  contactPerson?: string;    // Optional contact person name
  isActive?: boolean;         // For deactivating branches
  registeredDate?: string;    // ISO date
}

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
  Branch?:ClientBranch;         // e.g., "KALLIKUPPAM NKC"
  OrderDate: string;
  TotalAmount: number;
  OrderStatus: OrderStatus;
  PaymentStatus: PaymentStatus;
  //DeliveryStatus: DeliveryStatus;
  ReceivedStatus: ReceivedStatus;
  ReceivedDate?: string;
  ReceivedItems?: ReceivedItem[];
  ConfirmOrderDate?: string;
  CancelOrderDate?: string;

}
