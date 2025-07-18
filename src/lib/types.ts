export interface Material {
  id: number;
  name: string;
  quantity: number;
  category: string | null; // Allow category to be null to match db
  lastUpdated?: string; // This property is not in the db, but we can keep it optional
}
