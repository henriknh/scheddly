import { PostWithRelations } from "@/app/api/post/types";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { ArchivePostButton } from "../archive-post-button";
import { BrandsWithIntegrationsAndTheirStatuses } from "./brands-with-integrations-and-their-statuses";
import { SocialMediaIntegrationWithRelations } from "@/app/api/social-media-integration/types";

interface VideoPostDetailsProps {
  post: PostWithRelations;
  integrations: SocialMediaIntegrationWithRelations[];
}

export function VideoPostDetails({
  post,
  integrations,
}: VideoPostDetailsProps) {
  return (
    <div className="space-y-4">
      {/* Content Section */}
      <Card>
        <CardContent className="space-y-4 p-8">
          {post.video && (
            <video
              src={`/api/file/${post.video.id}`}
              className="relative rounded-lg border-2 border-border overflow-hidden max-h-[400px] object-cover"
              controls
              playsInline
            />
          )}

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

      <BrandsWithIntegrationsAndTheirStatuses
        post={post}
        integrations={integrations}
      />

      {post && <ArchivePostButton post={post} />}
    </div>
  );
}
