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
  const bottomPrice = 10;
  const middlePrice = Math.round(bottomPrice * 2.2);
  const topPrice = Math.round(middlePrice * 1.8);

  const plans = [
    {
      name: "Starter",
      description: "For individuals getting started",
      price: bottomPrice,
      features: [
        "1 brand",
        "Basic analytics",
        "Content scheduling",
      ],
      popular: false,
    },
    {
      name: "Growth",
      description: "Best for small teams",
      price: middlePrice,
      features: [
        "3 brands",
        "Advanced analytics",
        "Team collaboration",
      ],
      popular: true,
    },
    {
      name: "Scale",
      description: "For growing businesses that need more",
      price: topPrice,
      features: [
        "Unlimited brands",
        "Priority support",
        "Custom integrations",
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
