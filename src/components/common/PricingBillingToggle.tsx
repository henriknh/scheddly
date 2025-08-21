"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FREE_MONTHS_WHEN_YEARLY } from "@/lib/pricing";

interface PricingBillingToggleProps {
  isYearly: boolean;
  onChange: (isYearly: boolean) => void;
  freeMonthsWhenYearly?: number;
  className?: string;
}

export function PricingBillingToggle({
  isYearly,
  onChange,
  freeMonthsWhenYearly = FREE_MONTHS_WHEN_YEARLY,
  className,
}: PricingBillingToggleProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 p-1 bg-muted rounded-lg",
        className
      )}
    >
      <div
        className={cn(
          "px-4 py-2 rounded-md transition-all",
          !isYearly && "bg-background shadow-sm"
        )}
      >
        <button
          onClick={() => onChange(false)}
          className={cn(
            "text-sm font-medium transition-colors",
            !isYearly ? "text-foreground" : "text-muted-foreground"
          )}
        >
          Monthly
        </button>
      </div>
      <div
        className={cn(
          "px-4 py-2 rounded-md transition-all",
          isYearly && "bg-background shadow-sm"
        )}
      >
        <button
          onClick={() => onChange(true)}
          className={cn(
            "text-sm font-medium transition-colors flex items-center gap-2",
            isYearly ? "text-foreground" : "text-muted-foreground"
          )}
        >
          Yearly
          <Badge variant="success">{freeMonthsWhenYearly} months free</Badge>
        </button>
      </div>
    </div>
  );
}

export default PricingBillingToggle;
