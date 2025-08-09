import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";

export function PricingSection() {
  // Helper to round counts to "nice" friendly numbers
  function roundToNice(value: number): number {
    if (value <= 20) return Math.round(value); // small numbers: integer
    if (value <= 200) return Math.round(value / 10) * 10; // medium: nearest 10
    if (value <= 500) return Math.round(value / 50) * 50; // larger: nearest 50
    return Math.round(value / 100) * 100; // very large: nearest 100
  }

  // Base quotas for the bottom tier
  const basePostsPerMonth = 50;
  const baseAiCredits = 100;
  const baseSocialProfiles = 3;

  // Apply multipliers to FEATURES (not price)
  const growthPostsPerMonth = roundToNice(basePostsPerMonth * 2.2);
  const growthAiCredits = roundToNice(baseAiCredits * 2.2);
  const growthSocialProfiles = roundToNice(baseSocialProfiles * 2.2);

  const scalePostsPerMonth = roundToNice(growthPostsPerMonth * 1.8);
  const scaleAiCredits = roundToNice(growthAiCredits * 1.8);
  const scaleSocialProfiles = roundToNice(growthSocialProfiles * 1.8);

  // Use "nice" fixed prices
  const plans = [
    {
      name: "Starter",
      description: "For individuals getting started",
      price: 19,
      features: [
        `${basePostsPerMonth} scheduled posts / month`,
        `${baseAiCredits} AI caption credits / month`,
        `${baseSocialProfiles} connected social profiles`,
        // Unique to this tier
        "Email support",
        "Basic analytics",
        "1 brand",
      ],
      popular: false,
    },
    {
      name: "Growth",
      description: "Best for small teams",
      price: 49,
      features: [
        `${growthPostsPerMonth} scheduled posts / month`,
        `${growthAiCredits} AI caption credits / month`,
        `${growthSocialProfiles} connected social profiles`,
        // Unique to this tier
        "Priority support",
        "Advanced analytics",
        "3 brands",
      ],
      popular: true,
    },
    {
      name: "Scale",
      description: "For growing businesses that need more",
      price: 89,
      features: [
        `${scalePostsPerMonth} scheduled posts / month`,
        `${scaleAiCredits} AI caption credits / month`,
        `${scaleSocialProfiles} connected social profiles`,
        // Unique to this tier
        "Dedicated success manager",
        "Custom integrations",
        "Unlimited brands",
      ],
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="container py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
        <p className="text-lg text-muted-foreground">
          Choose the plan that fits your needs
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={plan.popular ? "border-primary" : ""}
          >
            <CardHeader>
              {plan.popular && (
                <Badge className="w-fit mb-2">Most Popular</Badge>
              )}
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="text-3xl font-bold">
                ${plan.price}
                <span className="text-lg text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
