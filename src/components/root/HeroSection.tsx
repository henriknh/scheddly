import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden h-svh w-screen flex items-center justify-center pt-sat">
      {/* Background SVG */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/hero-bg.svg"
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content */}
      <div className="container relative z-10">
        <div className="flex flex-col items-center text-center gap-8 py-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
            Manage All Your Social Media
            <span className="text-primary block">In One Place</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-[600px]">
            Schedule posts, track performance, and grow your audience on every
            platform—your all-in-one social media growth engine for creators and
            brands ready to scale.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild>
              <Link href="/auth/register">Start Free 7-Day Trial</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#how-it-works">See How It Works</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            No credit card required • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}
