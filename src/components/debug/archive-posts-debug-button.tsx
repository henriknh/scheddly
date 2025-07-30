"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";

interface ArchivePostsDebugButtonProps {
  secret: string;
}

export function ArchivePostsDebugButton({
  secret,
}: ArchivePostsDebugButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    const response = await fetch(
      `/api/cron/archive-old-posts?secret=${secret}`
    );
    setIsLoading(false);
    if (!response.ok) {
      toast.error("Failed to archive posts");
    } else {
      const data = await response.json();
      toast.success(data.message);
    }
  };

  return (
    <Button onClick={handleClick} disabled={isLoading}>
      Archive posts
    </Button>
  );
}
