"use client";

import { POItemTable } from "./POItemTable";
import type { DraftItem, POHeader } from "../../types/po";

type POReviewStepProps = {
  header: POHeader;
  items: DraftItem[];
  totalValue: number;
  onQuantityChange: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onBack: () => void;
  onNext: () => void;
};

export function POReviewStep({
  header,
  items,
  totalValue,
  onQuantityChange,
  onRemoveItem,
  onBack,
  onNext,
}: POReviewStepProps) {
  return (
    <section className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5">
      <h2 className="text-lg font-semibold text-zinc-900">Step 2: Review</h2>

      <div className="grid gap-2 rounded border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-900 md:grid-cols-2">
        <p>
          <span className="font-medium">Requestor:</span> {header.requestor}
        </p>
        <p>
          <span className="font-medium">Cost Center:</span> {header.costCenter}
        </p>
        <p>
          <span className="font-medium">Needed By:</span> {header.neededByDate}
        </p>
        <p>
          <span className="font-medium">Payment Terms:</span> {header.paymentTerms}
        </p>
      </div>

      <POItemTable
        mode="draft"
        items={items}
        onQuantityChange={onQuantityChange}
        onRemove={onRemoveItem}
      />

      <div className="text-right text-sm text-zinc-800">
        Total Value: <span className="font-semibold">${totalValue.toLocaleString()}</span>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded border border-zinc-300 px-4 py-2 text-sm"
        >
          Back to Header
        </button>
        <button
          type="button"
          onClick={onNext}
          className="rounded bg-zinc-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Continue to Submit
        </button>
      </div>
    </section>
  );
}
