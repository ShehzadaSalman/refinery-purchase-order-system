import mockData from "../mockData.json";
import { CatalogItem, DEFAULT_SORT, SORT_OPTIONS, SortValue } from "../types/catalog";

const FETCH_DELAY_MS = 900;

const validSortValues = new Set<SortValue>(SORT_OPTIONS.map((option) => option.value));

export function fetchCatalogMock(): Promise<CatalogItem[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockData as CatalogItem[]), FETCH_DELAY_MS);
  });
}

export function normalizeSort(value: string | null): SortValue {
  if (!value || !validSortValues.has(value as SortValue)) return DEFAULT_SORT;
  return value as SortValue;
}

export function sortItems(items: CatalogItem[], sortBy: SortValue): CatalogItem[] {
  const cloned = [...items];

  switch (sortBy) {
    case "price-asc":
      return cloned.sort((a, b) => a.priceUsd - b.priceUsd);
    case "price-desc":
      return cloned.sort((a, b) => b.priceUsd - a.priceUsd);
    case "lead-asc":
      return cloned.sort((a, b) => a.leadTimeDays - b.leadTimeDays);
    case "lead-desc":
      return cloned.sort((a, b) => b.leadTimeDays - a.leadTimeDays);
    case "supplier-asc":
      return cloned.sort((a, b) => a.supplier.localeCompare(b.supplier));
    default:
      return cloned;
  }
}

export function filterCatalogItems(
  items: CatalogItem[],
  keyword: string,
  categoryFilter: string,
  inStockOnly: boolean,
): CatalogItem[] {
  const normalizedKeyword = keyword.toLowerCase();

  return items.filter((item) => {
    const matchesSearch =
      normalizedKeyword.length === 0 ||
      item.name.toLowerCase().includes(normalizedKeyword) ||
      item.id.toLowerCase().includes(normalizedKeyword) ||
      item.supplier.toLowerCase().includes(normalizedKeyword) ||
      item.manufacturer.toLowerCase().includes(normalizedKeyword) ||
      item.model.toLowerCase().includes(normalizedKeyword);

    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesStock = !inStockOnly || item.inStock;

    return matchesSearch && matchesCategory && matchesStock;
  });
}
