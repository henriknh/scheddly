"use client";

import { PostWithRelations } from "@/app/api/post/types";
import { DataTable, DataTableColumnDef } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { socialMediaPlatforms } from "@/lib/social-media-platforms";
import { unarchivePost } from "@/app/api/post/unarchive-post";
import { toast } from "sonner";
import { ArchiveXIcon } from "lucide-react";

function getPlatforms(post: PostWithRelations) {
  // Unique platforms from socialMediaPosts
  const platforms = Array.from(
    new Set(post.socialMediaPosts.map((smp) => smp.socialMedia))
  );
  return platforms;
}

function isUnarchiveEnabled(archivedAt?: Date | string | null) {
  if (!archivedAt) return false;
  const archivedDate = new Date(archivedAt);
  const now = new Date();
  const diff = (now.getTime() - archivedDate.getTime()) / (1000 * 60 * 60 * 24);
  return diff <= 30;
}

export function ArchivedPostList({ posts }: { posts: PostWithRelations[] }) {
  const router = useRouter();

  const [loadingId, setLoadingId] = useState<string | null>(null);

  const columns: DataTableColumnDef<PostWithRelations, unknown>[] = [
    {
      accessorKey: "brand",
      header: "Brand",
      cell: ({ row }) => {
        // Show first brand (assuming all socialMediaPosts have same brand)
        const brand = row.original.socialMediaPosts[0]?.brand;
        return brand ? <span>{brand.name}</span> : <span>-</span>;
      },
    },
    {
      accessorKey: "platforms",
      header: "Platforms",
      cell: ({ row }) => {
        const platforms = getPlatforms(row.original);
        return (
          <div className="flex gap-2">
            {platforms.map((platform) => {
              const platformObj = socialMediaPlatforms.find(
                (p) => p.id === platform
              );
              return (
                <span
                  key={platform}
                  title={platformObj ? platformObj.name : platform}
                  className="flex items-center justify-center"
                >
                  {platformObj ? (
                    <platformObj.Icon className="w-5 h-5" />
                  ) : (
                    <span>{platform}</span>
                  )}
                </span>
              );
            })}
          </div>
        );
      },
    },
    {
      accessorKey: "archivedAt",
      header: "Archived Date",
      cell: ({ row }) =>
        row.original.archivedAt ? (
          <span>{format(new Date(row.original.archivedAt), "yyyy-MM-dd")}</span>
        ) : (
          <span>-</span>
        ),
    },
    {
      id: "unarchive",
      header: "Unarchive",
      align: "end",
      cell: ({ row }) => {
        const enabled = isUnarchiveEnabled(row.original.archivedAt);
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!enabled || loadingId === row.original.id}
                  onClick={async () => {
                    if (!enabled) return;
                    await unarchivePost(row.original.id);
                    toast.success("Post unarchived successfully");
                    router.push(`/dashboard/posts/${row.original.id}`);
                    setLoadingId(null);
                  }}
                >
                  <ArchiveXIcon className="w-4 h-4" />
                  Unarchive
                </Button>
              </span>
            </TooltipTrigger>
            {!enabled && (
              <TooltipContent>Cannot unarchive after 30 days</TooltipContent>
            )}
          </Tooltip>
        );
      },
    },
  ];

  return <DataTable columns={columns} data={posts} isLoading={false} />;
}
