// User.ts
export interface Branch {
  id: string;    // Unique client ID
  branchName: string; // e.g., "KALLIKUPPAM NKC"
  phone: string;     // Contact number
  address?: string; // Optional full address
  registeredDate?: string;
  contactPerson?: string; // Optional contact person name
  location: string;  // Local NKC / Thiruvallur, etc.
  routeName: string; // Match with route in placement
  type: "NKC Local" | "NKC OUT" | "AKC Local" | "AKC OUT"; // as per survey
}
