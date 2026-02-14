import { useMemo } from "react";
import { filterCatalogItems, sortItems } from "../services/catalog.service";
import { CatalogItem, SortValue } from "../types/catalog";

export function useCatalogResults(
  items: CatalogItem[],
  debouncedSearch: string,
  categoryFilter: string,
  inStockOnly: boolean,
  sortBy: SortValue,
) {
  const categories = useMemo(() => {
    const unique = [...new Set(items.map((item) => item.category))];
    return unique.sort((a, b) => a.localeCompare(b));
  }, [items]);

  const filteredItems = useMemo(() => {
    const filtered = filterCatalogItems(items, debouncedSearch, categoryFilter, inStockOnly);
    return sortItems(filtered, sortBy);
  }, [items, debouncedSearch, categoryFilter, inStockOnly, sortBy]);

  return { categories, filteredItems };
}
