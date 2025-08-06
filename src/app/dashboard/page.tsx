import { CreateNewPost } from "@/components/dashboard/create-new-post";
import { TodaysTomorrowsPosts } from "@/components/dashboard/todays-tomorrows-posts";
import { getTodaysPosts } from "@/app/api/post/get-todays-posts";
import { getTomorrowsPosts } from "@/app/api/post/get-tomorrows-posts";

export default async function DashboardPage() {
  // Fetch today's and tomorrow's posts
  const [todaysPosts, tomorrowsPosts] = await Promise.all([
    getTodaysPosts(),
    getTomorrowsPosts(),
  ]);

  return (
    <div className="space-y-8">
      <CreateNewPost />
      <TodaysTomorrowsPosts 
        todaysPosts={todaysPosts} 
        tomorrowsPosts={tomorrowsPosts} 
      />
    </div>
  );
}
