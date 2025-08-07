// Place.ts

// Define the possible route types
export type ROUTETYPES = 'ROUTE 1' | 'ROUTE 2' | 'ROUTE 3' | 'ADDITIONAL';

// Define Route object structure
export interface Route {
  id: string;
  "Route type": ROUTETYPES;
  "Branch Name": string;
}

// Define the full Place structure
export interface Place {
  id: string;
  RouteGroup: string;      // Could be the zone name or city group
  Route: Route[];            // Main route info (ROUTE 1, 2, 3, ADDITIONAL)
  type: 'COMPANY VEHICLE'|'PRIVATE VEHICLE'|'CUSTOMER VEHICLE';
  location: string;     // e.g., "CHENGALPATTU"
  distance?: string;    // e.g., "99 KMS" (optional)
}
