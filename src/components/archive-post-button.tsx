"use client";

import { archivePost } from "@/app/api/post/archive-post";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ArchivePostButtonProps {
  postId: string;
}

export function ArchivePostButton({ postId }: ArchivePostButtonProps) {
  const router = useRouter();

  const handleArchivePost = async () => {
    try {
      await archivePost(postId);
      toast.success("Post archived successfully");
      router.push("/dashboard/posts");
    } catch (error) {
      toast.error("Failed to archive post");
      console.error("Failed to delete post:", error);
    }
  };

  return (
    <Button variant="destructive" onClick={handleArchivePost}>
      Archive post
    </Button>
  );
}
