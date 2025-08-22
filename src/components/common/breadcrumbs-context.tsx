"use client";

import { usePathname } from "next/navigation";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type BreadcrumbItem = {
  label: string;
  href?: string;
  key: string;
};

export type BreadcrumbsContextValue = {
  items: BreadcrumbItem[];
  registerBreadcrumb: (label: string, href?: string) => void;
  deregisterBreadcrumb: (label: string, href?: string) => void;
  resetBreadcrumbs: () => void;
};

const BreadcrumbsContext = createContext<BreadcrumbsContextValue | undefined>(
  undefined
);

export function BreadcrumbsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<BreadcrumbItem[]>([]);
  const itemKeysRef = useRef<Set<string>>(new Set());
  const pathname = usePathname();

  const registerBreadcrumb = useCallback((label: string, href?: string) => {
    const key = `${label}|${href ?? ""}`;
    if (itemKeysRef.current.has(key)) return;
    itemKeysRef.current.add(key);
    setItems((prev) => [...prev, { label, href, key }]);
  }, []);

  const deregisterBreadcrumb = useCallback((label: string, href?: string) => {
    const key = `${label}|${href ?? ""}`;
    if (!itemKeysRef.current.has(key)) return;
    itemKeysRef.current.delete(key);
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const resetBreadcrumbs = useCallback(() => {
    itemKeysRef.current = new Set();
    setItems([]);
  }, []);

  useEffect(() => {
    // Reset breadcrumbs on every pathname change
    // resetBreadcrumbs();
  }, [pathname, resetBreadcrumbs]);

  const value = useMemo(
    () => ({
      items,
      registerBreadcrumb,
      deregisterBreadcrumb,
      resetBreadcrumbs,
    }),
    [items, registerBreadcrumb, deregisterBreadcrumb, resetBreadcrumbs]
  );

  return (
    <BreadcrumbsContext.Provider value={value}>
      {children}
    </BreadcrumbsContext.Provider>
  );
}

export function useBreadcrumbs() {
  const ctx = useContext(BreadcrumbsContext);
  if (!ctx) {
    throw new Error("useBreadcrumbs must be used within a BreadcrumbsProvider");
  }
  return ctx;
}
