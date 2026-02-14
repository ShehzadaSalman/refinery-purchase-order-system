export type POStatus = "Draft" | "Submitted" | "Approved" | "Rejected" | "Fulfilled";

export type POHeader = {
  requestor: string;
  costCenter: string;
  neededByDate: string;
  paymentTerms: string;
};

export type DraftItem = {
  itemId: string;
  name: string;
  supplier: string;
  manufacturer: string;
  model: string;
  quantity: number;
  unitPrice: number;
  leadTimeDays: number;
};

export type PODraft = {
  supplier: string | null;
  items: DraftItem[];
  header?: POHeader;
};

export type POItemSnapshot = {
  itemId: string;
  name: string;
  supplier: string;
  manufacturer: string;
  model: string;
  quantity: number;
  priceAtSubmission: number;
  leadTimeAtSubmission: number;
};

export type POStatusHistory = {
  status: POStatus;
  changedAt: Date;
  changedBy: string;
};

export type PurchaseOrder = {
  id: string;
  poNumber: string;
  supplier: string;
  header: POHeader;
  items: POItemSnapshot[];
  status: POStatus;
  statusHistory: POStatusHistory[];
  createdAt: Date;
  submittedAt: Date;
  totalValue: number;
};

export type DraftErrorCode =
  | "SUPPLIER_MISMATCH"
  | "INVALID_QUANTITY"
  | "HEADER_INCOMPLETE"
  | "DRAFT_EMPTY";

export type DraftError = {
  code: DraftErrorCode;
  message: string;
};

export type POStoreErrorCode = "NOT_FOUND" | "INVALID_TRANSITION" | "INVALID_SUBMISSION";

export type POStoreError = {
  code: POStoreErrorCode;
  message: string;
};

export type StoreActionResult<TError> =
  | { ok: true }
  | { ok: false; error: TError };

export type SubmitPOResult =
  | { ok: true; poId: string; poNumber: string }
  | { ok: false; error: POStoreError };

export type HeaderValidationErrors = Partial<Record<keyof POHeader, string>>;
