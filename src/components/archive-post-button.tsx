"use client";

import { archivePost } from "@/app/api/post/archive-post";
import { PostWithRelations } from "@/app/api/post/types";
import { unarchivePost } from "@/app/api/post/unarchive-post";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { canUnarchivePost } from "@/lib/post";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ArchivePostButtonProps {
  post: PostWithRelations;
}

export function ArchivePostButton({ post }: ArchivePostButtonProps) {
  const router = useRouter();

  const handleUnarchivePost = async () => {
    try {
      await unarchivePost(post.id);
      toast.success("Post unarchived successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to unarchive post");
      console.error("Failed to unarchive post:", error);
    }
  };

  const handleArchivePost = async () => {
    try {
      await archivePost(post.id);
      toast.success("Post archived successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to archive post");
      console.error("Failed to delete post:", error);
    }
  };

  return post.archived ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          onClick={handleUnarchivePost}
          disabled={!canUnarchivePost(post)}
        >
          Unarchive post
        </Button>
      </TooltipTrigger>
      {!canUnarchivePost(post) && (
        <TooltipContent>Cannot unarchive after 30 days</TooltipContent>
      )}
    </Tooltip>
  ) : (
    <Button variant="destructive" onClick={handleArchivePost}>
      Archive post
    </Button>
  );
}
