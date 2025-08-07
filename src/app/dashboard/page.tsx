import { CreateNewPost } from "@/components/dashboard/create-new-post";
import { PostCell } from "@/components/posts/PostCell";
import { getTodaysPosts } from "@/app/api/post/get-todays-posts";
import { getTomorrowsPosts } from "@/app/api/post/get-tomorrows-posts";
import { format } from "date-fns";

export default async function DashboardPage() {
  // Fetch today's and tomorrow's posts
  const [todaysPosts, tomorrowsPosts] = await Promise.all([
    getTodaysPosts(),
    getTomorrowsPosts(),
  ]);

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return (
    <div className="space-y-8 max-w-[100vw]">
      <CreateNewPost />
      
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Today's Posts */}
        <div className="flex-1 space-y-4">
          <h2 className="text-xl font-semibold">
            Today, {format(today, "MMM d, yyyy")}
          </h2>
          {todaysPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
              {todaysPosts.map((post) => (
                <PostCell key={post.id} post={post} isCurrentDay={true} />
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
                <PostCell key={post.id} post={post} isCurrentDay={false} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              No posts scheduled for tomorrow.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
