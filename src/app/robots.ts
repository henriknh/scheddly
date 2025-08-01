import { MetadataRoute } from "next";
import config from "@/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/auth/", "/api/", "/_next/", "/admin/"],
    },
    sitemap: `${config.appUrl}/sitemap.xml`,
  };
}
