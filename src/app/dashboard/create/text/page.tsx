"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PostScheduler } from "@/components/post-scheduler";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { platforms, type Platform } from "../../page";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { SocialMedia } from "@/generated/prisma";

export default function TextPostPage() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(
    undefined
  );
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [connectedPlatforms, setConnectedPlatforms] = useState<SocialMedia[]>(
    []
  );

  useEffect(() => {
    // Fetch connected platforms
    const fetchConnectedPlatforms = async () => {
      try {
        const response = await fetch("/api/social-media/connected");
        if (response.ok) {
          const data = await response.json();
          setConnectedPlatforms(data.platforms);
        }
      } catch (error) {
        console.error("Failed to fetch connected platforms:", error);
      }
    };

    fetchConnectedPlatforms();
  }, []);

  const textPlatforms = Object.entries(platforms).filter(([, platform]) =>
    (platform as Platform).supports.includes("text")
  );

  const handleSubmit = async () => {
    try {
      // TODO: Implement post creation
      console.log({
        content,
        scheduledDate,
        platforms: selectedPlatforms,
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Text Post</CardTitle>
        <CardDescription>
          Write your text content and choose where to share it
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Write your post content here..."
          className="min-h-[200px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="space-y-2">
          <Label>Select Platforms</Label>
          <div className="flex flex-wrap gap-4">
            {textPlatforms.map(([id, platform]) => {
              const isConnected = connectedPlatforms.includes(
                id as SocialMedia
              );

              return (
                <div key={id} className="flex items-center space-x-2">
                  <Checkbox
                    id={id}
                    checked={selectedPlatforms.includes(id)}
                    disabled={!isConnected}
                    onCheckedChange={(checked: boolean) => {
                      setSelectedPlatforms(
                        checked
                          ? [...selectedPlatforms, id]
                          : selectedPlatforms.filter((p) => p !== id)
                      );
                    }}
                  />
                  <Label
                    htmlFor={id}
                    className={`flex items-center gap-2 ${
                      !isConnected ? "text-muted-foreground" : ""
                    }`}
                  >
                    <Image
                      src={(platform as Platform).icon}
                      alt={(platform as Platform).name}
                      width={16}
                      height={16}
                      className="h-4 w-4"
                    />
                    {(platform as Platform).name}
                    {!isConnected && (
                      <span className="text-xs text-muted-foreground">
                        (Not connected)
                      </span>
                    )}
                  </Label>
                </div>
              );
            })}
          </div>
        </div>

        <PostScheduler onScheduleChange={setScheduledDate} />
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!content || selectedPlatforms.length === 0}
        >
          {scheduledDate ? "Schedule Post" : "Post Now"}
        </Button>
      </CardFooter>
    </Card>
  );
}
