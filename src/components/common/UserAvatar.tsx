import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface UserAvatarProps {
  src?: string;
  fallback?: string;
  className?: string;
}

export function UserAvatar({ src, fallback, className }: UserAvatarProps) {
  return (
    <Avatar className={className}>
      <AvatarImage src={src} alt="user avatar" />
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
