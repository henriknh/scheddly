import { PostWithRelations } from "@/app/api/post/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { BrandsWithIntegrationsAndTheirStatus } from "./brands-with-integrations-and-their.status";
import { ConfirmDeletePostModal } from "../confirm-delete-post-modal";

interface ImagePostDetailsProps {
  post: PostWithRelations;
}

export function ImagePostDetails({ post }: ImagePostDetailsProps) {
  return (
    <div className="space-y-4">
      {/* Content Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Image Post
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {post.images.map((image, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg border-2 border-border overflow-hidden"
              >
                <Image
                  src={`/api/file/${image.id}`}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ))}
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
