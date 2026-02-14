import type { CatalogItem } from "../types/catalog";

interface CatalogCardProps {
  item: CatalogItem;
}

export function CatalogCard({ item }: CatalogCardProps) {
  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold text-zinc-500">{item.id}</p>
        <span
          className={`rounded-full px-2 py-1 text-xs font-semibold ${
            item.inStock
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-800"
          }`}
        >
          {item.inStock ? "In Stock" : "Out of Stock"}
        </span>
      </div>

      <h2 className="mb-2 text-base font-semibold text-zinc-900">{item.name}</h2>
      <p className="mb-3 text-sm text-zinc-600">{item.description}</p>

      <div className="grid gap-1 text-sm text-zinc-700">
        <p>
          <span className="font-medium">Supplier:</span> {item.supplier}
        </p>
        <p>
          <span className="font-medium">Manufacturer:</span> {item.manufacturer}
        </p>
        <p>
          <span className="font-medium">Model:</span> {item.model}
        </p>
        <p>
          <span className="font-medium">Lead Time:</span> {item.leadTimeDays} days
        </p>
        <p>
          <span className="font-medium">Price:</span> ${item.priceUsd.toLocaleString()}
        </p>
      </div>
    </article>
  );
}
