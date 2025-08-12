import { TopNav } from "@/components/root/TopNav";
import { Footer } from "@/components/root/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1">
        <div className="container px-4">{children}</div>
      </main>
      <div className="container px-4">
        <Footer />
      </div>
    </div>
  );
}
