"use client";

import { useAuth } from "@/lib/auth-context";
import { SocialMediaIntegrationsCard } from "./SocialMediaIntegrationsCard";
import { SocialMedia } from "@/generated/prisma";

export type Platform = {
  id: SocialMedia;
  name: string;
  description: string;
  icon: string;
  isConfigured: boolean;
  clientIdAndSecretConfig?: {
    clientId?: string | null;
    clientIdLabel: string;
    clientSecret?: string | null;
    clientSecretLabel: string;
  };
  accessTokenConfig?: {
    accessToken?: string | null;
    accessTokenLabel: string;
  };
  configurationGuideUrl: string;
};

export function SocialMediaIntegrations() {
  const { user } = useAuth();
  const platforms: Platform[] = [
    {
      id: SocialMedia.TUMBLR,
      name: "Tumblr",
      description: "Share your products and content on Tumblr",
      icon: "/icons/tumblr.svg",
      isConfigured: false,
      clientIdAndSecretConfig: {
        clientId: user?.tumblrClientId,
        clientIdLabel: "OAuth consumer key",
        clientSecret: user?.tumblrClientSecret,
        clientSecretLabel: "OAuth consumer secret",
      },
      configurationGuideUrl: "https://www.tumblr.com/oauth/apps",
    },
  ].map((platform: Platform) => ({
    ...platform,
    isConfigured: !!(
      (platform.clientIdAndSecretConfig?.clientId &&
        platform.clientIdAndSecretConfig?.clientSecret) ||
      platform.accessTokenConfig?.accessToken
    ),
  }));

  return (
    <div className="space-y-4">
      {platforms.map((platform) => (
        <SocialMediaIntegrationsCard key={platform.id} platform={platform} />
      ))}
    </div>
  );
}
