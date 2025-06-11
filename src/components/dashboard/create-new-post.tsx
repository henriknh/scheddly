"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PostType } from "@/generated/prisma";
import { socialMediaPlatforms } from "@/lib/social-media-platforms";
import { ImageIcon, TextIcon, VideoIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export type Platform = {
  name: string;
  icon: string;
  supports: PostType[];
};

export function CreateNewPost() {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        Choose the type of content you want to create and schedule.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/dashboard/create-new-post/text">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TextIcon className="h-8 w-8" />
                Text Post
              </CardTitle>
              <CardDescription>
                Create and schedule text-based posts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Object.values(socialMediaPlatforms)
                  .filter((platform) =>
                    platform.supportsPostTypes.includes(PostType.TEXT)
                  )
                  .map((platform) => (
                    <div
                      key={platform.name}
                      className="flex items-center gap-1 text-sm text-muted-foreground"
                    >
                      <Image
                        src={platform.icon}
                        alt={platform.name}
                        className="h-4 w-4"
                        width={16}
                        height={16}
                      />
                      {platform.name}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/create-new-post/image">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-8 w-8" />
                Image Post
              </CardTitle>
              <CardDescription>
                Share and schedule image content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Object.values(socialMediaPlatforms)
                  .filter((platform) =>
                    platform.supportsPostTypes.includes(PostType.IMAGE)
                  )
                  .map((platform) => (
                    <div
                      key={platform.name}
                      className="flex items-center gap-1 text-sm text-muted-foreground"
                    >
                      <Image
                        src={platform.icon}
                        alt={platform.name}
                        width={16}
                        height={16}
                        className="h-4 w-4"
                      />
                      {platform.name}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/create-new-post/video">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <VideoIcon className="h-8 w-8" />
                Video Post
              </CardTitle>
              <CardDescription>
                Upload and schedule video content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Object.values(socialMediaPlatforms)
                  .filter((platform) =>
                    platform.supportsPostTypes.includes(PostType.VIDEO)
                  )
                  .map((platform) => (
                    <div
                      key={platform.name}
                      className="flex items-center gap-1 text-sm text-muted-foreground"
                    >
                      <Image
                        src={platform.icon}
                        alt={platform.name}
                        width={16}
                        height={16}
                        className="h-4 w-4"
                      />
                      {platform.name}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
