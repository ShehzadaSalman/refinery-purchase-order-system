"use client";

import type { DraftItem, POItemSnapshot } from "../../types/po";

type POItemTableProps = {
  mode: "draft" | "submitted";
  items: DraftItem[] | POItemSnapshot[];
  variant?: "default" | "compact";
  onQuantityChange?: (itemId: string, quantity: number) => void;
  onRemove?: (itemId: string) => void;
};

function isSubmittedItem(item: DraftItem | POItemSnapshot): item is POItemSnapshot {
  return "priceAtSubmission" in item;
}

const sanitizeQuantity = (quantity: number): number => {
  if (!Number.isFinite(quantity) || quantity < 1) return 1;
  return Math.floor(quantity);
};

export function POItemTable({
  mode,
  items,
  variant = "default",
  onQuantityChange,
  onRemove,
}: POItemTableProps) {
  return (
    <div
      className={`overflow-x-auto rounded-lg border border-zinc-200 bg-white ${
        variant === "compact" ? "max-h-[420px]" : ""
      }`}
    >
      <table className="min-w-full text-sm">
        <thead
          className={`bg-zinc-50 text-left text-zinc-900 ${
            variant === "compact" ? "sticky top-0 z-10" : ""
          }`}
        >
          <tr>
            <th className="px-3 py-2">Item</th>
            <th className="px-3 py-2">Model</th>
            <th className="px-3 py-2 text-right">Qty</th>
            <th className="px-3 py-2 text-right">Unit Price</th>
            <th className="px-3 py-2 text-right">Lead Time</th>
            <th className="px-3 py-2 text-right">Line Total</th>
            {mode === "draft" ? <th className="px-3 py-2 text-right">Actions</th> : null}
          </tr>
        </thead>
        <tbody>
          {items.map((rawItem) => {
            const item = rawItem as DraftItem | POItemSnapshot;
            const unitPrice = isSubmittedItem(item) ? item.priceAtSubmission : item.unitPrice;
            const leadTime = isSubmittedItem(item)
              ? item.leadTimeAtSubmission
              : item.leadTimeDays;
            const lineTotal = item.quantity * unitPrice;

            return (
              <tr key={item.itemId} className="border-t border-zinc-100 hover:bg-zinc-50">
                <td className="px-3 py-2">
                  <div className="font-medium text-zinc-900">{item.name}</div>
                  <div className="text-xs text-zinc-900">{item.itemId}</div>
                </td>
                <td className="px-3 py-2 text-zinc-900">{item.model}</td>
                <td className="px-3 py-2 text-right">
                  {mode === "draft" && onQuantityChange ? (
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onQuantityChange(item.itemId, sanitizeQuantity(item.quantity - 1))}
                        className="rounded border border-zinc-300 px-2 py-1 text-xs"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(event) =>
                          onQuantityChange(item.itemId, sanitizeQuantity(Number(event.target.value)))
                        }
                        className="w-16 rounded border border-zinc-300 px-2 py-1 text-center"
                      />
                      <button
                        type="button"
                        onClick={() => onQuantityChange(item.itemId, sanitizeQuantity(item.quantity + 1))}
                        className="rounded border border-zinc-300 px-2 py-1 text-xs"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <span>{item.quantity}</span>
                  )}
                </td>
                <td className="px-3 py-2 text-right">${unitPrice.toLocaleString()}</td>
                <td className="px-3 py-2 text-right">{leadTime} days</td>
                <td className="px-3 py-2 text-right font-semibold">${lineTotal.toLocaleString()}</td>
                {mode === "draft" ? (
                  <td className="px-3 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => onRemove?.(item.itemId)}
                      className="rounded border border-zinc-300 px-2 py-1 text-xs hover:bg-zinc-100"
                    >
                      Remove
                    </button>
                  </td>
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
