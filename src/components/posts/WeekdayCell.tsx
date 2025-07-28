"use client";

import { PostWithRelations } from "@/app/api/post/types";
import { cn } from "@/lib/utils";
import { format, isToday, isPast } from "date-fns";
import { PostCell } from "./PostCell";
import Link from "next/link";
import { ImageIcon, PlusIcon, TextIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface WeekdayCellProps {
  date: Date;
  posts: PostWithRelations[];
  onDateClick?: (date: Date) => void;
}

export function WeekdayCell({ date, posts, onDateClick }: WeekdayCellProps) {
  const isCurrentDay = isToday(date);
  const isPastDate = isPast(date) && !isToday(date);

  const handleCellClick = () => {
    onDateClick?.(date);
  };

  return (
    <div
      className={cn(
        "min-h-36 flex flex-col cursor-pointer transition-colors p-2 bg-card/50 rounded-md",
        isCurrentDay && "bg-accent text-accent-foreground"
      )}
      onClick={handleCellClick}
    >
      {/* Date header */}
      <div className="flex justify-between items-start w-full">
        <div
          className={cn(
            "flex items-end justify-end gap-1",
            isPastDate && "text-muted-foreground opacity-50"
          )}
        >
          <span className="text-sm font-medium">{format(date, "d")}</span>
          <span className="text-xs text-muted-foreground pb-[2px]">
            {format(date, "MMM")}
          </span>
        </div>
        {!isPastDate && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <PlusIcon className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link
                  href={`/dashboard/create-new-post/text?date=${format(
                    date,
                    "yyyy-MM-dd"
                  )}`}
                >
                  <TextIcon className="w-4 h-4" />
                  Text post
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/dashboard/create-new-post/image?date=${format(
                    date,
                    "yyyy-MM-dd"
                  )}`}
                >
                  <ImageIcon className="w-4 h-4" />
                  Image post
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/dashboard/create-new-post/video?date=${format(
                    date,
                    "yyyy-MM-dd"
                  )}`}
                >
                  <ImageIcon className="w-4 h-4" />
                  Video post
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Posts list */}
      <div className="flex-1 flex flex-col gap-1 mt-1 overflow-hidden">
        {posts.map((post) => (
          <PostCell key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
