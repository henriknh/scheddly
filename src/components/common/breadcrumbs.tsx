"use client";

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function Breadcrumbs() {
  const pathname = usePathname();

  const [breadcrumbElements, setBreadcrumbElements] = useState<Element[]>([]);

  useEffect(() => {
    setBreadcrumbElements(Array.from(document.querySelectorAll(".breadcrumb")));
  }, [pathname]);

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
      <Button
        variant="ghost"
        size="sm"
        className="h-auto p-0 hover:bg-transparent"
        asChild
      >
        <Link href="/dashboard">
          <Home className="h-4 w-4" />
          Dashboard
        </Link>
      </Button>

      {breadcrumbElements.map((breadcrumb) => {
        const label = breadcrumb.getAttribute("data-label");
        const href = breadcrumb.getAttribute("data-href");

        return (
          <Button
            key={label + (href ?? "")}
            variant="ghost"
            size="sm"
            className="h-auto p-0 hover:bg-transparent"
            asChild
          >
            <Link href={href ?? ""}>
              <ChevronRight className="h-4 w-4" />
              {label}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
