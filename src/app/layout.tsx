import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { AuthProviderWrapper } from "@/components/auth/auth-provider-wrapper";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ensureBucketExists } from "@/lib/minio";
import config from "@/config";

const inter = Inter({ subsets: ["latin"] });

// Initialize MinIO bucket
if (process.env.NODE_ENV === "production") {
  ensureBucketExists().catch(console.error);
}

export const metadata: Metadata = {
  title: config.appName,
  description: config.appDescription,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <AuthProviderWrapper>
              {children}
              <Toaster />
            </AuthProviderWrapper>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
