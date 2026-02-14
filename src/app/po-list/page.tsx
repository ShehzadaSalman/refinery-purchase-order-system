"use client";

import Link from "next/link";
import { usePOStore } from "../../store/poStore";

export default function POListPage() {
  const pos = usePOStore((state) => state.pos);

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-8">
      <main className="mx-auto max-w-6xl space-y-4">
        <header>
          <h1 className="text-2xl font-bold text-zinc-900">Purchase Orders</h1>
          <p className="mt-1 text-sm text-zinc-900">Submitted PO records with current status.</p>
        </header>

        {pos.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-900">
            No purchase orders submitted yet.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-zinc-50 text-left text-zinc-900">
                <tr>
                  <th className="px-3 py-2">PO Number</th>
                  <th className="px-3 py-2">Supplier</th>
                  <th className="px-3 py-2">Total Value</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Created Date</th>
                </tr>
              </thead>
              <tbody>
                {pos.map((po) => (
                  <tr key={po.id} className="border-t border-zinc-100 hover:bg-zinc-50">
                    <td className="px-3 py-2">
                      <Link href={`/po/${po.id}`} className="font-semibold text-zinc-900 underline">
                        {po.poNumber}
                      </Link>
                    </td>
                    <td className="px-3 py-2">{po.supplier}</td>
                    <td className="px-3 py-2">${po.totalValue.toLocaleString()}</td>
                    <td className="px-3 py-2">{po.status}</td>
                    <td className="px-3 py-2">{po.createdAt.toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
