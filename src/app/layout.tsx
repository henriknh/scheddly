import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import config from "@/config";
import { ensureBucketExists } from "@/lib/minio";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// Initialize MinIO bucket
if (process.env.NODE_ENV === "production") {
  ensureBucketExists().catch(console.error);
}

export const metadata: Metadata = {
  title: config.appName,
  description: config.appDescription,
  icons: {
    icon: [
      { url: "/logo_256.png", sizes: "256x256", type: "image/png" },
      { url: "/logo_128.png", sizes: "128x128", type: "image/png" },
      { url: "/logo_512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/logo_padded_1024.png", sizes: "1024x1024", type: "image/png" },
      { url: "/logo_padded_512.png", sizes: "512x512", type: "image/png" },
      { url: "/logo_padded_256.png", sizes: "256x256", type: "image/png" },
      { url: "/logo_padded_128.png", sizes: "128x128", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: config.appName,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
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
            {children}
            <Toaster />
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
