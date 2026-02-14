"use client";

import { useEffect, useState } from "react";
import { useCatalogControls } from "../hooks/useCatalogControls";
import { useCatalogData } from "../hooks/useCatalogData";
import { useCatalogResults } from "../hooks/useCatalogResults";
import { CatalogCard } from "../components/CatalogCard";
import { CatalogCardSkeleton } from "../components/CatalogCardSkeleton";
import { InlineToast } from "../components/po/InlineToast";
import { PODraftSummary } from "../components/po/PODraftSummary";
import { usePODraftStore } from "../store/poDraftStore";
import { SORT_OPTIONS } from "../types/catalog";
import type { CatalogItem } from "../types/catalog";

type ToastState = {
  message: string;
  variant: "success" | "error";
};

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
    clearFilters,
    debouncedSearch,
    isProcessing,
  } = useCatalogControls(isFetching);

  const draft = usePODraftStore((state) => state.draft);
  const lastError = usePODraftStore((state) => state.lastError);
  const addCatalogItem = usePODraftStore((state) => state.addCatalogItem);
  const clearError = usePODraftStore((state) => state.clearError);
  const clearDraft = usePODraftStore((state) => state.clearDraft);
  const [toast, setToast] = useState<ToastState | null>(null);

  const { categories, filteredItems } = useCatalogResults(
    items,
    debouncedSearch,
    categoryFilter,
    inStockOnly,
    sortBy,
  );

  const draftTotal = draft.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const isLoading = isFetching || isProcessing;

  useEffect(() => {
    if (!toast) return;

    const timeout = setTimeout(() => {
      setToast(null);
    }, 2200);

    return () => clearTimeout(timeout);
  }, [toast]);

  const handleAddToDraft = (item: CatalogItem) => {
    const result = addCatalogItem(item, 1);
    if (result.ok) {
      setToast({ message: `${item.name} added to draft.`, variant: "success" });
      return;
    }

    if (result.error.code === "SUPPLIER_MISMATCH") {
      setToast({ message: "Clear your draft items to add new item.", variant: "error" });
    }
  };

  const handleClearDraft = () => {
    clearDraft();
    setToast({ message: "Draft cleared.", variant: "success" });
  };

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-8">
      <main className="mx-auto max-w-7xl space-y-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900">Catalog</h1>
          <p className="mt-1 text-sm text-zinc-900">
            Browse items and add them to your PO draft.
          </p>
        </header>

        <PODraftSummary
          supplier={draft.supplier}
          itemCount={draft.items.length}
          totalValue={draftTotal}
          errorMessage={lastError?.message ?? null}
          onDismissError={clearError}
          onClearDraft={handleClearDraft}
        />

        <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex justify-end">
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-900 hover:bg-zinc-100"
            >
              Clear Filters
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <label className="flex flex-col gap-1 text-sm text-zinc-900">
              Search
              <input
                type="text"
                value={searchInput}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Name, ID, supplier, manufacturer, model"
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-zinc-300 focus:ring-2"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm text-zinc-900">
              Category
              <select
                value={categoryFilter}
                onChange={(event) => setCategory(event.target.value)}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-zinc-300 focus:ring-2"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm text-zinc-900">
              Sort
              <select
                value={sortBy}
                onChange={(event) => setSort(event.target.value)}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-zinc-300 focus:ring-2"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex flex-col gap-1 text-sm text-zinc-900 justify-center">
              <span>Availability</span>
              <label className="flex items-center gap-2 font-medium">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(event) => setStockOnly(event.target.checked)}
                  className="h-4 w-4"
                />
                In-stock only
              </label>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="mb-4 text-sm text-zinc-900">
            {isLoading ? "Loading catalog..." : `${filteredItems.length} item(s) found`}
          </div>

          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 9 }).map((_, index) => (
                <CatalogCardSkeleton key={index} />
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
              <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-900">
              No items match the current filters.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <CatalogCard key={item.id} item={item} onAddToDraft={handleAddToDraft} />
              ))}
            </div>
          )}
        </section>
      </main>
      {toast ? (
        <InlineToast
          message={toast.message}
          variant={toast.variant}
          onClose={() => setToast(null)}
        />
      ) : null}
    </div>
  );
}
