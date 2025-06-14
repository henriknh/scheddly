import { PostWithRelations } from "@/app/api/post/types";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { ConfirmDeletePostModal } from "../confirm-delete-post-modal";
import { BrandsWithIntegrationsAndTheirStatuses } from "./brands-with-integrations-and-their-statuses";

interface TextPostDetailsProps {
  post: PostWithRelations;
}

export function TextPostDetails({ post }: TextPostDetailsProps) {
  return (
    <div className="space-y-4">
      {/* Content Section */}
      <Card>
        <CardContent className="space-y-4 p-8">
          <div className="whitespace-pre-wrap">{post.description}</div>

          {post.scheduledAt && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Scheduled for {format(new Date(post.scheduledAt), "PPP p")}
            </div>
          )}
        </CardContent>
      </Card>

      <BrandsWithIntegrationsAndTheirStatuses post={post} />

      {post && <ConfirmDeletePostModal postId={post.id} />}
    </div>
  );
}
