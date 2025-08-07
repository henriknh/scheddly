"use client";

import { useEffect } from "react";
import { useBreadcrumbs } from "./breadcrumbs-context";

interface BreadcrumbProps {
  label: string;
  href?: string;
}

export function Breadcrumb({ label, href }: BreadcrumbProps) {
  const { registerBreadcrumb, deregisterBreadcrumb } = useBreadcrumbs();

  useEffect(() => {
    registerBreadcrumb(label, href);
    return () => deregisterBreadcrumb(label, href);
  }, [label, href, registerBreadcrumb, deregisterBreadcrumb]);

  return null;
}
