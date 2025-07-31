import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, BarChart3, Users, ShoppingBag } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      title: "Smart Scheduling",
      description: "Schedule posts across all platforms with optimal timing",
      icon: <Clock className="h-6 w-6 text-primary" />,
    },
    {
      title: "Analytics & Insights",
      description:
        "Track performance, understand your audience, and optimize your content",
      icon: <BarChart3 className="h-6 w-6 text-primary" />,
    },
    {
      title: "Team Collaboration",
      description: "Work together with your team and manage multiple brands",
      icon: <Users className="h-6 w-6 text-primary" />,
    },
    {
      title: "E-commerce Integration",
      description:
        "Connect your online stores and track how your content drives sales",
      icon: <ShoppingBag className="h-6 w-6 text-primary" />,
    },
  ];

  return (
    <section id="features" className="container py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">
          Everything You Need to Scale
        </h2>
        <p className="text-lg text-muted-foreground">
          Powerful tools for creators and businesses
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
