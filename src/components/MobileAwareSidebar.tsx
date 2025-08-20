"use client";

import { Sidebar, useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { cn } from "@/lib/utils";
import * as React from "react";

interface MobileAwareSidebarProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileAwareSidebar({
  children,
  className,
}: MobileAwareSidebarProps) {
  const { openMobile, setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <>
        {/* Overlay */}
        <div
          className={cn(
            "fixed inset-0 z-40 bg-background/50 transition-opacity duration-300 ease-out md:hidden",
            openMobile ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={() => setOpenMobile(false)}
        />
        {/* Sidebar */}
        <div
          className={cn(
            "fixed inset-y-0 z-50 h-dvh w-[--sidebar-width] transition-all duration-300 ease-out",
            "left-0 border-r border-sidebar-border",
            openMobile ? "translate-x-0" : "-translate-x-full",
            className
          )}
          style={
            {
              "--sidebar-width": "16rem",
            } as React.CSSProperties
          }
        >
          <div
            data-sidebar="sidebar"
            className="flex h-full w-full flex-col bg-sidebar p-4 pt-sat pb-sab"
          >
            {children}
          </div>
        </div>
      </>
    );
  }

  // Desktop behavior - use the original sidebar
  return (
    <Sidebar collapsible="icon" variant="sidebar" className={className}>
      {children}
    </Sidebar>
  );
}
