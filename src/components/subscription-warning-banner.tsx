"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { isTrialExpired } from "@/lib/subscription";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export function SubscriptionWarningBanner() {
  const { user } = useAuth();
  const showTrialExpiredBanner = user?.team && isTrialExpired(user.team);

  if (!showTrialExpiredBanner) {
    return null;
  }

  return (
    <Alert variant="destructive">
      <span className="flex items-center justify-center">
        <AlertTriangle className="h-4 w-4" />
      </span>
      <AlertDescription className="flex items-center justify-between w-full">
        <span>
          Your free trial has expired. Upgrade to continue using Scheddly.
        </span>
        <Button size="sm" variant="outline" asChild>
          <Link href="/dashboard/profile">Upgrade Now</Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
}
