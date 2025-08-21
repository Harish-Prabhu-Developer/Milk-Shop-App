import { Order } from "./Order";

// analytics.ts
export interface CardAnalytics {
  totalOrders: number;
  delivered: number;
  pending: number;
  processing: number;
  cancelled: number;
  revenue: number;
}

export interface SaleData {
  label: string;
  value: number;
}

export interface RecentOrder {
  id: number;
  branchName: string;
  status: string;
  amount: number;
  orderdetails?: any; // you can replace `any` with a proper Order interface later
}

export interface DashboardType {
  CardAnalytics: CardAnalytics;
  Last7Sales: SaleData[];
  Recent5Orders: RecentOrder[];
}

interface AnalyticsState {
  Dashboard: DashboardType | null;
  loading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  Dashboard: null,
  loading: false,
  error: null,
};
