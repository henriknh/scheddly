"use client";

import { Button } from "@/components/ui/button";
import { ImageIcon, TextIcon, VideoIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { WeeklyCalendar } from "@/components/posts/WeeklyCalendar";
import { getPosts } from "@/app/api/post/get-posts";
import { PostWithRelations } from "@/app/api/post/types";

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

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* Create Content Buttons - horizontal on desktop, vertical on mobile */}
      <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full justify-center items-center mt-2 mb-4">
        <Link href="/dashboard/create-new-post/text" className="w-full md:w-auto">
          <Button variant="default" size="lg" className="w-full md:w-auto flex items-center gap-2">
            <TextIcon className="h-5 w-5" />
            Text Post
          </Button>
        </Link>
        <Link href="/dashboard/create-new-post/image" className="w-full md:w-auto">
          <Button variant="default" size="lg" className="w-full md:w-auto flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Image Post
          </Button>
        </Link>
        <Link href="/dashboard/create-new-post/video" className="w-full md:w-auto">
          <Button variant="default" size="lg" className="w-full md:w-auto flex items-center gap-2">
            <VideoIcon className="h-5 w-5" />
            Video Post
          </Button>
        </Link>
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
