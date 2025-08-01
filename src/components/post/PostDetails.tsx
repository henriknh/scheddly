"use client";

import { PostWithRelations } from "@/app/api/post/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SocialMediaPost } from "@/generated/prisma";
import { format } from "date-fns";
import { FileText, ImageIcon, Video } from "lucide-react";

interface PostDetailsProps {
  post: PostWithRelations;
}

export function PostDetails({ post }: PostDetailsProps) {
  const getStatusBadge = (socialMediaPost: SocialMediaPost) => {
    if (socialMediaPost.failedAt) {
      return <Badge variant="destructive">Error</Badge>;
    }
    if (socialMediaPost.postedAt) {
      return <Badge variant="success">Posted</Badge>;
    }
    if (post.scheduledAt) {
      const scheduledDate = new Date(post.scheduledAt);
      if (scheduledDate > new Date()) {
        return <Badge variant="secondary">Scheduled</Badge>;
      }
    }
    return <Badge variant="secondary">Pending</Badge>;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2">
            {post.postType === "IMAGE" && <ImageIcon className="h-4 w-4" />}
            {post.postType === "VIDEO" && <Video className="h-4 w-4" />}
            {post.postType === "TEXT" && <FileText className="h-4 w-4" />}
            <span className="capitalize text-sm font-medium">
              {post.postType.toLowerCase()}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">{post.description}</p>

          {post.postType === "IMAGE" && post.images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {post.images.map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={`/api/file/${image.id}`}
                    alt={`Post image ${index + 1}`}
                    className="object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}

          {post.postType === "VIDEO" && post.video && (
            <div className="relative aspect-video">
              <video
                src={`/api/file/${post.video.id}`}
                controls
                className="w-full h-full rounded-lg"
              />
            </div>
          )}

          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
            <div>
              <span className="font-medium">Scheduled: </span>
              {post.scheduledAt
                ? format(new Date(post.scheduledAt), "MMM d, yyyy")
                : "Not scheduled"}
            </div>
            <div>
              <span className="font-medium">Created: </span>
              {format(new Date(post.createdAt), "MMM d, yyyy")}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Social Media Posts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {post.socialMediaPosts.map((socialMediaPost) => (
                <Card key={socialMediaPost.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {socialMediaPost.socialMediaIntegration.brand?.name ||
                            "No Brand"}
                        </span>
                      </div>
                      {getStatusBadge(socialMediaPost)}
                    </div>
                    {socialMediaPost.failedReason && (
                      <p className="text-sm text-destructive mt-2">
                        {socialMediaPost.failedReason}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
