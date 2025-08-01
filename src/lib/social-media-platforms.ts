import { PostType, SocialMedia } from "@/generated/prisma";
import { SocialMediaApiFunctions } from "./social-media-api-functions/social-media-api-functions";
import { instagram } from "./social-media-api-functions/instagram";
import { pinterest } from "./social-media-api-functions/pinterest";
import { tumblr } from "./social-media-api-functions/tumblr";
import { x } from "./social-media-api-functions/x";
import {
  PinterestIcon,
  TumblrIcon,
  InstagramIcon,
  XIcon,
} from "@/components/icons";

export type SocialMediaPlatform = {
  id: SocialMedia;
  name: string;
  Icon: React.ComponentType<{ className?: string }>;
  socialMediaApiFunctions: SocialMediaApiFunctions;
  supportsPostTypes: PostType[];
  supportsDeletePost: boolean;
};

export const socialMediaPlatforms: SocialMediaPlatform[] = [
  {
    id: SocialMedia.INSTAGRAM,
    name: "Instagram",
    Icon: InstagramIcon,
    socialMediaApiFunctions: instagram,
    supportsPostTypes: [PostType.IMAGE, PostType.VIDEO],
    supportsDeletePost: true,
  },
  {
    id: SocialMedia.PINTEREST,
    name: "Pinterest",
    Icon: PinterestIcon,
    socialMediaApiFunctions: pinterest,
    supportsPostTypes: [PostType.IMAGE, PostType.VIDEO],
    supportsDeletePost: true,
  },
  {
    id: SocialMedia.TUMBLR,
    name: "Tumblr",
    Icon: TumblrIcon,
    socialMediaApiFunctions: tumblr,
    supportsPostTypes: [PostType.TEXT, PostType.IMAGE, PostType.VIDEO],
    supportsDeletePost: true,
  },
  {
    id: SocialMedia.X,
    name: "X",
    Icon: XIcon,
    socialMediaApiFunctions: x,
    supportsPostTypes: [PostType.TEXT], // TODO Enable images and videos when paying for X
    supportsDeletePost: true,
  },
  //   {
  //     id: SocialMedia.FACEBOOK,
  //     name: "Facebook",
  //     Icon: FacebookIcon,
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
  //     id: SocialMedia.LINKEDIN,
  //     name: "LinkedIn",
  //     Icon: LinkedInIcon,
  //   },
].sort((a, b) => (a.id < b.id ? 1 : -1));

export function getSocialMediaPlatform(socialMedia: SocialMedia) {
  return socialMediaPlatforms.find((platform) => platform.id === socialMedia);
}
