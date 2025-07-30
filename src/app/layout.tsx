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
  manifest: "/manifest.json",
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
    statusBarStyle: "black-translucent",
    title: config.appName,
    startupImage: [
      {
        url: "/logo_padded_1024.png",
        media:
          "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)",
      },
      {
        url: "/logo_padded_1024.png",
        media:
          "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)",
      },
      {
        url: "/logo_padded_1024.png",
        media:
          "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)",
      },
    ],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": config.appName,
    "mobile-web-app-capable": "yes",
    "theme-color": "#000000",
    "msapplication-TileColor": "#000000",
    "msapplication-config": "/browserconfig.xml",
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
