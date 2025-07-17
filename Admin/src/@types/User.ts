export interface Branch {
  id: string;
  branchName: string;
  phone: string;
  location: string;
  routeName: string; // Match with route in placement
  type: "NKC Local" | "NKC OUT" | "AKC Local" | "AKC OUT"; // as per survey
}
