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
import {
  platforms,
  type Platform,
} from "@/components/dashboard/create-new-post";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Video, X } from "lucide-react";
import { SocialMedia } from "@/generated/prisma";
import Image from "next/image";

export default function VideoPostPage() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState<File | null>(null);
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

  const videoPlatforms = Object.entries(platforms).filter(([, platform]) =>
    (platform as Platform).supports.includes("video")
  );

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideo(e.target.files[0]);
    }
  };

  const removeVideo = () => {
    setVideo(null);
  };

  const handleSubmit = async () => {
    try {
      // TODO: Implement post creation
      console.log({
        description,
        video,
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
        <CardTitle>Create Video Post</CardTitle>
        <CardDescription>
          Upload a video and add a description to share across platforms
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-[9/16] rounded-lg border-2 border-border overflow-hidden max-h-[400px]">
          {video ? (
            <div className="relative w-full h-full">
              <video
                src={URL.createObjectURL(video)}
                className="w-full h-full object-contain bg-black"
                controls
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={removeVideo}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Video className="h-8 w-8" />
                <span className="text-sm">Upload Video</span>
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleVideoUpload}
                />
              </div>
            </label>
          )}
        </div>

        <Textarea
          placeholder="Write a description for your video..."
          value={description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setDescription(e.target.value)
          }
        />

        <div className="space-y-2">
          <Label>Select Platforms</Label>
          <div className="flex flex-wrap gap-4">
            {videoPlatforms.map(([id, platform]) => {
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
          disabled={!video || selectedPlatforms.length === 0}
        >
          {scheduledDate ? "Schedule Post" : "Post Now"}
        </Button>
      </CardFooter>
    </Card>
  );
}
