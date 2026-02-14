import { Suspense } from "react";
import CatalogPageClient from "./catalog-page-client";

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <CatalogPageClient />
    </Suspense>
  );
}
