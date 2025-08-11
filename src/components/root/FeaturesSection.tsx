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
      title: "Smart Social Media Scheduling",
      description:
        "Schedule posts across Instagram, Facebook, Twitter, LinkedIn, Pinterest, and TikTok with optimal timing algorithms. Our social media scheduling tool ensures your content reaches your audience when they're most active.",
      icon: <Clock className="h-6 w-6 text-primary" />,
    },
    {
      title: "Advanced Analytics & Performance Tracking",
      description:
        "Track engagement rates, audience growth, and content performance with detailed analytics. Understand which posts perform best and optimize your social media strategy with data-driven insights.",
      icon: <BarChart3 className="h-6 w-6 text-primary" />,
    },
    {
      title: "Team Collaboration & Brand Management",
      description:
        "Work together with your team, manage multiple brands, and streamline your social media workflow. Perfect for agencies and businesses managing multiple social media accounts.",
      icon: <Users className="h-6 w-6 text-primary" />,
    },
    {
      title: "E-commerce Integration & ROI Tracking",
      description:
        "Connect your online stores and track how your social media content drives sales. Measure the ROI of your social media marketing efforts with our comprehensive e-commerce integration.",
      icon: <ShoppingBag className="h-6 w-6 text-primary" />,
    },
  ];

  return (
    <section id="features" className="container pt-32">
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
