"use server";

import { ArchivePostsDebugButton } from "@/components/debug/archive-posts-debug-button";
import { PostPostsDebugButton } from "@/components/debug/post-posts-debug-button";
import { SyncSubscriptionDebugButton } from "@/components/debug/sync-subscription-debug-button";

export default async function DebugActionsPage() {
  if (!process.env.CRON_SECRET) {
    throw new Error("CRON_SECRET is not set");
  }

  return (
    <div className="flex flex-col gap-4">
      <PostPostsDebugButton secret={process.env.CRON_SECRET} />
      <ArchivePostsDebugButton secret={process.env.CRON_SECRET} />
      <SyncSubscriptionDebugButton />
    </div>
  );
}
