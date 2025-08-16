import { TopNav } from "@/components/root/TopNav";
import { Footer } from "@/components/root/Footer";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1">
        <TooltipProvider delayDuration={0}>
          {children}
        </TooltipProvider>
      </main>
      <div className="container px-4">
        <Footer />
      </div>
    </div>
  );
}
