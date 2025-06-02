import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

interface UserAvatarProps {
  src?: string | null;
  fallback?: string;
  isBig?: boolean;
}

export function UserAvatar({ src, fallback, isBig = false }: UserAvatarProps) {
  return (
    <Avatar className={cn(isBig ? "h-16 w-16" : "h-4 w-4")}>
      <AvatarImage
        src={src ? `/api/file/${src}` : undefined}
        alt="user avatar"
      />
      <AvatarFallback>
        {fallback ? (
          <span className="font-medium">
            {fallback.slice(0, 2).toUpperCase()}
          </span>
        ) : (
          <User className="h-4 w-4" />
        )}
      </AvatarFallback>
    </Avatar>
  );
}
