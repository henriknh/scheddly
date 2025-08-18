"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";

export function SyncSubscriptionDebugButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/stripe/sync", { method: "POST" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error((data && (data.error || data.message)) || "Sync failed");
      }
      toast.success("Subscription synced with Stripe");
    } catch (error) {
      toast.error("Failed to sync subscription");
      console.error("Error syncing subscription:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleClick} disabled={isLoading}>
      Sync subscription
    </Button>
  );
}


