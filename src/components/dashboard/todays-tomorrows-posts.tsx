"use client";

import { PostWithRelations } from "@/app/api/post/types";
import { format } from "date-fns";
import { DashboardPostCard } from "./dashboard-post-card";

interface TodaysTomorrowsPostsProps {
  todaysPosts: PostWithRelations[];
  tomorrowsPosts: PostWithRelations[];
}

export function TodaysTomorrowsPosts({ 
  todaysPosts, 
  tomorrowsPosts 
}: TodaysTomorrowsPostsProps) {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
      {/* Today's Posts */}
      <div className="flex-1 space-y-4">
        <h2 className="text-xl font-semibold">
          Today, {format(today, "MMM d, yyyy")}
        </h2>
        {todaysPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
            {todaysPosts.map((post) => (
              <DashboardPostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            No posts scheduled for today.
          </p>
        )}
      </div>

      {/* Tomorrow's Posts */}
      <div className="flex-1 space-y-4">
        <h2 className="text-xl font-semibold">
          Tomorrow, {format(tomorrow, "MMM d, yyyy")}
        </h2>
        {tomorrowsPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
            {tomorrowsPosts.map((post) => (
              <DashboardPostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            No posts scheduled for tomorrow.
          </p>
        )}
      </div>
    </div>
  );
}