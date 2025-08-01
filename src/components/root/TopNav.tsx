"use client";

import config from "@/config";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { CleanedUser, getUserFromToken } from "@/lib/user";
import Image from "next/image";

export function TopNav() {
  const [user, setUser] = useState<CleanedUser | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    (async () => setUser(await getUserFromToken()))();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Check initial scroll position on mount
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault();

    // Update URL with target ID
    const url = new URL(window.location.href);
    url.hash = targetId;
    window.history.pushState({}, "", url.toString());

    const element = document.getElementById(targetId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav
      className={`w-full overflow-hidden fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "backdrop-blur-md bg-white/80 dark:bg-gray-900/80 shadow-sm border-b border-gray-200/20 dark:border-gray-700/20"
          : "bg-transparent"
      }`}
    >
      <div className="flex h-16 items-center justify-between w-full px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold flex gap-2 items-center">
            <Image src="/logo.svg" alt="Logo" width={20} height={20} />
            {config.appName}
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link
                href="#pricing"
                onClick={(e) => handleSmoothScroll(e, "pricing")}
              >
                Pricing
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link
                href="#features"
                onClick={(e) => handleSmoothScroll(e, "features")}
              >
                Features
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link
                href="#platforms"
                onClick={(e) => handleSmoothScroll(e, "platforms")}
              >
                Platforms
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link
                href="#how-it-works"
                onClick={(e) => handleSmoothScroll(e, "how-it-works")}
              >
                How It Works
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="#faq" onClick={(e) => handleSmoothScroll(e, "faq")}>
                FAQ
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative flex items-center gap-4">
          <div
            className="absolute top-0 bottom-0 flex items-center gap-4 transition-all duration-300 delay-300"
            style={{
              right: user ? 0 : "-200px",
              opacity: user ? 1 : 0,
            }}
          >
            <Button asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>

          <div
            className="absolute top-0 bottom-0 flex items-center gap-4 transition-all ease-out duration-500 delay-200"
            style={{
              opacity: user ? 0 : 1,
              right: user ? "-100px" : 0,
              scale: user ? 0.8 : 1,
            }}
          >
            <Button asChild variant="ghost">
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/register">Register</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
