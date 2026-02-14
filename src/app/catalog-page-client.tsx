"use client";

import { useCatalogControls } from "../hooks/useCatalogControls";
import { useCatalogData } from "../hooks/useCatalogData";
import { useCatalogResults } from "../hooks/useCatalogResults";
import { CatalogCard } from "../components/CatalogCard";
import { CatalogCardSkeleton } from "../components/CatalogCardSkeleton";
import { SORT_OPTIONS } from "../types/catalog";

export default function CatalogPageClient() {
  const { items, isFetching } = useCatalogData();
  const {
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
  } = useCatalogControls(isFetching);

  const { categories, filteredItems } = useCatalogResults(
    items,
    debouncedSearch,
    categoryFilter,
    inStockOnly,
    sortBy,
  );

  const isLoading = isFetching || isProcessing;

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-8">
      <main className="mx-auto max-w-7xl">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900">Catalog</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Browse items with search, filters, sorting, and URL-synced state.
          </p>
        </header>

        <section className="mb-6 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <label className="flex flex-col gap-1 text-sm text-zinc-700">
              Search
              <input
                type="text"
                value={searchInput}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Name, ID, supplier, manufacturer, model"
                className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none ring-zinc-300 focus:ring"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm text-zinc-700">
              Category
              <select
                value={categoryFilter}
                onChange={(event) => setCategory(event.target.value)}
                className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none ring-zinc-300 focus:ring"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm text-zinc-700">
              Sort
              <select
                value={sortBy}
                onChange={(event) => setSort(event.target.value)}
                className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none ring-zinc-300 focus:ring"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(event) => setStockOnly(event.target.checked)}
                className="h-4 w-4"
              />
              In-stock only
            </label>
          </div>
        </section>

        <section>
          <div className="mb-4 text-sm text-zinc-600">
            {isLoading ? "Loading catalog..." : `${filteredItems.length} item(s) found`}
          </div>

          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 9 }).map((_, index) => (
                <CatalogCardSkeleton key={index} />
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-600">
              No items match the current filters.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <CatalogCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
