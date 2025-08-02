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
      <main className="flex-1 pt-[env(safe-area-inset-top)]">{children}</main>
      <Footer />
    </div>
  );
}
