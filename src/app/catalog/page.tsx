import { Suspense } from "react";
import CatalogPageClient from "../catalog-page-client";

export default function CatalogPage() {
  return (
    <Suspense fallback={null}>
      <CatalogPageClient />
    </Suspense>
  );
}
