import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check, Info } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { Divider } from "../ui/divider";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface Plan {
  name: string;
  description: string;
  price: number;
  features: Feature[];
  popular: boolean;
  bestValue: boolean;
}

interface Feature {
  label: ReactNode;
  tooltip?: string;
  isBold?: boolean;
  comingSoon?: boolean;
}

const featureContentScheduling: Feature = {
  label: "Content scheduling",
  tooltip:
    "Schedule your content to be posted at a specific time and date. And get suggestions for the best time to post.",
};

const featureUnlimitedBrands: Feature = {
  label: (
    <span>
      Unlimited{" "}
      <Link
        href="/blog/what-is-a-brand-and-why-is-it-important"
        className="text-primary"
      >
        brands
      </Link>
    </span>
  ),
  tooltip: "Organize your social media accounts with multiple brands.",
};

const featureEcommerceIntegration: Feature = {
  label: "E-commerce integration",
  tooltip: "Integrate your e-commerce platform with your social media.",
  comingSoon: true,
};

const featureAnalytics: Feature = {
  label: "Analytics",
  comingSoon: true,
};

const featureAITools: Feature = {
  label: "AI assistant",
  tooltip: "Use AI to generate content and schedule your posts.",
  comingSoon: true,
};

export function PricingSection() {
  const plans: Plan[] = [
    {
      name: "Starter",
      description: "Perfect for beginners",
      price: 5,
      features: [
        { label: "5 social media integrations", isBold: true },
        featureContentScheduling,
        featureUnlimitedBrands,
        featureEcommerceIntegration,
        featureAnalytics,
      ],
      popular: false,
      bestValue: false,
    },
    {
      name: "Creator",
      description: "Ideal for content creators",
      price: 15,
      features: [
        { label: "15 social media integrations", isBold: true },
        featureContentScheduling,
        featureUnlimitedBrands,
        featureEcommerceIntegration,
        featureAnalytics,
        featureAITools,
      ],
      popular: true,
      bestValue: false,
    },
    {
      name: "Pro",
      description: "For teams and agencies",
      price: 20,
      features: [
        { label: "Unlimited social media integrations", isBold: true },
        featureContentScheduling,
        featureUnlimitedBrands,
        featureEcommerceIntegration,
        featureAnalytics,
        featureAITools,
        { label: "Team collaboration" },
        { label: "Priority support" },
      ],
      popular: false,
      bestValue: true,
    },
  ];

  return (
    <section id="pricing" className="container pt-32">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
        <p className="text-lg text-muted-foreground">
          Choose the plan that fits your needs
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={cn(
              "flex flex-col",
              plan.popular ? "border-primary" : ""
            )}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 h-6">
                {plan.name}
                {plan.popular && <Badge className="ml-2">Most Popular</Badge>}
                {plan.bestValue && <Badge className="ml-2">Best Value</Badge>}
              </CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="text-3xl font-bold">
                ${plan.price}
                <span className="text-lg text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col space-y-3">
              {plan.features
                .filter((feature) => !feature.comingSoon)
                .map((feature, idx) => (
                  <div
                    key={
                      typeof feature.label === "string"
                        ? feature.label
                        : `feature-${idx}`
                    }
                    className="flex items-center justify-between"
                  >
                    <div className="inline-flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" />

                      <div className={cn(feature.isBold && "font-bold")}>
                        {feature.label}
                      </div>
                    </div>

                    {feature.tooltip && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="max-w-[calc(100vw-1.5rem)] text-wrap">
                            {feature.tooltip}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                ))}

              {plan.features.filter((feature) => feature.comingSoon).length >
                0 && (
                <>
                  <div className="flex-1" />
                  <div className="flex flex-col py-4">
                    <Divider text="Coming Soon" />
                  </div>
                </>
              )}
              {plan.features
                .filter((feature) => feature.comingSoon)
                .map((feature, idx) => (
                  <div
                    key={
                      typeof feature.label === "string"
                        ? feature.label
                        : `feature-${idx}`
                    }
                    className="flex items-center justify-between"
                  >
                    <div className="inline-flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" />

                      <div className={cn(feature.isBold && "font-bold")}>
                        {feature.label}
                      </div>
                    </div>

                    {feature.tooltip && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="max-w-[calc(100vw-1.5rem)] text-wrap">
                            {feature.tooltip}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
