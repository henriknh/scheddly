import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full">
      <DashboardSidebar />
      <main className="flex-1 flex justify-center">
        <div className="container flex flex-col space-y-4 py-8">{children}</div>
      </main>
    </div>
  );
}
