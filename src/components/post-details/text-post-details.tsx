import { PostWithRelations } from "@/app/api/post/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar, MessageSquare } from "lucide-react";
import { BrandsWithIntegrationsAndTheirStatus } from "./brands-with-integrations-and-their.status";
import { ConfirmDeletePostModal } from "../confirm-delete-post-modal";

interface TextPostDetailsProps {
  post: PostWithRelations;
}

export function TextPostDetails({ post }: TextPostDetailsProps) {
  return (
    <div className="space-y-4">
      {/* Content Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Text Post
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="whitespace-pre-wrap">{post.description}</div>

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
