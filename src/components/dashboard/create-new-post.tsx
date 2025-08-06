"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PostType } from "@/generated/prisma";
import { socialMediaPlatforms } from "@/lib/social-media-platforms";
import { ImageIcon, TextIcon, VideoIcon, PlusIcon, CalendarIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export type Platform = {
  name: string;
  icon: string;
  supports: PostType[];
};

// Mock data for today and tomorrow posts - replace with actual API call
const mockPostsData = {
  today: 3,
  tomorrow: 2,
};

export function CreateNewPost() {
  const [postsData, setPostsData] = useState(mockPostsData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch posts summary data
  useEffect(() => {
    const fetchPostsData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/api/posts/summary');
        if (response.ok) {
          const data = await response.json();
          setPostsData(data);
        } else {
          setError('Failed to load posts summary');
        }
      } catch (error) {
        console.error('Failed to fetch posts summary:', error);
        setError('Failed to load posts summary');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPostsData();
  }, []);

  const getSupportedPlatforms = (postType: PostType) => {
    return Object.values(socialMediaPlatforms).filter((platform) =>
      platform.supportsPostTypes.includes(postType)
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Posts Summary Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-3 sm:p-4 border border-blue-100 dark:border-blue-900/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold text-sm text-blue-900 dark:text-blue-100">
              Scheduled Posts
            </h3>
          </div>
          <Link href="/dashboard/create-new-post/text">
            <Button size="sm" className="h-7 px-3 text-xs">
              <PlusIcon className="h-3 w-3 mr-1" />
              New Post
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div className="bg-white dark:bg-gray-800 rounded-md p-2.5 sm:p-3 border border-blue-200 dark:border-blue-800">
            <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
              {isLoading ? "..." : postsData.today}
            </div>
            <div className="text-xs text-blue-700 dark:text-blue-300">Today</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-md p-2.5 sm:p-3 border border-blue-200 dark:border-blue-800">
            <div className="text-xl sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {isLoading ? "..." : postsData.tomorrow}
            </div>
            <div className="text-xs text-indigo-700 dark:text-indigo-300">Tomorrow</div>
          </div>
        </div>
        
        {error && (
          <div className="mt-3 text-xs text-red-600 dark:text-red-400">
            {error}
          </div>
        )}
      </div>

      {/* Content Type Cards */}
      <div className="space-y-2 sm:space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">
          Create New Content
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3">
          <Link href="/dashboard/create-new-post/text">
            <Card className="hover:bg-secondary/50 transition-all duration-200 cursor-pointer group border-0 shadow-sm hover:shadow-md">
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                  <div className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                    <TextIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold">Text Post</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-1">
                  {getSupportedPlatforms(PostType.TEXT).map((platform) => (
                    <div
                      key={platform.name}
                      className="p-1 sm:p-1.5 bg-gray-100 dark:bg-gray-800 rounded-md group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors"
                      title={platform.name}
                    >
                      <platform.Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-600 dark:text-gray-400" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/create-new-post/image">
            <Card className="hover:bg-secondary/50 transition-all duration-200 cursor-pointer group border-0 shadow-sm hover:shadow-md">
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                  <div className="p-1.5 sm:p-2 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                    <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold">Image Post</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-1">
                  {getSupportedPlatforms(PostType.IMAGE).map((platform) => (
                    <div
                      key={platform.name}
                      className="p-1 sm:p-1.5 bg-gray-100 dark:bg-gray-800 rounded-md group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors"
                      title={platform.name}
                    >
                      <platform.Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-600 dark:text-gray-400" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/create-new-post/video">
            <Card className="hover:bg-secondary/50 transition-all duration-200 cursor-pointer group border-0 shadow-sm hover:shadow-md">
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                  <div className="p-1.5 sm:p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                    <VideoIcon className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold">Video Post</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-1">
                  {getSupportedPlatforms(PostType.VIDEO).map((platform) => (
                    <div
                      key={platform.name}
                      className="p-1 sm:p-1.5 bg-gray-100 dark:bg-gray-800 rounded-md group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors"
                      title={platform.name}
                    >
                      <platform.Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-600 dark:text-gray-400" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
