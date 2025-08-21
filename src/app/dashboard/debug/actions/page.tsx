"use server";

import { Breadcrumb } from "@/components/common/breadcrumb";
import { PostPostsDebugButton } from "@/components/debug/post-posts-debug-button";
import { ArchivePostsDebugButton } from "@/components/debug/archive-posts-debug-button";
import { SyncSubscriptionDebugButton } from "@/components/debug/sync-subscription-debug-button";

export default async function DebugActionsPage() {
  if (!process.env.CRON_SECRET) {
    throw new Error("CRON_SECRET is not set");
  }

  return (
    <div className="flex flex-col gap-4">
      <Breadcrumb label="Debug" href="/dashboard/debug" />

      <div className="flex flex-col gap-4">
        <PostPostsDebugButton secret={process.env.CRON_SECRET} />
        <ArchivePostsDebugButton secret={process.env.CRON_SECRET} />
        <SyncSubscriptionDebugButton />
      </div>
    </div>
  );
}
