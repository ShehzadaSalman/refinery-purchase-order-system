import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { normalizeSort } from "../services/catalog.service";
import { DEFAULT_SORT, SortValue } from "../types/catalog";
import { useDebouncedValue } from "./useDebouncedValue";

const DEBOUNCE_MS = 350;
const PROCESS_DELAY_MS = 450;

export function useCatalogControls(isFetching: boolean) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialSearch = useMemo(() => searchParams.get("q") ?? "", [searchParams]);
  const initialCategory = useMemo(() => searchParams.get("category") ?? "all", [searchParams]);
  const initialInStock = useMemo(() => searchParams.get("inStock") === "1", [searchParams]);
  const initialSort = useMemo(
    () => normalizeSort(searchParams.get("sort")),
    [searchParams],
  );

  const [searchInput, setSearchInput] = useState<string>(initialSearch);
  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategory || "all");
  const [inStockOnly, setInStockOnly] = useState<boolean>(initialInStock);
  const [sortBy, setSortBy] = useState<SortValue>(initialSort);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const debouncedSearch = useDebouncedValue(searchInput.trim(), DEBOUNCE_MS);

  useEffect(() => {
    if (isFetching || !isProcessing) return;

    const timeout = setTimeout(() => {
      setIsProcessing(false);
    }, PROCESS_DELAY_MS);

    return () => clearTimeout(timeout);
  }, [isFetching, isProcessing]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedSearch) params.set("q", debouncedSearch);
    if (categoryFilter !== "all") params.set("category", categoryFilter);
    if (inStockOnly) params.set("inStock", "1");
    if (sortBy !== DEFAULT_SORT) params.set("sort", sortBy);

    const next = params.toString();
    const current = searchParams.toString();

    if (next !== current) {
      router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
    }
  }, [debouncedSearch, categoryFilter, inStockOnly, sortBy, pathname, router, searchParams]);

  const setSearch = (value: string) => {
    setSearchInput(value);
    if (!isFetching) setIsProcessing(true);
  };

  const setCategory = (value: string) => {
    setCategoryFilter(value);
    if (!isFetching) setIsProcessing(true);
  };

  const setStockOnly = (value: boolean) => {
    setInStockOnly(value);
    if (!isFetching) setIsProcessing(true);
  };

  const setSort = (value: string) => {
    setSortBy(normalizeSort(value));
    if (!isFetching) setIsProcessing(true);
  };

  return {
    searchInput,
    setSearch,
    categoryFilter,
    setCategory,
    inStockOnly,
    setStockOnly,
    sortBy,
    setSort,
    debouncedSearch,
    isProcessing,
  };
}
