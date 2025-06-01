"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PostScheduler } from "@/components/post-scheduler";
import { Plus, X } from "lucide-react";
import { SocialMediaIntegrationSelector } from "@/components/social-media-integration-selector";
import {
  Brand,
  SocialMediaIntegration,
  SocialMediaIntegrationAccountInfo,
} from "@/generated/prisma";

interface ImagePostFormProps {
  integrations: (SocialMediaIntegration & {
    brand?: Brand | null;
    socialMediaIntegrationAccountInfo?: SocialMediaIntegrationAccountInfo | null;
  })[];
}

export function ImagePostForm({ integrations }: ImagePostFormProps) {
  const [caption, setCaption] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(
    undefined
  );
  const [selectedIntegrationIds, setSelectedIntegrationIds] = useState<
    string[]
  >([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    // TODO: Implement function call
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            1
          </div>
          <span className="font-medium">Post</span>
        </div>

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
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            2
          </div>
          <span className="font-medium">Social Media Platforms</span>
        </div>

        <div className="space-y-2">
          <SocialMediaIntegrationSelector
            onSelectionChange={setSelectedIntegrationIds}
            selectedIntegrationIds={selectedIntegrationIds}
            postType="IMAGE"
            integrations={integrations}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            3
          </div>
          <span className="font-medium">Scheduling</span>
        </div>

        <PostScheduler onScheduleChange={setScheduledDate} />
      </div>

      <div className="flex justify-end gap-2">
        <Button
          onClick={handleSubmit}
          disabled={images.length === 0 || selectedIntegrationIds.length === 0}
        >
          {scheduledDate ? "Schedule Post" : "Post Now"}
        </Button>
      </div>
    </div>
  );
}
