import { ReactNode } from "react";
import WhatIsABrandAndWhyIsItImportant from "./what-is-a-brand-and-why-is-it-important";
import WhyScheddlyIsBestForIndividuals from "./why-scheddly-is-great-for-individuals";
import WhyScheddlyIsBestForBusinesses from "./why-scheddly-is-great-for-businesses";
import TimeMattersSaveTime from "./time-matters-save-time-with-scheddly";
import TimingMattersWhenToPost from "./timing-matters-when-to-post-for-most-engagement";
import ShortVsLongTextOnSocialMedia from "./short-vs-long-text-on-social-media";

type Tag =
  | "Branding"
  | "Strategy"
  | "Marketing"
  | "Small Business"
  | "Productivity"
  | "Automation"
  | "Scheduling"
  | "Tips"
  | "Workflow"
  | "Teams"
  | "Creators"
  | "Solo"
  | "Content Strategy"
  | "Timing"
  | "Engagement";

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string; // ISO date
  tags: Tag[]; // Max 3
  readTimeMinutes?: number;
  coverImageUrl: string;
  content: () => ReactNode;
};

/**
 * Blog ideas
 *
 * Why Scheddly is the best for individuals
 *
 * Why Scheddly is the best for businesses
 *
 * Time matters - How to use Scheddly to save time
 *
 * Timing matters - When to post to get the most engagement
 */

export const posts: BlogPost[] = [
  WhatIsABrandAndWhyIsItImportant,
  WhyScheddlyIsBestForIndividuals,
  WhyScheddlyIsBestForBusinesses,
  TimeMattersSaveTime,
  TimingMattersWhenToPost,
  ShortVsLongTextOnSocialMedia,
];

export function getAllPosts() {
  return posts
    .slice()
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

export function getPostBySlug(slug: string) {
  return posts.find((p) => p.slug === slug) || null;
}
