import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TRIAL_PERIOD_DAYS } from "@/lib/subscription";

export function FinalCTASection() {
  return (
    <section className="container pt-32">
      <div className="flex flex-col items-center text-center gap-8 py-16 bg-secondary rounded-lg">
        <h2 className="text-3xl font-bold">
          Ready to Transform Your Social Media?
        </h2>
        <p className="text-lg text-muted-foreground max-w-[500px]">
          Join thousands of creators and businesses who are already scaling
          their social media presence.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" asChild>
            <Link href="/auth/register">
              Start Free {TRIAL_PERIOD_DAYS}-Day Trial
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          No credit card required • Cancel anytime
        </p>
      </div>
    </section>
  );
}
