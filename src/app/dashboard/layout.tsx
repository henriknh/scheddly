import { AuthProviderWrapper } from "@/components/auth/auth-provider-wrapper";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Footer } from "@/components/root/Footer";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

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
    <AuthProviderWrapper>
      <div className="flex w-full min-h-screen flex-col">
        <div className="flex flex-1">
          <DashboardSidebar />
          <main className="flex-1 flex justify-center">
            <div className="container flex flex-col space-y-4 py-8">
              <Breadcrumbs />
              {children}
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </AuthProviderWrapper>
  );
}
