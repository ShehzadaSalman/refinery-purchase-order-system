import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CatalogItem } from "../types/catalog";
import type {
  DraftError,
  DraftItem,
  HeaderValidationErrors,
  PODraft,
  POHeader,
  StoreActionResult,
} from "../types/po";

const DEFAULT_COST_CENTER = "CC-1234";

const initialDraft: PODraft = {
  supplier: null,
  items: [],
  header: {
    requestor: "",
    costCenter: DEFAULT_COST_CENTER,
    neededByDate: "",
    paymentTerms: "",
  },
};

type PODraftState = {
  draft: PODraft;
  lastError: DraftError | null;
  addCatalogItem: (item: CatalogItem, quantity?: number) => StoreActionResult<DraftError>;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => StoreActionResult<DraftError>;
  setHeader: (header: POHeader) => void;
  validateHeader: (header: POHeader) => HeaderValidationErrors;
  clearError: () => void;
  clearDraft: () => void;
};

const buildSupplierMismatchError = (): DraftError => ({
  code: "SUPPLIER_MISMATCH",
  message: "All items in a PO must belong to the same supplier.",
});

const buildInvalidQuantityError = (): DraftError => ({
  code: "INVALID_QUANTITY",
  message: "Quantity must be at least 1.",
});

function toDraftItem(item: CatalogItem, quantity: number): DraftItem {
  return {
    itemId: item.id,
    name: item.name,
    supplier: item.supplier,
    manufacturer: item.manufacturer,
    model: item.model,
    quantity,
    unitPrice: item.priceUsd,
    leadTimeDays: item.leadTimeDays,
  };
}

function validateHeaderValues(header: POHeader): HeaderValidationErrors {
  const errors: HeaderValidationErrors = {};

  if (!header.requestor.trim()) errors.requestor = "Requestor is required.";
  if (!header.costCenter.trim()) errors.costCenter = "Cost center is required.";
  if (!header.neededByDate.trim()) errors.neededByDate = "Needed-by date is required.";
  if (!header.paymentTerms.trim()) errors.paymentTerms = "Payment terms are required.";

  return errors;
}

export const usePODraftStore = create<PODraftState>()(
  persist(
    (set, get) => ({
      draft: initialDraft,
      lastError: null,
      addCatalogItem: (item, quantity = 1) => {
        if (quantity < 1) {
          const error = buildInvalidQuantityError();
          set({ lastError: error });
          return { ok: false, error };
        }

        const currentSupplier = get().draft.supplier;
        if (currentSupplier && currentSupplier !== item.supplier) {
          const error = buildSupplierMismatchError();
          set({ lastError: error });
          return { ok: false, error };
        }

        set((state) => {
          const existing = state.draft.items.find((draftItem) => draftItem.itemId === item.id);

          const nextItems = existing
            ? state.draft.items.map((draftItem) =>
                draftItem.itemId === item.id
                  ? { ...draftItem, quantity: draftItem.quantity + quantity }
                  : draftItem,
              )
            : [...state.draft.items, toDraftItem(item, quantity)];

          return {
            draft: {
              ...state.draft,
              supplier: state.draft.supplier ?? item.supplier,
              items: nextItems,
            },
            lastError: null,
          };
        });

        return { ok: true };
      },
      removeItem: (itemId) => {
        set((state) => {
          const nextItems = state.draft.items.filter((item) => item.itemId !== itemId);
          return {
            draft: {
              ...state.draft,
              items: nextItems,
              supplier: nextItems.length > 0 ? state.draft.supplier : null,
            },
          };
        });
      },
      updateQuantity: (itemId, quantity) => {
        if (quantity < 1) {
          const error = buildInvalidQuantityError();
          set({ lastError: error });
          return { ok: false, error };
        }

        set((state) => ({
          draft: {
            ...state.draft,
            items: state.draft.items.map((item) =>
              item.itemId === itemId ? { ...item, quantity } : item,
            ),
          },
          lastError: null,
        }));

        return { ok: true };
      },
      setHeader: (header) => {
        set((state) => ({ draft: { ...state.draft, header } }));
      },
      validateHeader: (header) => validateHeaderValues(header),
      clearError: () => set({ lastError: null }),
      clearDraft: () => set({ draft: initialDraft, lastError: null }),
    }),
    {
      name: "po-draft-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ draft: state.draft }),
    },
  ),
);

export const isHeaderComplete = (header: POHeader | undefined): boolean => {
  if (!header) return false;
  return Object.keys(validateHeaderValues(header)).length === 0;
};
