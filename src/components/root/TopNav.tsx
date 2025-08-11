"use client";

import config from "@/config";
import { CleanedUser, getUserFromToken } from "@/lib/user";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

export function TopNav() {
  const [user, setUser] = useState<CleanedUser | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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

    if (window.location.pathname !== "/") {
      window.location.href = `/#${targetId}`;
      return;
    }

    // Update URL with target ID
    const url = new URL(window.location.href);
    url.hash = `#${targetId}`;
    window.history.pushState({}, "", url.toString());

    const element = document.getElementById(targetId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop,
        behavior: "smooth",
      });
    }

    setOpen(false);
  };

  return (
    <>
      <nav
        className={`w-full overflow-hidden fixed top-0 left-0 right-0 z-50 transition-all duration-300 pt-sat ${
          isScrolled
            ? "backdrop-blur-md bg-white/80 dark:bg-background/80 shadow-sm dark:shadow-white/10"
            : "bg-transparent"
        }`}
      >
        <div
          className={cn(
            "flex items-center justify-between w-full px-8 transition-all duration-300",
            open ? "h-32" : "h-16"
          )}
        >
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-xl font-bold flex gap-2 items-center"
            >
              <Image src="/logo.svg" alt="Logo" width={28} height={28} />
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
                <Link href="/blog">Blog</Link>
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

          <div className="relative hidden md:flex items-center gap-4">
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

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(!open)}
            className="md:hidden"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </nav>

      <div
        className={cn(
          "fixed flex flex-col gap-4 inset-0 z-[60] transition-all duration-300 bg-background",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between px-8 transition-all duration-300",
            open ? "h-32" : "h-16"
          )}
        >
          <Link href="/" className="text-xl font-bold flex gap-2 items-center">
            <Image src="/logo.svg" alt="Logo" width={28} height={28} />
            {config.appName}
          </Link>

          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div
          className={cn(
            "flex flex-col flex-1 px-8 pb-8 transition-all duration-300 delay-100",
            open ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <div className="flex flex-col gap-4">
            <Link
              href="#pricing"
              onClick={(e) => handleSmoothScroll(e, "pricing")}
            >
              Pricing
            </Link>

            <Link href="/blog" onClick={() => setOpen(false)}>
              Blog
            </Link>

            <Link
              href="#features"
              onClick={(e) => handleSmoothScroll(e, "features")}
            >
              Features
            </Link>

            <Link
              href="#platforms"
              onClick={(e) => handleSmoothScroll(e, "platforms")}
            >
              Platforms
            </Link>

            <Link
              href="#how-it-works"
              onClick={(e) => handleSmoothScroll(e, "how-it-works")}
            >
              How It Works
            </Link>

            <Link href="#faq" onClick={(e) => handleSmoothScroll(e, "faq")}>
              FAQ
            </Link>
          </div>

          <div className="flex-1" />

          <div className="flex flex-col gap-4">
            {user ? (
              <Button asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="outline">
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button asChild variant="default">
                  <Link href="/auth/register">Register</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
