"use client";

import { Button } from "@/components/ui/button";
import { ImageIcon, TextIcon, VideoIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { WeeklyCalendar } from "@/components/posts/WeeklyCalendar";
import { getPosts } from "@/app/api/post/get-posts";
import { PostWithRelations } from "@/app/api/post/types";
import { 
  FacebookIcon, 
  InstagramIcon, 
  LinkedInIcon, 
  PinterestIcon, 
  ThreadsIcon, 
  TikTokIcon, 
  TumblrIcon, 
  XIcon, 
  YouTubeIcon 
} from "@/components/icons";

export type Platform = {
  name: string;
  icon: string;
};

export function CreateNewPost() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<{ today: PostWithRelations[]; tomorrow: PostWithRelations[] }>({ today: [], tomorrow: [] });

  useEffect(() => {
    const fetchPostsData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Fetch actual posts for today and tomorrow
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const postsToday = await getPosts({ dateFrom: today.toISOString(), dateTo: today.toISOString() });
        const postsTomorrow = await getPosts({ dateFrom: tomorrow.toISOString(), dateTo: tomorrow.toISOString() });
        setPosts({ today: postsToday, tomorrow: postsTomorrow });
        // Optionally fetch brands if needed for WeeklyCalendar
      } catch (error) {
        console.error('Failed to fetch posts summary:', error);
        setError('Failed to load posts summary');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPostsData();
  }, []);

  const socialMediaIcons = [
    { Icon: FacebookIcon, name: 'Facebook' },
    { Icon: InstagramIcon, name: 'Instagram' },
    { Icon: XIcon, name: 'X' },
    { Icon: LinkedInIcon, name: 'LinkedIn' },
    { Icon: ThreadsIcon, name: 'Threads' },
    { Icon: TikTokIcon, name: 'TikTok' },
    { Icon: YouTubeIcon, name: 'YouTube' },
    { Icon: PinterestIcon, name: 'Pinterest' },
    { Icon: TumblrIcon, name: 'Tumblr' },
  ];

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* Create Content Buttons - horizontally scrollable on mobile */}
      <div className="w-full max-w-screen overflow-x-auto pb-2 md:pb-0 mt-2 mb-4 scrollbar-hide">
        <div className="flex gap-2 md:gap-4 min-w-max">
          <Link href="/dashboard/create-new-post/text" className="flex-shrink-0">
            <Button variant="default" size="lg" className="flex flex-col items-start gap-2 h-auto !py-1 px-6 min-w-[140px]">
              <div className="flex items-center gap-2">
                <TextIcon className="h-5 w-5" />
                <span>Text Post</span>
              </div>
              <div className="flex gap-1 mt-1 justify-start">
                {socialMediaIcons.slice(0, 4).map(({ Icon, name }) => (
                  <Icon key={name} className="h-4 w-4 opacity-70 hover:opacity-100 transition-opacity" />
                ))}
              </div>
            </Button>
          </Link>
          <Link href="/dashboard/create-new-post/image" className="flex-shrink-0">
            <Button variant="default" size="lg" className="flex flex-col items-start gap-2 h-auto !py-1 px-6 min-w-[140px]">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                <span>Image Post</span>
              </div>
              <div className="flex gap-1 mt-1 justify-start">
                {socialMediaIcons.slice(4, 8).map(({ Icon, name }) => (
                  <Icon key={name} className="h-4 w-4 opacity-70 hover:opacity-100 transition-opacity" />
                ))}
              </div>
            </Button>
          </Link>
          <Link href="/dashboard/create-new-post/video" className="flex-shrink-0">
            <Button variant="default" size="lg" className="flex flex-col items-start gap-2 h-auto !py-1 px-6 min-w-[140px]">
              <div className="flex items-center gap-2">
                <VideoIcon className="h-5 w-5" />
                <span>Video Post</span>
              </div>
              <div className="flex gap-1 mt-1 justify-start">
                {socialMediaIcons.slice(8, 9).map(({ Icon, name }) => (
                  <Icon key={name} className="h-4 w-4 opacity-70 hover:opacity-100 transition-opacity" />
                ))}
              </div>
            </Button>
          </Link>
        </div>
      </div>

      {/* Posts Sections - vertical on mobile, horizontal on desktop */}
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <div className="flex-1 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-3 sm:p-4 border border-blue-100 dark:border-blue-900/30">
          <h3 className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-2">Today&apos;s Posts</h3>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <WeeklyCalendar posts={posts.today} brands={[]} />
          )}
        </div>
        <div className="flex-1 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-3 sm:p-4 border border-blue-100 dark:border-blue-900/30">
          <h3 className="font-semibold text-sm text-indigo-900 dark:text-indigo-100 mb-2">Tomorrow&apos;s Posts</h3>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <WeeklyCalendar posts={posts.tomorrow} brands={[]} />
          )}
        </div>
      </div>
      {error && (
        <div className="mt-3 text-xs text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}
