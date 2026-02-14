"use client";

type POSubmitStepProps = {
  supplier: string | null;
  itemCount: number;
  totalValue: number;
  isSubmitting: boolean;
  canSubmit: boolean;
  onBack: () => void;
  onSubmit: () => void;
  submitError?: string | null;
};

export function POSubmitStep({
  supplier,
  itemCount,
  totalValue,
  isSubmitting,
  canSubmit,
  onBack,
  onSubmit,
  submitError,
}: POSubmitStepProps) {
  return (
    <section className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-zinc-900">Step 3: Submit</h2>

      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-900">
        <p>
          Supplier: <span className="font-semibold">{supplier ?? "N/A"}</span>
        </p>
        <p>
          Items: <span className="font-semibold">{itemCount}</span>
        </p>
        <p>
          Total Value: <span className="font-semibold">${totalValue.toLocaleString()}</span>
        </p>
      </div>

      {!canSubmit ? (
        <p className="text-sm text-red-700">
          Submit is disabled until header is complete and at least one item exists.
        </p>
      ) : null}

      {submitError ? <p className="text-sm text-red-700">{submitError}</p> : null}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-100"
          disabled={isSubmitting}
        >
          Back to Review
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit || isSubmitting}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit PO"}
        </button>
      </div>
    </section>
  );
}
