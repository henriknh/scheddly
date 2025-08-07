"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ImageIcon, PlusIcon, TextIcon, VideoIcon } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface PlusButtonProps {
  targetDate: Date;
}

export function PlusButton({ targetDate }: PlusButtonProps) {
  const formattedDate = format(targetDate, "yyyy-MM-dd");
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <PlusIcon className="h-4 w-4" />
          <span className="sr-only">Create post for {format(targetDate, "MMM d")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/create-new-post/text?date=${formattedDate}`}>
            <TextIcon className="mr-2 h-4 w-4" />
            Text Post
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/create-new-post/image?date=${formattedDate}`}>
            <ImageIcon className="mr-2 h-4 w-4" />
            Image Post
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/create-new-post/video?date=${formattedDate}`}>
            <VideoIcon className="mr-2 h-4 w-4" />
            Video Post
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}