"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { POItemTable } from "../../../components/po/POItemTable";
import { POStatusTimeline } from "../../../components/po/POStatusTimeline";
import { getAllowedNextStatuses, usePOStore } from "../../../store/poStore";
import type { POStatus } from "../../../types/po";

export default function PODetailPage() {
  const params = useParams<{ poId: string }>();
  const poId = params.poId;
  const po = usePOStore((state) => state.getById(poId));
  const transitionStatus = usePOStore((state) => state.transitionStatus);
  const [transitionError, setTransitionError] = useState<string | null>(null);

  const nextStatuses = useMemo<POStatus[]>(() => {
    if (!po) return [];
    return getAllowedNextStatuses(po.status);
  }, [po]);

  const handleTransition = (nextStatus: POStatus) => {
    const result = transitionStatus(poId, nextStatus, "approver.user");
    if (!result.ok) {
      setTransitionError(result.error.message);
      return;
    }
    setTransitionError(null);
  };

  if (!po) {
    return (
      <div className="min-h-screen bg-zinc-50 px-4 py-8">
        <main className="mx-auto max-w-5xl rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-900">
          PO not found. <Link href="/po-list" className="underline">Back to list</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-8">
      <main className="mx-auto max-w-5xl space-y-4">
        <header className="rounded-lg border border-zinc-200 bg-white p-5">
          <h1 className="text-2xl font-bold text-zinc-900">{po.poNumber}</h1>
          <p className="mt-1 text-sm text-zinc-900">Supplier: {po.supplier}</p>
          <p className="mt-1 text-sm text-zinc-900">Status: {po.status}</p>
        </header>

        <section className="rounded-lg border border-zinc-200 bg-white p-5 text-sm text-zinc-900">
          <h2 className="mb-3 text-lg font-semibold text-zinc-900">Header Details</h2>
          <div className="grid gap-2 md:grid-cols-2">
            <p>
              <span className="font-medium">Requestor:</span> {po.header.requestor}
            </p>
            <p>
              <span className="font-medium">Cost Center:</span> {po.header.costCenter}
            </p>
            <p>
              <span className="font-medium">Needed By:</span> {po.header.neededByDate}
            </p>
            <p>
              <span className="font-medium">Payment Terms:</span> {po.header.paymentTerms}
            </p>
          </div>
        </section>

        <section className="space-y-3 rounded-lg border border-zinc-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-zinc-900">Items (Submission Snapshot)</h2>
          <POItemTable mode="submitted" items={po.items} />
          <p className="text-right text-sm text-zinc-900">
            Total Value: <span className="font-semibold">${po.totalValue.toLocaleString()}</span>
          </p>
        </section>

        <section className="space-y-3 rounded-lg border border-zinc-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-zinc-900">Status Timeline</h2>
          <POStatusTimeline history={po.statusHistory} />
        </section>

        <section className="space-y-3 rounded-lg border border-zinc-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-zinc-900">Status Actions</h2>
          {nextStatuses.length === 0 ? (
            <p className="text-sm text-zinc-900">No further transitions available.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {nextStatuses.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => handleTransition(status)}
                  className="rounded bg-zinc-900 px-3 py-2 text-sm font-semibold text-white"
                >
                  Mark as {status}
                </button>
              ))}
            </div>
          )}
          {transitionError ? <p className="text-sm text-red-700">{transitionError}</p> : null}
        </section>
      </main>
    </div>
  );
}
