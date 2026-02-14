"use client";

import type { HeaderValidationErrors, POHeader } from "../../types/po";

type POHeaderStepProps = {
  header: POHeader;
  validationErrors: HeaderValidationErrors;
  onChange: (field: keyof POHeader, value: string) => void;
  onNext: () => void;
};

export function POHeaderStep({ header, validationErrors, onChange, onNext }: POHeaderStepProps) {
  return (
    <section className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-zinc-900">Step 1: Header</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm text-zinc-900">
          Requestor
          <input
            value={header.requestor}
            onChange={(event) => onChange("requestor", event.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 outline-none ring-zinc-300 focus:ring-2"
          />
          {validationErrors.requestor ? (
            <p className="mt-1 text-xs text-red-700">{validationErrors.requestor}</p>
          ) : null}
        </label>

        <label className="text-sm text-zinc-900">
          Cost Center
          <input
            value={header.costCenter}
            onChange={(event) => onChange("costCenter", event.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 outline-none ring-zinc-300 focus:ring-2"
          />
          {validationErrors.costCenter ? (
            <p className="mt-1 text-xs text-red-700">{validationErrors.costCenter}</p>
          ) : null}
        </label>

        <label className="text-sm text-zinc-900">
          Needed-by Date
          <input
            type="date"
            value={header.neededByDate}
            onChange={(event) => onChange("neededByDate", event.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 outline-none ring-zinc-300 focus:ring-2"
          />
          {validationErrors.neededByDate ? (
            <p className="mt-1 text-xs text-red-700">{validationErrors.neededByDate}</p>
          ) : null}
        </label>

        <label className="text-sm text-zinc-900">
          Payment Terms
          <input
            value={header.paymentTerms}
            onChange={(event) => onChange("paymentTerms", event.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 outline-none ring-zinc-300 focus:ring-2"
          />
          {validationErrors.paymentTerms ? (
            <p className="mt-1 text-xs text-red-700">{validationErrors.paymentTerms}</p>
          ) : null}
        </label>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onNext}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
        >
          Continue to Review
        </button>
      </div>
    </section>
  );
}
