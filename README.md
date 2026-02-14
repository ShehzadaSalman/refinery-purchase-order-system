# PO Workflow System (Next.js + Zustand)

Production-oriented Purchase Order workflow app built with:

- Next.js (App Router)
- React
- TypeScript (strict)
- Tailwind CSS
- Zustand + LocalStorage persistence

## Features

- Catalog browsing with:
  - search, category filter, in-stock filter, sorting
  - debounced search + loading skeletons
  - URL query sync for filter/search/sort state
- PO Draft management:
  - add items from catalog
  - supplier lock enforcement
  - clear draft
  - mismatch error handling with toast feedback
- PO creation wizard (`/po/new`):
  - Step 1: Header
  - Step 2: Review
  - Step 3: Submit
- Submission snapshot rules:
  - item `priceAtSubmission`
  - item `leadTimeAtSubmission`
- PO status workflow + timeline:
  - Draft -> Submitted -> Approved/Rejected -> Fulfilled
  - invalid transitions blocked in store logic
- PO List and PO Details pages
- Persisted draft + submitted POs using Zustand persist middleware

## Business Rules

### Supplier Enforcement (Draft)

- The first added item sets `draft.supplier`.
- All next items must match that supplier.
- Mixed suppliers are blocked with structured error:
  - `SUPPLIER_MISMATCH`
  - message: `All items in a PO must belong to the same supplier.`

### PO Numbering

Generated on submit in format:

- `PO-YYYY-XXXX`
- `XXXX` is per-year incremental sequence.

### Status Transitions

Allowed transitions:

- `Draft -> Submitted`
- `Submitted -> Approved`
- `Submitted -> Rejected`
- `Approved -> Fulfilled`

All other transitions are rejected by store logic.

## Routes

- `/catalog`
- `/po/new`
- `/po-list`
- `/po/[poId]`

Root (`/`) redirects to `/catalog`.

## State Architecture

### Draft Store (`src/store/poDraftStore.ts`)

Owns only working draft state:

- `draft: { supplier, items, header }`
- add/remove/update items
- supplier enforcement
- header validation
- persisted to LocalStorage (`po-draft-store`)

### PO Store (`src/store/poStore.ts`)

Owns submitted PO records:

- submitted PO list
- submission snapshot creation
- PO number sequence management
- status transitions + status history
- persisted to LocalStorage (`po-store`)

## Folder Structure

```text
src/
  app/
    catalog/
      page.tsx
    po/
      new/
        page.tsx
      [poId]/
        page.tsx
    po-list/
      page.tsx
    layout.tsx
    page.tsx
  components/
    AppNav.tsx
    CatalogCard.tsx
    CatalogCardSkeleton.tsx
    po/
      InlineToast.tsx
      PODraftSummary.tsx
      POHeaderStep.tsx
      POReviewStep.tsx
      POSubmitStep.tsx
      POStatusTimeline.tsx
      POItemTable.tsx
  hooks/
  services/
  store/
    poDraftStore.ts
    poStore.ts
  types/
    catalog.ts
    po.ts
```

## Getting Started

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Scripts

- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run start` - start production server
- `npm run lint` - run ESLint

## Notes

- No backend is used; data is in-memory + LocalStorage.
- Clearing browser storage will reset persisted draft and PO data.
