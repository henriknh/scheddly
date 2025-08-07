"use client";

import { Button } from "@/components/ui/button";
import { ImageIcon, TextIcon, VideoIcon } from "lucide-react";
import Link from "next/link";
import { socialMediaPlatforms } from "@/lib/social-media-platforms";
import { PostType } from "@/generated/prisma";

export function CreateNewPost() {
  // Get platforms that support each post type
  const textPlatforms = socialMediaPlatforms.filter(platform => 
    platform.supportsPostTypes.includes(PostType.TEXT)
  );
  
  const imagePlatforms = socialMediaPlatforms.filter(platform => 
    platform.supportsPostTypes.includes(PostType.IMAGE)
  );
  
  const videoPlatforms = socialMediaPlatforms.filter(platform => 
    platform.supportsPostTypes.includes(PostType.VIDEO)
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Create Content Buttons - extended to full width with equal padding */}
      <div className="w-full max-w-[100vw] overflow-x-auto pb-2 md:pb-0 scrollbar-hide -mx-8 px-8">
        <div className="flex gap-4 md:gap-6 min-w-max">
          <Link href="/dashboard/create-new-post/text" className="flex-shrink-0">
            <Button variant="default" size="lg" className="flex flex-col items-start gap-1 h-auto py-2 px-6 min-w-[140px]">
              <div className="flex items-center gap-2">
                <TextIcon className="h-5 w-5" />
                <span>Text Post</span>
              </div>
              <div className="flex gap-1 mt-1 justify-start">
                {textPlatforms.slice(0, 4).map((platform) => (
                  <platform.Icon key={platform.id} className="h-4 w-4 opacity-70 hover:opacity-100 transition-opacity" />
                ))}
              </div>
            </Button>
          </Link>
          <Link href="/dashboard/create-new-post/image" className="flex-shrink-0">
            <Button variant="default" size="lg" className="flex flex-col items-start gap-1 h-auto py-2 px-6 min-w-[140px]">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                <span>Image Post</span>
              </div>
              <div className="flex gap-1 mt-1 justify-start">
                {imagePlatforms.slice(0, 4).map((platform) => (
                  <platform.Icon key={platform.id} className="h-4 w-4 opacity-70 hover:opacity-100 transition-opacity" />
                ))}
              </div>
            </Button>
          </Link>
          <Link href="/dashboard/create-new-post/video" className="flex-shrink-0">
            <Button variant="default" size="lg" className="flex flex-col items-start gap-1 h-auto py-2 px-6 min-w-[140px]">
              <div className="flex items-center gap-2">
                <VideoIcon className="h-5 w-5" />
                <span>Video Post</span>
              </div>
              <div className="flex gap-1 mt-1 justify-start">
                {videoPlatforms.slice(0, 4).map((platform) => (
                  <platform.Icon key={platform.id} className="h-4 w-4 opacity-70 hover:opacity-100 transition-opacity" />
                ))}
              </div>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
