"use client";

import config from "@/config";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { CleanedUser, getUserFromToken } from "@/lib/user";
import Image from "next/image";

export function TopNav() {
  const [user, setUser] = useState<CleanedUser | null>(null);

  useEffect(() => {
    (async () => setUser(await getUserFromToken()))();
  }, []);

  return (
    <nav className="w-full overflow-hidden">
      <div className="flex h-16 items-center justify-between w-full px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold flex gap-2 items-center">
            <Image src="/logo.svg" alt="Logo" width={20} height={20} />
            {config.appName}
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="#pricing">Pricing</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="#features">Features</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="#platforms">Platforms</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="#how-it-works">How It Works</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="#faq">FAQ</Link>
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
