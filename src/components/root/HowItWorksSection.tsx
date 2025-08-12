export function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: "Connect Your Accounts",
      description:
        "Link your social media accounts with secure OAuth authentication",
    },
    {
      number: 2,
      title: "Create Your Content",
      description:
        "Upload media, write captions, and customize for each platform",
    },
    {
      number: 3,
      title: "Schedule & Analyze",
      description:
        "Set your posting schedule and track performance with detailed analytics",
    },
  ];

  return (
    <section id="how-it-works" className="container pt-32">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">
          Get Started in 3 Simple Steps
        </h2>
        <p className="text-lg text-muted-foreground">
          From setup to your first scheduled post
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step) => (
          <div key={step.number} className="text-center">
            <div className="h-16 w-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              {step.number}
            </div>
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
