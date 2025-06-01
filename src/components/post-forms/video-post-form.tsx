"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PostScheduler } from "@/components/post-scheduler";
import { Video, X } from "lucide-react";
import { SocialMediaIntegrationSelector } from "@/components/social-media-integration-selector";

interface VideoPostFormProps {
  onSubmit: (data: {
    description: string;
    video: File;
    scheduledDate?: Date;
    integrationIds: string[];
  }) => void;
  onCancel: () => void;
}

export function VideoPostForm({ onSubmit, onCancel }: VideoPostFormProps) {
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState<File | null>(null);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(
    undefined
  );
  const [selectedIntegrationIds, setSelectedIntegrationIds] = useState<
    string[]
  >([]);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideo(e.target.files[0]);
    }
  };

  const removeVideo = () => {
    setVideo(null);
  };

  const handleSubmit = () => {
    if (!video) return;
    onSubmit({
      description,
      video,
      scheduledDate,
      integrationIds: selectedIntegrationIds,
    });
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
            postType="VIDEO"
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
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!video || selectedIntegrationIds.length === 0}
        >
          {scheduledDate ? "Schedule Post" : "Post Now"}
        </Button>
      </div>
    </div>
  );
}
