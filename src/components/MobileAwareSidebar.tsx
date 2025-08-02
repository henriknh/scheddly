"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import * as React from "react";
import { Sidebar, useSidebar } from "@/components/ui/sidebar";

interface MobileAwareSidebarProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileAwareSidebar({
  children,
  className,
}: MobileAwareSidebarProps) {
  const { isMobile, openMobile, setOpenMobile } = useSidebar();
  const isMobileHook = useIsMobile();

  // Use the hook's mobile detection as fallback
  const isMobileDevice = isMobile || isMobileHook;

  if (isMobileDevice) {
    return (
      <>
        {/* Overlay */}
        <div
          className={cn(
            "fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ease-out md:hidden",
            openMobile ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={() => setOpenMobile(false)}
        />
        {/* Sidebar */}
        <div
          className={cn(
            "fixed inset-y-0 z-50 h-svh w-[--sidebar-width] transition-all duration-300 ease-out",
            "left-0 border-r border-sidebar-border",
            "pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]",
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
            className="flex h-full w-full flex-col bg-sidebar p-4 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]"
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
