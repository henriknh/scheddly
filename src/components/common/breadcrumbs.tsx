"use client";

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useBreadcrumbs } from "./breadcrumbs-context";

export function Breadcrumbs() {
  const { items } = useBreadcrumbs();

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

      {items.map(({ key, label, href }) => (
        <Button
          key={key}
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
      ))}
    </nav>
  );
}
