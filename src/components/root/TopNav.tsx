"use client";

import config from "@/config";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { CleanedUser, getUserFromToken } from "@/lib/user";

export function TopNav() {
  const [user, setUser] = useState<CleanedUser | null>(null);

  useEffect(() => {
    (async () => setUser(await getUserFromToken()))();
  }, []);

  return (
    <nav className="border-b w-full">
      <div className="flex h-16 items-center justify-between w-full px-8">
        <Link href="/" className="text-xl font-bold">
          {config.appName}
        </Link>

        <div className="relative flex items-center gap-4">
          <div
            className="absolute top-0 bottom-0 flex items-center gap-4 transition-all duration-300"
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
            className="absolute top-0 bottom-0 flex items-center gap-4 transition-all ease-out duration-300"
            style={{
              opacity: user ? 0.5 : 1,
              right: user ? "-200px" : 0,
              scale: user ? 0.5 : 1,
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
