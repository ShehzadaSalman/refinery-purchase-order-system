"use client";

import Link from "next/link";

type PODraftSummaryProps = {
  supplier: string | null;
  itemCount: number;
  totalValue: number;
  errorMessage?: string | null;
  onDismissError?: () => void;
  onClearDraft?: () => void;
};

export function PODraftSummary({
  supplier,
  itemCount,
  totalValue,
  errorMessage,
  onDismissError,
  onClearDraft,
}: PODraftSummaryProps) {
  return (
    <div className="mb-6 space-y-3">
      {supplier ? (
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
          Supplier lock enabled: <span className="font-semibold">{supplier}</span>. All items in this PO must match this supplier.
        </div>
      ) : null}

      {errorMessage ? (
        <div className="flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          <p>{errorMessage}</p>
          {onDismissError ? (
            <button
              type="button"
              onClick={onDismissError}
              className="rounded border border-red-300 px-2 py-1 text-xs font-medium"
            >
              Dismiss
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm">
        <div className="flex gap-4">
          <span>
            Draft items: <span className="font-semibold">{itemCount}</span>
          </span>
          <span>
            Draft total: <span className="font-semibold">${totalValue.toLocaleString()}</span>
          </span>
        </div>
        <div className="flex gap-2">
          {onClearDraft ? (
            <button
              type="button"
              onClick={onClearDraft}
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-900 hover:bg-zinc-100"
            >
              Clear Draft
            </button>
          ) : null}
          <Link href="/po/new" className="rounded-md bg-zinc-900 px-3 py-2 text-xs font-semibold text-white hover:bg-zinc-800">
            Open PO Draft
          </Link>
        </div>
      </div>
    </div>
  );
}
