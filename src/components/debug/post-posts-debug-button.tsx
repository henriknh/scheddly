"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";

interface PostPostsDebugButtonProps {
  secret: string;
}

export function PostPostsDebugButton({ secret }: PostPostsDebugButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    const response = await fetch(`/api/cron/post-posts?secret=${secret}`);
    setIsLoading(false);
    if (!response.ok) {
      toast.error("Failed to post posts");
    } else {
      const data = await response.json();
      toast.success(data.message);
    }
  };

  return (
    <Button onClick={handleClick} disabled={isLoading}>
      Post posts
    </Button>
  );
}
