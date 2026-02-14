export type SortValue =
  | "price-asc"
  | "price-desc"
  | "lead-asc"
  | "lead-desc"
  | "supplier-asc";

export interface CatalogItem {
  id: string;
  name: string;
  category: string;
  supplier: string;
  manufacturer: string;
  model: string;
  description: string;
  leadTimeDays: number;
  priceUsd: number;
  inStock: boolean;
  specs: Record<string, string | undefined>;
  compatibleWith?: string[];
}

export const DEFAULT_SORT: SortValue = "price-asc";

export const SORT_OPTIONS: { value: SortValue; label: string }[] = [
  { value: "price-asc", label: "Price Low->High" },
  { value: "price-desc", label: "Price High->Low" },
  { value: "lead-asc", label: "Lead Time Low->High" },
  { value: "lead-desc", label: "Lead Time High->Low" },
  { value: "supplier-asc", label: "Supplier A-Z" },
];
