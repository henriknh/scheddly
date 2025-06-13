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
  isBig?: boolean;
}

export function UserAvatar({ src, isBig = false }: UserAvatarProps) {
  const url = useMemo(() => {
    if (!src) return null;
    if (src.startsWith("data:image")) return src;
    if (src.startsWith("http")) return src;
    return `/api/file/${src}`;
  }, [src]);

  return (
    <ShadcnAvatar className={cn(isBig ? "h-16 w-16" : "h-4 w-4")}>
      <AvatarImage src={url!} alt="user avatar" />
      <AvatarFallback>
        <User className={cn(isBig ? "h-8 w-8" : "h-4 w-4")} />
      </AvatarFallback>
    </ShadcnAvatar>
  );
}
