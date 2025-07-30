import { PostPostsDebugButton } from "@/components/debug/post-posts-debug-button";
import { ArchivePostsDebugButton } from "@/components/debug/archive-posts-debug-button";

if (!process.env.CRON_SECRET) {
  throw new Error("CRON_SECRET is not set");
}

export default function DebugPage() {
  return (
    <div className="flex flex-col gap-4">
      <PostPostsDebugButton secret={process.env.CRON_SECRET} />
      <ArchivePostsDebugButton secret={process.env.CRON_SECRET} />
    </div>
  );
}
