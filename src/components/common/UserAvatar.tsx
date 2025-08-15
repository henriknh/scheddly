import {
  Avatar as ShadcnAvatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import { useMemo } from "react";

interface UserAvatarProps {
  src?: string | null;
  size?: "sm" | "md" | "lg";
}

export function UserAvatar({ src, size = "sm" }: UserAvatarProps) {
  const url = useMemo(() => {
    if (!src) return null;
    if (src.startsWith("data:image")) return src;
    if (src.startsWith("http")) return src;
    return `/api/file/${src}`;
  }, [src]);

  return (
    <ShadcnAvatar
      className={cn(
        size === "sm" ? "h-4 w-4" : size === "md" ? "h-8 w-8" : "h-16 w-16"
      )}
    >
      <AvatarImage src={url!} alt="user avatar" />
      <AvatarFallback>
        <User
          className={cn(
            size === "sm" ? "h-4 w-4" : size === "md" ? "h-8 w-8" : "h-16 w-16"
          )}
        />
      </AvatarFallback>
    </ShadcnAvatar>
  );
}
