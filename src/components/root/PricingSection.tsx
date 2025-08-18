"use client";

import { useState } from "react";
//
import { NoCardCancelNote } from "@/components/common/NoCardCancelNote";
import { PricingBillingToggle } from "@/components/common/PricingBillingToggle";
import { PricingTiers } from "@/components/common/PricingTiers";

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="container pt-32">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
        <p className="text-lg text-muted-foreground">
          Choose the plan that fits your needs
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <PricingBillingToggle isYearly={isYearly} onChange={setIsYearly} />
      </div>
      <PricingTiers isYearly={isYearly} className="max-w-6xl mx-auto" />
      <div className="max-w-6xl mx-auto mt-6 text-center">
        <NoCardCancelNote />
      </div>
    </section>
  );
}
