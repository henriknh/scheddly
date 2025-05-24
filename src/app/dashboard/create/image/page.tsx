"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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
import { Plus, X } from "lucide-react";
import { SocialMedia } from "../../../../generated/prisma";

export default function ImagePostPage() {
  const router = useRouter();
  const [caption, setCaption] = useState("");
  const [images, setImages] = useState<File[]>([]);
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

  const imagePlatforms = Object.entries(platforms).filter(([, platform]) =>
    (platform as Platform).supports.includes("image")
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      // TODO: Implement post creation
      console.log({
        caption,
        images,
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
        <CardTitle>Create Image Post</CardTitle>
        <CardDescription>
          Upload images and add a caption to share across platforms
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg border-2 border-border"
            >
              <Image
                src={URL.createObjectURL(image)}
                alt={`Upload ${index + 1}`}
                fill
                className="object-cover rounded-lg"
                unoptimized
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <label className="flex items-center justify-center aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary cursor-pointer">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Plus className="h-8 w-8" />
              <span className="text-sm">Add Image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                multiple
              />
            </div>
          </label>
        </div>

        <Textarea
          placeholder="Write a caption for your images..."
          value={caption}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setCaption(e.target.value)
          }
        />

        <div className="space-y-2">
          <Label>Select Platforms</Label>
          <div className="flex flex-wrap gap-4">
            {imagePlatforms.map(([id, platform]) => {
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
          disabled={images.length === 0 || selectedPlatforms.length === 0}
        >
          {scheduledDate ? "Schedule Post" : "Post Now"}
        </Button>
      </CardFooter>
    </Card>
  );
}
