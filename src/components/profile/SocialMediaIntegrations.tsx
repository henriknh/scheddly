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
