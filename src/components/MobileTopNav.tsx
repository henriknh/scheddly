"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import config from "../../app.config";

export function MobileTopNav() {
  const isMobile = useIsMobile();
  const { openMobile, setOpenMobile } = useSidebar();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Check initial scroll position on mount
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isMobile) {
    return null;
  }

  const handleToggle = () => {
    setOpenMobile(!openMobile);
  };

  return (
    <div
      className={`sticky top-0 z-20 flex h-14 items-center gap-2 px-4 md:hidden transition-all duration-300 ${
        isScrolled
          ? "backdrop-blur-md bg-white/80 dark:bg-gray-900/80 shadow-sm"
          : "bg-background"
      }`}
    >
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={handleToggle}
      >
        <Menu />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
      <Button asChild variant="ghost" className="flex items-center gap-2">
        <Link href="/dashboard">
          <Image src="/logo.svg" alt="Logo" width={20} height={20} />
          <span className="text-lg font-bold">{config.appName}</span>
        </Link>
      </Button>
    </div>
  );
}
