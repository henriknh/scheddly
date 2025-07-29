"use client";

import { PostWithRelations } from "@/app/api/post/types";
import { cn } from "@/lib/utils";
import { format, isPast, isToday } from "date-fns";
import { ImageIcon, PlusIcon, TextIcon } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { PostCell } from "./PostCell";

interface WeekdayCellProps {
  date: Date;
  posts: PostWithRelations[];
  onDateClick?: (date: Date) => void;
  screenSize: "mobile" | "tablet" | "desktop";
}

export function WeekdayCell({
  date,
  posts,
  onDateClick,
  screenSize,
}: WeekdayCellProps) {
  const isCurrentDay = isToday(date);
  const isPastDate = isPast(date) && !isToday(date);

  const handleCellClick = () => {
    onDateClick?.(date);
  };

  return (
    <div
      className={cn(
        "min-h-36 flex flex-col cursor-pointer transition-colors p-2 bg-card rounded-md",
        isCurrentDay && "bg-accent text-accent-foreground",
        (date.getDay() === 6 || date.getDay() === 0) && "bg-destructive/5"
      )}
      onClick={handleCellClick}
    >
      {/* Date header */}
      <div className="flex justify-between items-start w-full">
        <div
          className={cn(
            "text-xs text-muted-foreground font-medium",
            isPastDate && "opacity-50"
          )}
        >
          {screenSize === "desktop"
            ? format(date, "d MMM")
            : format(date, "EEE, d MMM")}
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
