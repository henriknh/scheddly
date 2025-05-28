"use client";

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Breadcrumbs() {
  const pathname = usePathname();

  const generateBreadcrumbs = () => {
    // Remove trailing slash and split the pathname
    const paths = pathname.replace(/\/$/, "").split("/").filter(Boolean);

    // Filter out 'dashboard' from the paths as it's treated as home
    const filteredPaths = paths.filter((path) => path !== "dashboard");

    // Generate array of breadcrumb items
    const breadcrumbs = filteredPaths.map((path, index) => {
      const href = `/dashboard/${filteredPaths.slice(0, index + 1).join("/")}`;
      // Convert path to readable format (e.g., "my-path" -> "My Path")
      const label = path
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      return { href, label };
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

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
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={breadcrumb.href} className="flex items-center">
          <ChevronRight className="h-4 w-4" />
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-auto p-0 hover:bg-transparent",
              index === breadcrumbs.length - 1 && "font-medium text-foreground"
            )}
            asChild
          >
            <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
          </Button>
        </div>
      ))}
    </nav>
  );
}
