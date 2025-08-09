import { AuthProviderWrapper } from "@/components/auth/auth-provider-wrapper";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { MobileTopNav } from "@/components/MobileTopNav";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { BreadcrumbsProvider } from "@/components/common/breadcrumbs-context";
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
      <SidebarProvider defaultOpen={false}>
        <div className="flex w-full min-h-screen flex-col">
          <MobileTopNav />
          <div className="flex flex-1">
            <DashboardSidebar />
            <main className="flex-1 flex justify-center overflow-x-auto">
              <div className="container flex flex-col space-y-6 py-4">
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
