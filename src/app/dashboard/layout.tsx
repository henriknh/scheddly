import { AuthProviderWrapper } from "@/components/auth/auth-provider-wrapper";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { BreadcrumbsProvider } from "@/components/common/breadcrumbs-context";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { MobileTopNav } from "@/components/MobileTopNav";
import { SubscriptionWarningBanner } from "@/components/subscription-warning-banner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getUserFromToken } from "@/lib/user";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get user's sidebar preference from database
  const user = await getUserFromToken();
  const sidebarOpen = user?.sidebarOpen ?? true;

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <AuthProviderWrapper>
      <SidebarProvider defaultOpen={sidebarOpen}>
        <div className="flex w-full min-h-screen flex-col">
          <MobileTopNav />
          <div className="flex flex-1">
            <DashboardSidebar />
            <main className="flex-1 flex justify-center overflow-x-auto">
              <div className="container flex flex-col space-y-6 py-4">
                <SubscriptionWarningBanner />

                <BreadcrumbsProvider>
                  <Breadcrumbs />
                  {children}
                </BreadcrumbsProvider>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </AuthProviderWrapper>
  );
}
