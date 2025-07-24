// Place.ts

// Define the possible route types
type ROUTETYPES = 'ROUTE 1' | 'ROUTE 2' | 'ROUTE 3' | 'ADDITIONAL';

// Define Route object structure
export interface Route {
  id: string;
  "Route type": ROUTETYPES;
  "Branch Name": string;
}

// Define structure for company vehicle info
export interface VehicleDetails {
  id: string;
  type: 'COMPANY VEHICLE'|'PRIVATE VEHICLE'|'CUSTOMER VEHICLE';
  location: string;     // e.g., "CHENGALPATTU"
  distance?: string;    // e.g., "99 KMS" (optional)
}

// Define the full Place structure
export interface Place {
  id: string;
  RouteGroup: string;      // Could be the zone name or city group
  Route: Route[];            // Main route info (ROUTE 1, 2, 3, ADDITIONAL)
  VehicleDetails?: VehicleDetails; // Optional vehicle info (company vehicle destinations)
}
