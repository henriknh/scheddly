import { PostWithRelations } from "@/app/api/post/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar, Video } from "lucide-react";
import Image from "next/image";
import { BrandsWithIntegrationsAndTheirStatus } from "./brands-with-integrations-and-their.status";
import { ConfirmDeletePostModal } from "../confirm-delete-post-modal";

interface VideoPostDetailsProps {
  post: PostWithRelations;
}

export function VideoPostDetails({ post }: VideoPostDetailsProps) {
  return (
    <div className="space-y-4">
      {/* Content Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Video Post
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <div className="aspect-[9/16] rounded-lg border-2 border-border overflow-hidden max-h-[400px]">
              {post.video && (
                <video
                  src={`/api/file/${post.video.id}`}
                  className="w-full h-full object-cover bg-black"
                  controls
                  playsInline
                />
              )}
            </div>
            {post.videoCover && (
              <div className="aspect-[9/16] rounded-lg border-2 border-border overflow-hidden max-h-[400px]">
                <Image
                  src={`/api/file/${post.videoCover.id}`}
                  alt="Video cover"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
          </div>

          {post.description && (
            <div className="whitespace-pre-wrap">{post.description}</div>
          )}

          {post.scheduledAt && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Scheduled for {format(new Date(post.scheduledAt), "PPP p")}
            </div>
          )}
        </CardContent>
      </Card>

      <BrandsWithIntegrationsAndTheirStatus post={post} />

      {post && <ConfirmDeletePostModal postId={post.id} />}
    </div>
  );
}
