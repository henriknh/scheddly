import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { socialMediaPlatforms } from "@/lib/social-media-platforms";
import { TRIAL_PERIOD_DAYS } from "@/lib/subscription";
import { NoCardCancelNote } from "@/components/common/NoCardCancelNote";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden h-svh w-full flex items-center justify-center pt-sat">
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
        <div className="flex flex-col items-center text-center gap-8 py-16 pt-32">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
            Manage All Your Social Media
            <span className="text-primary block">In One Place</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-[600px]">
            Schedule posts, gain insights and grow your audience — Get started
            in minutes
          </p>

          <div className="flex flex-col sm:flex-row gap-y-2 gap-x-4">
            <Button size="lg" asChild>
              <Link href="/auth/register">
                Start Free {TRIAL_PERIOD_DAYS}-Day Trial
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#how-it-works">See How It Works</Link>
            </Button>
          </div>

          <p className="flex gap-4">
            {socialMediaPlatforms.map((platform) => (
              <platform.Icon key={platform.id} className="h-4 w-4" />
            ))}
          </p>

          <NoCardCancelNote />
        </div>
      </div>
    </section>
  );
}
