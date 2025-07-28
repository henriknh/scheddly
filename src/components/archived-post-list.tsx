"use client";

import { PostWithRelations } from "@/app/api/post/types";
import { DataTable, DataTableColumnDef } from "@/components/ui/data-table";
import { PostType } from "@/generated/prisma";
import { socialMediaPlatforms } from "@/lib/social-media-platforms";
import { format } from "date-fns";
import { FileTextIcon, ImageIcon, VideoIcon } from "lucide-react";
import Link from "next/link";

function getPlatforms(post: PostWithRelations) {
  // Unique platforms from socialMediaPosts
  const platforms = Array.from(
    new Set(post.socialMediaPosts.map((smp) => smp.socialMedia))
  );
  return platforms;
}

export function ArchivedPostList({ posts }: { posts: PostWithRelations[] }) {
  const columns: DataTableColumnDef<PostWithRelations, unknown>[] = [
    {
      accessorKey: "brand",
      header: "Brand",
      cell: ({ row }) => {
        // Show first brand (assuming all socialMediaPosts have same brand)
        const brand = row.original.socialMediaPosts[0]?.brand;
        return (
          <Link
            href={`/dashboard/posts/${row.original.id}`}
            className="w-full text-left hover:underline focus:underline focus:outline-none block"
          >
            {brand ? <span>{brand.name}</span> : <span>-</span>}
          </Link>
        );
      },
    },
    {
      accessorKey: "platforms",
      header: "Platforms",
      cell: ({ row }) => {
        const platforms = getPlatforms(row.original);
        return (
          <Link
            href={`/dashboard/posts/${row.original.id}`}
            className="w-full text-left hover:underline focus:underline focus:outline-none block"
          >
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
          </Link>
        );
      },
    },
    {
      accessorKey: "archivedAt",
      header: "Archived Date",
      cell: ({ row }) => (
        <Link
          href={`/dashboard/posts/${row.original.id}`}
          className="w-full text-left hover:underline focus:underline focus:outline-none block"
        >
          {row.original.archivedAt ? (
            <span>
              {format(new Date(row.original.archivedAt), "yyyy-MM-dd")}
            </span>
          ) : (
            <span>-</span>
          )}
        </Link>
      ),
    },
  ];

  return <DataTable columns={columns} data={posts} isLoading={false} />;
}
