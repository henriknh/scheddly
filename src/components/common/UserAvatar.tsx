import {
  Avatar as ShadcnAvatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import { useMemo } from "react";

interface AvatarProps {
  src?: string | null;
  fallback?: string | null;
  isBig?: boolean;
}

export function Avatar({ src, fallback, isBig = false }: AvatarProps) {
  const url = useMemo(() => {
    if (!src) return null;
    if (src.startsWith("http")) return src;
    return `/api/file/${src}`;
  }, [src]);

  return (
    <ShadcnAvatar className={cn(isBig ? "h-16 w-16" : "h-4 w-4")}>
      <AvatarImage src={url!} alt="user avatar" />
      <AvatarFallback>
        {fallback ? (
          <span className="font-medium">
            {fallback.slice(0, 2).toUpperCase()}
          </span>
        ) : (
          <User className="h-4 w-4" />
        )}
      </AvatarFallback>
    </ShadcnAvatar>
  );
}
