import Link from "next/link";
import config from "@/config";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="text-xl font-semibold">{config.appName}</div>
            <p className="text-sm text-muted-foreground max-w-[40ch]">
              Schedule posts, track performance, and manage your social media in
              one place.
            </p>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Product
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <Link
                href="/#features"
                className="text-muted-foreground hover:text-foreground"
              >
                Features
              </Link>
              <Link
                href="/#how-it-works"
                className="text-muted-foreground hover:text-foreground"
              >
                How it works
              </Link>
              <Link
                href="/#pricing"
                className="text-muted-foreground hover:text-foreground"
              >
                Pricing
              </Link>
              <Link
                href="/#faq"
                className="text-muted-foreground hover:text-foreground"
              >
                FAQ
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Resources
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <Link
                href="/blog"
                className="text-muted-foreground hover:text-foreground"
              >
                Blog
              </Link>
              <Link
                href="/privacy-policy"
                className="text-muted-foreground hover:text-foreground"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-of-service"
                className="text-muted-foreground hover:text-foreground"
              >
                Terms of Service
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Account
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <Link
                href="/auth/login"
                className="text-muted-foreground hover:text-foreground"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="text-muted-foreground hover:text-foreground"
              >
                Register
              </Link>
              <Link
                href="/dashboard"
                className="text-muted-foreground hover:text-foreground"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {config.appName}. All rights reserved.
          </div>
          <div className="text-xs text-muted-foreground">
            Built with ❤️ for creators and teams
          </div>
        </div>
      </div>
    </footer>
  );
}
