import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Content Creator",
      company: "@sarahjcreates",
      avatar: "",
      content:
        "Scheddly has completely transformed how I manage my social media. I&apos;ve gone from spending 3 hours a day on posting to just 30 minutes of planning per week!",
      rating: 5,
    },
    {
      name: "Marcus Chen",
      role: "Marketing Manager",
      company: "TechFlow Inc",
      avatar: "",
      content:
        "The analytics insights helped us increase our engagement by 150%. The team collaboration features make it easy to coordinate campaigns across our entire marketing team.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Small Business Owner",
      company: "Bloom Boutique",
      avatar: "",
      content:
        "As a small business owner, I needed something simple but powerful. Scheddly is exactly that - it&apos;s helped me grow my Instagram following by 300% in just 6 months.",
      rating: 5,
    },
    {
      name: "David Park",
      role: "Social Media Manager",
      company: "Creative Agency",
      avatar: "",
      content:
        "Managing 15+ client accounts used to be a nightmare. Now with Scheddly, I can schedule months ahead and track performance for all clients in one dashboard.",
      rating: 5,
    },
    {
      name: "Lisa Thompson",
      role: "Influencer",
      company: "@lisalifestyle",
      avatar: "",
      content:
        "The AI-powered optimal timing feature has boosted my reach significantly. My posts now get 40% more engagement just by posting at the right times.",
      rating: 5,
    },
    {
      name: "James Wilson",
      role: "E-commerce Director",
      company: "FitGear Co",
      avatar: "",
      content:
        "The e-commerce integration is a game-changer. We can now directly track which social media posts drive sales. Our ROI visibility has never been better.",
      rating: 5,
    },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <section className="container py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">
          Loved by Creators and Businesses
        </h2>
        <p className="text-lg text-muted-foreground">
          See what our users have to say about their experience
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="h-full">
            <CardHeader>
              <div className="flex items-center gap-4 mb-4">
                <Avatar>
                  <AvatarImage src={testimonial.avatar} />
                  <AvatarFallback>
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                  <p className="text-sm text-primary">{testimonial.company}</p>
                </div>
              </div>
              <div className="flex gap-1 mb-4">
                {renderStars(testimonial.rating)}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                &quot;{testimonial.content}&quot;
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
