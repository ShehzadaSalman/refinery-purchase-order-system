import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { isHeaderComplete } from "./poDraftStore";
import type {
  PODraft,
  POStatus,
  POStatusHistory,
  PurchaseOrder,
  StoreActionResult,
  SubmitPOResult,
  POStoreError,
} from "../types/po";

type POStoreState = {
  pos: PurchaseOrder[];
  sequenceByYear: Record<string, number>;
  submitDraft: (draft: PODraft, changedBy: string) => SubmitPOResult;
  transitionStatus: (
    poId: string,
    nextStatus: POStatus,
    changedBy: string,
  ) => StoreActionResult<POStoreError>;
  getById: (poId: string) => PurchaseOrder | undefined;
};

const allowedTransitions: Record<POStatus, POStatus[]> = {
  Draft: ["Submitted"],
  Submitted: ["Approved", "Rejected"],
  Approved: ["Fulfilled"],
  Rejected: [],
  Fulfilled: [],
};

const toDate = (value: string | Date): Date => (value instanceof Date ? value : new Date(value));

function revivePurchaseOrder(po: PurchaseOrder): PurchaseOrder {
  return {
    ...po,
    createdAt: toDate(po.createdAt),
    submittedAt: toDate(po.submittedAt),
    statusHistory: po.statusHistory.map((entry) => ({
      ...entry,
      changedAt: toDate(entry.changedAt),
    })),
  };
}

const buildTransitionError = (): POStoreError => ({
  code: "INVALID_TRANSITION",
  message: "Invalid status transition attempted.",
});

export const usePOStore = create<POStoreState>()(
  persist(
    (set, get) => ({
      pos: [],
      sequenceByYear: {},
      submitDraft: (draft, changedBy) => {
        if (!draft.header || !isHeaderComplete(draft.header) || draft.items.length === 0 || !draft.supplier) {
          return {
            ok: false,
            error: {
              code: "INVALID_SUBMISSION",
              message: "Draft is incomplete. Header and items are required before submission.",
            },
          };
        }

        const submittedAt = new Date();
        const year = String(submittedAt.getFullYear());
        const nextSequence = (get().sequenceByYear[year] ?? 0) + 1;
        const poNumber = `PO-${year}-${String(nextSequence).padStart(4, "0")}`;

        const statusHistory: POStatusHistory[] = [
          { status: "Draft", changedAt: submittedAt, changedBy },
          { status: "Submitted", changedAt: submittedAt, changedBy },
        ];

        const items = draft.items.map((item) => ({
          itemId: item.itemId,
          name: item.name,
          supplier: item.supplier,
          manufacturer: item.manufacturer,
          model: item.model,
          quantity: item.quantity,
          priceAtSubmission: item.unitPrice,
          leadTimeAtSubmission: item.leadTimeDays,
        }));

        const totalValue = items.reduce(
          (sum, item) => sum + item.quantity * item.priceAtSubmission,
          0,
        );

        const poId = `${year}-${nextSequence}-${submittedAt.getTime()}`;

        const nextPO: PurchaseOrder = {
          id: poId,
          poNumber,
          supplier: draft.supplier,
          header: draft.header,
          items,
          status: "Submitted",
          statusHistory,
          createdAt: submittedAt,
          submittedAt,
          totalValue,
        };

        set((state) => ({
          pos: [nextPO, ...state.pos],
          sequenceByYear: {
            ...state.sequenceByYear,
            [year]: nextSequence,
          },
        }));

        return { ok: true, poId, poNumber };
      },
      transitionStatus: (poId, nextStatus, changedBy) => {
        const existing = get().pos.find((po) => po.id === poId);
        if (!existing) {
          return {
            ok: false,
            error: {
              code: "NOT_FOUND",
              message: "PO not found.",
            },
          };
        }

        const validNext = allowedTransitions[existing.status];
        if (!validNext.includes(nextStatus)) {
          return { ok: false, error: buildTransitionError() };
        }

        const changedAt = new Date();
        set((state) => ({
          pos: state.pos.map((po) =>
            po.id === poId
              ? {
                  ...po,
                  status: nextStatus,
                  statusHistory: [
                    ...po.statusHistory,
                    { status: nextStatus, changedAt, changedBy },
                  ],
                }
              : po,
          ),
        }));

        return { ok: true };
      },
      getById: (poId) => get().pos.find((po) => po.id === poId),
    }),
    {
      name: "po-store",
      storage: createJSONStorage(() => localStorage),
      merge: (persistedState, currentState) => {
        const typed = persistedState as Partial<POStoreState>;

        return {
          ...currentState,
          ...typed,
          pos: (typed.pos ?? []).map(revivePurchaseOrder),
          sequenceByYear: typed.sequenceByYear ?? {},
        };
      },
    },
  ),
);

export const getAllowedNextStatuses = (status: POStatus): POStatus[] => allowedTransitions[status];
