"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

export function TopNav() {
  const { user } = useAuth();

  return (
    <nav className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Social Ecom
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <Button asChild variant="ghost">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
