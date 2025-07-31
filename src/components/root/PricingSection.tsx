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
  const plans = [
    {
      name: "Starter",
      description: "Perfect for individual creators",
      price: 10,
      features: [
        "10 social media integrations",
        "Basic analytics",
        "Content scheduling",
        "1 brand",
      ],
      popular: false,
    },
    {
      name: "Professional",
      description: "For growing businesses and teams",
      price: 20,
      features: [
        "Unlimited social media integrations",
        "Advanced analytics",
        "Team collaboration",
        "Multiple brands",
        "E-commerce integration",
      ],
      popular: true,
    },
  ];

  return (
    <section id="pricing" className="container">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
        <p className="text-lg text-muted-foreground">
          Choose the plan that fits your needs
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
