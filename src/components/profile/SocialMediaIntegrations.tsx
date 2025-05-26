"use client";

import { SocialMedia } from "@/generated/prisma";
import { SocialMediaIntegrationsCard } from "./SocialMediaIntegrationsCard";

export type Platform = {
  id: SocialMedia;
  name: string;
  description: string;
  icon: string;
  clientIdLabel?: string;
  clientSecretLabel?: string;
  accessTokenLabel?: string;
  configurationGuideUrl: string;
};

export function SocialMediaIntegrations() {
  const platforms: Platform[] = [
    {
      id: SocialMedia.TUMBLR,
      name: "Tumblr",
      description: "Share your products and content on Tumblr",
      icon: "/icons/tumblr.svg",
      clientIdLabel: "OAuth consumer key",
      clientSecretLabel: "OAuth consumer secret",
      configurationGuideUrl: "https://www.tumblr.com/oauth/apps",
    },

    {
      id: SocialMedia.PINTEREST,
      name: "Pinterest",
      description: "Share your products and content on Pinterest",
      icon: "/icons/pinterest.svg",
      clientIdLabel: "App ID",
      clientSecretLabel: "App secret key",
      configurationGuideUrl: "https://developers.pinterest.com/apps/",
    },
    {
      id: SocialMedia.FACEBOOK,
      name: "Facebook",
      description: "Share your products and content on Facebook",
      icon: "/icons/facebook.svg",
      configurationGuideUrl: "https://developers.facebook.com/apps/",
    },
    {
      id: SocialMedia.INSTAGRAM,
      name: "Instagram",
      description: "Share your products and content on Instagram",
      icon: "/icons/instagram.svg",
      configurationGuideUrl: "https://developers.instagram.com/apps/",
    },
    {
      id: SocialMedia.YOUTUBE,
      name: "YouTube",
      description: "Share your products and content on YouTube",
      icon: "/icons/youtube.svg",
      configurationGuideUrl: "https://developers.youtube.com/apps/",
    },
    {
      id: SocialMedia.TIKTOK,
      name: "TikTok",
      description: "Share your products and content on TikTok",
      icon: "/icons/tiktok.svg",
      configurationGuideUrl: "https://developers.tiktok.com/apps/",
    },
    {
      id: SocialMedia.THREADS,
      name: "Threads",
      description: "Share your products and content on Threads",
      icon: "/icons/threads.svg",
      configurationGuideUrl: "https://developers.threads.com/apps/",
    },
    {
      id: SocialMedia.X,
      name: "X",
      description: "Share your products and content on X",
      icon: "/icons/x.svg",
      configurationGuideUrl: "https://developers.x.com/apps/",
    },
    {
      id: SocialMedia.LINKEDIN,
      name: "LinkedIn",
      description: "Share your products and content on LinkedIn",
      icon: "/icons/linkedin.svg",
      configurationGuideUrl: "https://developers.linkedin.com/apps/",
    },
  ].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {platforms.map((platform) => (
          <SocialMediaIntegrationsCard key={platform.id} platform={platform} />
        ))}
      </div>
    </div>
  );
}
