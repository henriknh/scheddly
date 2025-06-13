import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-1 flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 p-4 text-center">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-4xl font-bold tracking-tight">404</h1>
        <h2 className="text-xl font-semibold">Page not found</h2>
        <p className="text-muted-foreground">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
      </div>
      <Button asChild variant="outline" className="gap-2">
        <Link href="/">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
      </Button>
    </div>
  );
}
