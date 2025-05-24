"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ImageIcon, TextIcon, VideoIcon } from "lucide-react";

export type Platform = {
  name: string;
  icon: string;
  supports: PostType[];
};

type PostType = "text" | "image" | "video";

export const platforms: Record<string, Platform> = {
  instagram: {
    name: "Instagram",
    icon: "/icons/instagram.svg",
    supports: ["image", "video"],
  },
  youtube: { name: "YouTube", icon: "/icons/youtube.svg", supports: ["video"] },
  tumblr: {
    name: "Tumblr",
    icon: "/icons/tumblr.svg",
    supports: ["text", "image"],
  },
  pinterest: {
    name: "Pinterest",
    icon: "/icons/pinterest.svg",
    supports: ["image"],
  },
  threads: {
    name: "Threads",
    icon: "/icons/threads.svg",
    supports: ["text", "image"],
  },
  tiktok: { name: "TikTok", icon: "/icons/tiktok.svg", supports: ["video"] },
};

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Create New Post</h1>
      <p className="text-muted-foreground">
        Choose the type of content you want to create and schedule.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/dashboard/create/text">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TextIcon className="h-5 w-5" />
                Text Post
              </CardTitle>
              <CardDescription>
                Create and schedule text-based posts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Object.values(platforms)
                  .filter((platform) => platform.supports.includes("text"))
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

        <Link href="/dashboard/create/image">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Image Post
              </CardTitle>
              <CardDescription>
                Share and schedule image content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Object.values(platforms)
                  .filter((platform) => platform.supports.includes("image"))
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

        <Link href="/dashboard/create/video">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <VideoIcon className="h-5 w-5" />
                Video Post
              </CardTitle>
              <CardDescription>
                Upload and schedule video content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Object.values(platforms)
                  .filter((platform) => platform.supports.includes("video"))
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
