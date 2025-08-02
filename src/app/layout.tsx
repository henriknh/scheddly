import { StructuredData } from "@/components/root/StructuredData";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import config from "@/config";
import { ensureBucketExists } from "@/lib/minio";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// Initialize MinIO bucket
if (process.env.NODE_ENV === "production") {
  ensureBucketExists().catch(console.error);
}

export const metadata: Metadata = {
  title: {
    default: config.appName,
    template: `%s | ${config.appName}`,
  },
  description: config.appDescription,
  keywords: config.appKeywords,
  authors: [{ name: config.appAuthor }],
  creator: config.appAuthor,
  publisher: config.appName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(config.appUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: config.appUrl,
    title: config.appName,
    description: config.appDescription,
    siteName: config.appName,
    images: [
      {
        url: config.appImage,
        width: 1200,
        height: 630,
        alt: `${config.appName} - Social Media Scheduling Platform`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: config.appName,
    description: config.appDescription,
    images: [config.appTwitterImage || config.appImage],
    creator: config.appTwitterHandle,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
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
    statusBarStyle: "default",
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
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": config.appName,
    "mobile-web-app-capable": "yes",
    "theme-color": "#3b82f6",
    "msapplication-TileColor": "#3b82f6",
    "msapplication-config": "/browserconfig.xml",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#3b82f6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <StructuredData />

        {/* Safe area handling for mobile devices */}
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-capable" content="yes" />

        <Script
          defer
          src="https://ohsosaasy.com/so-analytic-so-wow.js"
          oh-so-saasy-project="hf8chxmq6m505q3"
        />
      </head>
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
