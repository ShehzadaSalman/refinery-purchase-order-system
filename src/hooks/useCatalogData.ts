import { useEffect, useState } from "react";
import { fetchCatalogMock } from "../services/catalog.service";
import { CatalogItem } from "../types/catalog";

export function useCatalogData() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(true);

  useEffect(() => {
    let active = true;

    fetchCatalogMock().then((data) => {
      if (!active) return;
      setItems(data);
      setIsFetching(false);
    });

    return () => {
      active = false;
    };
  }, []);

  return { items, isFetching };
}
