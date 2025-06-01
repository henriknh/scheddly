import { SocialMedia } from "@/generated/prisma";
import { SocialMediaApiFunctions } from "./social-media-api-functions/social-media-api-functions";
import { pinterest } from "./social-media-api-functions/pinterest";

export type SocialMediaPlatform = {
  id: SocialMedia;
  name: string;
  icon: string;
  socialMediaApiFunctions: SocialMediaApiFunctions;
};

export const socialMediaPlatforms: SocialMediaPlatform[] = [
  {
    id: SocialMedia.PINTEREST,
    name: "Pinterest",
    icon: "/icons/pinterest.svg",
    socialMediaApiFunctions: pinterest,
  },
  //   {
  //     id: SocialMedia.TUMBLR,
  //     name: "Tumblr",
  //     icon: "/icons/tumblr.svg",
  //   },
  //   {
  //     id: SocialMedia.FACEBOOK,
  //     name: "Facebook",
  //     icon: "/icons/facebook.svg",
  //   },
  //   {
  //     id: SocialMedia.INSTAGRAM,
  //     name: "Instagram",
  //     icon: "/icons/instagram.svg",
  //   },
  //   {
  //     id: SocialMedia.YOUTUBE,
  //     name: "YouTube",
  //     icon: "/icons/youtube.svg",
  //   },
  //   {
  //     id: SocialMedia.TIKTOK,
  //     name: "TikTok",
  //     icon: "/icons/tiktok.svg",
  //   },
  //   {
  //     id: SocialMedia.THREADS,
  //     name: "Threads",
  //     icon: "/icons/threads.svg",
  //   },
  //   {
  //     id: SocialMedia.X,
  //     name: "X",
  //     icon: "/icons/x.svg",
  //   },
  //   {
  //     id: SocialMedia.LINKEDIN,
  //     name: "LinkedIn",
  //     icon: "/icons/linkedin.svg",
  //   },
].sort((a, b) => a.name.localeCompare(b.name));
