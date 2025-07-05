
type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
type PaymentStatus = 'Pending' | 'Completed' | 'Failed';
type DeliveryStatus = 'Pending' | 'Out for Delivery' | 'Delivered' | 'Returned';
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
export interface Order {
    id: string; // Optional for new orders
    OrderId: string;
    ProductData: OrderProduct[];
    UserId: string;
    UserName:string; 
    OrderDate: string;
    TotalAmount: number;
    OrderStatus: OrderStatus;
    PaymentStatus: PaymentStatus;
    DeliveryStatus: DeliveryStatus;
}

