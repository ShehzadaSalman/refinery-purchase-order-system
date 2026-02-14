"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { POHeaderStep } from "../../../components/po/POHeaderStep";
import { POItemTable } from "../../../components/po/POItemTable";
import { POReviewStep } from "../../../components/po/POReviewStep";
import { POSubmitStep } from "../../../components/po/POSubmitStep";
import { usePODraftStore, isHeaderComplete } from "../../../store/poDraftStore";
import { usePOStore } from "../../../store/poStore";
import type { HeaderValidationErrors, POHeader } from "../../../types/po";

type WizardStep = 1 | 2 | 3;

const DEFAULT_HEADER: POHeader = {
  requestor: "",
  costCenter: "CC-1234",
  neededByDate: "",
  paymentTerms: "",
};

export default function NewPOPage() {
  const router = useRouter();
  const draft = usePODraftStore((state) => state.draft);
  const lastError = usePODraftStore((state) => state.lastError);
  const setHeader = usePODraftStore((state) => state.setHeader);
  const validateHeader = usePODraftStore((state) => state.validateHeader);
  const updateQuantity = usePODraftStore((state) => state.updateQuantity);
  const removeItem = usePODraftStore((state) => state.removeItem);
  const clearDraft = usePODraftStore((state) => state.clearDraft);

  const submitDraft = usePOStore((state) => state.submitDraft);

  const [step, setStep] = useState<WizardStep>(1);
  const [headerForm, setHeaderForm] = useState<POHeader>(draft.header ?? DEFAULT_HEADER);
  const [validationErrors, setValidationErrors] = useState<HeaderValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const totalValue = useMemo(
    () => draft.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
    [draft.items],
  );

  const canSubmit = draft.items.length > 0 && isHeaderComplete(headerForm);

  const handleHeaderFieldChange = (field: keyof POHeader, value: string) => {
    setHeaderForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleHeaderNext = () => {
    const errors = validateHeader(headerForm);
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setHeader(headerForm);
    setStep(2);
  };

  const handleReviewNext = () => {
    setHeader(headerForm);
    setStep(3);
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    updateQuantity(itemId, quantity);
  };

  const handleSubmit = () => {
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    setTimeout(() => {
      const result = submitDraft(draft, headerForm.requestor || "system.user");
      if (!result.ok) {
        setSubmitError(result.error.message);
        setIsSubmitting(false);
        return;
      }

      clearDraft();
      router.push(`/po/${result.poId}`);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-8">
      <main className="mx-auto max-w-6xl space-y-4">
        <header>
          <h1 className="text-2xl font-bold text-zinc-900">Create Purchase Order</h1>
          <p className="mt-1 text-sm text-zinc-900">Multi-step PO workflow with supplier lock and submission snapshot.</p>
        </header>

        <div className="grid gap-4 lg:grid-cols-3 lg:items-start">
          <section className="space-y-4 lg:col-span-2">
            <div className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900">
              <p>
                Supplier: <span className="font-semibold">{draft.supplier ?? "Not selected"}</span>
              </p>
              <p>
                Draft Items: <span className="font-semibold">{draft.items.length}</span>
              </p>
            </div>

            {lastError ? (
              <p className="rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                {lastError.message}
              </p>
            ) : null}

            {draft.items.length === 0 ? (
              <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-900">
                <p className="mb-3">Draft is empty. Add items from the catalog to start a PO.</p>
                <Link href="/catalog" className="rounded bg-zinc-900 px-4 py-2 text-sm font-semibold text-white">
                  Go to Catalog
                </Link>
              </div>
            ) : null}

            {draft.items.length > 0 && step === 1 ? (
              <POHeaderStep
                header={headerForm}
                validationErrors={validationErrors}
                onChange={handleHeaderFieldChange}
                onNext={handleHeaderNext}
              />
            ) : null}

            {draft.items.length > 0 && step === 2 ? (
              <POReviewStep
                header={headerForm}
                items={draft.items}
                totalValue={totalValue}
                onQuantityChange={handleQuantityChange}
                onRemoveItem={removeItem}
                onBack={() => setStep(1)}
                onNext={handleReviewNext}
              />
            ) : null}

            {draft.items.length > 0 && step === 3 ? (
              <POSubmitStep
                supplier={draft.supplier}
                itemCount={draft.items.length}
                totalValue={totalValue}
                isSubmitting={isSubmitting}
                canSubmit={canSubmit}
                onBack={() => setStep(2)}
                onSubmit={handleSubmit}
                submitError={submitError}
              />
            ) : null}
          </section>

          <aside className="lg:sticky lg:top-24">
            <section className="space-y-3 rounded-lg border border-zinc-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-zinc-900">PO Draft Items</h2>
                <p className="text-sm text-zinc-900">{draft.items.length} item(s)</p>
              </div>
              {draft.items.length > 0 ? (
                <>
                  <POItemTable mode="submitted" items={draft.items} variant="compact" />
                  <p className="text-right text-sm text-zinc-900">
                    Draft Total: <span className="font-semibold">${totalValue.toLocaleString()}</span>
                  </p>
                </>
              ) : (
                <p className="text-sm text-zinc-900">No items in draft yet.</p>
              )}
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
