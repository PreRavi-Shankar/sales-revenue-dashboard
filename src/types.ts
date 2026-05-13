/** Normalized row after any import path (CSV, Excel, DB JSON). */
export type SaleRow = {
  id: string;
  date: string; // YYYY-MM-DD
  product: string;
  category: string;
  region: string;
  quantity: number;
  unitPrice: number;
  revenue: number;
};

export type ImportSource = "csv" | "excel" | "database";
