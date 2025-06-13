import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col gap-16 py-8 items-center">
      {/* Hero Section */}
      <section className="container">
        <div className="flex flex-col items-center text-center gap-8 py-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
            Connect, Share, and Shop
          </h1>
          <p className="text-xl text-muted-foreground max-w-[600px]">
            Join our community where social connections meet e-commerce. Share
            your favorite products and discover amazing deals.
          </p>
          <Button size="lg" asChild>
            <Link href="/auth/register">Get Started</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center gap-4 p-6 rounded-lg border">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold">Connect with Friends</h2>
            <p className="text-muted-foreground">
              Build your network and share your shopping experiences with
              like-minded people.
            </p>
          </div>

          <div className="flex flex-col items-center text-center gap-4 p-6 rounded-lg border">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold">Discover Products</h2>
            <p className="text-muted-foreground">
              Find unique items recommended by your community and trusted
              sellers.
            </p>
          </div>

          <div className="flex flex-col items-center text-center gap-4 p-6 rounded-lg border">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold">Earn Rewards</h2>
            <p className="text-muted-foreground">
              Get rewarded for sharing and engaging with your favorite products
              and brands.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container">
        <div className="flex flex-col items-center text-center gap-8 py-16 bg-primary/5 rounded-lg">
          <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground max-w-[500px]">
            Join thousands of users who are already connecting, sharing, and
            shopping on our platform.
          </p>
          <div className="flex gap-4">
            <Button asChild variant="ghost">
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/register">Create Account</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
