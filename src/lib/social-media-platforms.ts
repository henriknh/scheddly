import { PostType, SocialMedia } from "@/generated/prisma";
import { SocialMediaApiFunctions } from "./social-media-api-functions/social-media-api-functions";
import { pinterest } from "./social-media-api-functions/pinterest";
import { tumblr } from "./social-media-api-functions/tumblr";
import { PinterestIcon } from "@/components/icons/pinterest";
import { TumblrIcon } from "@/components/icons/tumblr";

export type SocialMediaPlatform = {
  id: SocialMedia;
  name: string;
  Icon: React.ComponentType<{ className?: string }>;
  socialMediaApiFunctions: SocialMediaApiFunctions;
  supportsPostTypes: PostType[];
};

export const socialMediaPlatforms: SocialMediaPlatform[] = [
  {
    id: SocialMedia.PINTEREST,
    name: "Pinterest",
    Icon: PinterestIcon,
    socialMediaApiFunctions: pinterest,
    supportsPostTypes: [PostType.IMAGE, PostType.VIDEO],
  },
  {
    id: SocialMedia.TUMBLR,
    name: "Tumblr",
    Icon: TumblrIcon,
    socialMediaApiFunctions: tumblr,
    supportsPostTypes: [PostType.TEXT, PostType.IMAGE, PostType.VIDEO],
  },
  //   {
  //     id: SocialMedia.FACEBOOK,
  //     name: "Facebook",
  //     Icon: FacebookIcon,
  //   },
  //   {
  //     id: SocialMedia.INSTAGRAM,
  //     name: "Instagram",
  //     Icon: InstagramIcon,
  //   },
  //   {
  //     id: SocialMedia.YOUTUBE,
  //     name: "YouTube",
  //     Icon: YouTubeIcon,
  //   },
  //   {
  //     id: SocialMedia.TIKTOK,
  //     name: "TikTok",
  //     Icon: TikTokIcon,
  //   },
  //   {
  //     id: SocialMedia.THREADS,
  //     name: "Threads",
  //     Icon: ThreadsIcon,
  //   },
  //   {
  //     id: SocialMedia.X,
  //     name: "X",
  //     Icon: XIcon,
  //   },
  //   {
  //     id: SocialMedia.LINKEDIN,
  //     name: "LinkedIn",
  //     Icon: LinkedInIcon,
  //   },
].sort((a, b) => (a.id < b.id ? 1 : -1));

export function getSocialMediaPlatform(socialMedia: SocialMedia) {
  return socialMediaPlatforms.find((platform) => platform.id === socialMedia);
}
