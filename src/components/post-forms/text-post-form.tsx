"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PostScheduler } from "@/components/post-scheduler";
import { SocialMediaIntegrationSelector } from "@/components/social-media-integration-selector";
import {
  Brand,
  PostType,
  SocialMediaIntegration,
  SocialMediaIntegrationAccountInfo,
} from "@/generated/prisma";
import { createPost } from "@/app/api/post/create-post";

interface TextPostFormProps {
  integrations: (SocialMediaIntegration & {
    brand?: Brand | null;
    socialMediaIntegrationAccountInfo?: SocialMediaIntegrationAccountInfo | null;
  })[];
}

export function TextPostForm({ integrations }: TextPostFormProps) {
  const [content, setContent] = useState("");
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(
    undefined
  );
  const [selectedIntegrationIds, setSelectedIntegrationIds] = useState<
    string[]
  >([]);

  const handleSubmit = async () => {
    try {
      const selectedIntegrations = integrations.filter((integration) =>
        selectedIntegrationIds.includes(integration.id)
      );

      await createPost({
        description: content,
        postType: PostType.TEXT,
        scheduledAt: scheduledDate,
        socialMediaIntegrations: selectedIntegrations,
      });
    } catch (error) {
      console.error("Failed to create post:", error);
    }
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

        <Textarea
          placeholder="Write your post content here..."
          className="min-h-[200px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
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
            postType="TEXT"
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
          disabled={!content || selectedIntegrationIds.length === 0}
        >
          {scheduledDate ? "Schedule Post" : "Post Now"}
        </Button>
      </div>
    </div>
  );
}
