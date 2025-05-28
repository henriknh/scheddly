import { getSocialMediaIntegrations } from "@/app/api/user/social-media-integration";
import { SocialMedia } from "@/generated/prisma";
import { SocialMediaIntegrationsList } from "./SocialMediaIntegrationsList";

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

export const platforms: Platform[] = [
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

export async function SocialMediaIntegrations() {
  const integrations = await getSocialMediaIntegrations();

  return (
    <div className="space-y-4">
      <SocialMediaIntegrationsList integrations={integrations} />
    </div>
  );
}
