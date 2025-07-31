import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Eye, Users, CheckCircle } from "lucide-react";
import { getStatistics } from "@/app/api/root/statistics";

export async function StatisticsSection() {
  const stats = await getStatistics();

  const statistics = [
    {
      value: `${stats.successfulPosts.toLocaleString()}+`,
      label: "Posts Scheduled",
      description: "Content published across all platforms",
      icon: <Calendar className="h-8 w-8 text-primary" />,
    },
    {
      value: `${(stats.totalImpressions / 1000000).toFixed(1)}M+`,
      label: "Reach Generated",
      description: "Total impressions across all platforms",
      icon: <Eye className="h-8 w-8 text-primary" />,
    },
    {
      value: `${stats.totalUsers.toLocaleString()}+`,
      label: "Active Users",
      description: "Creators and businesses trust our platform",
      icon: <Users className="h-8 w-8 text-primary" />,
    },
    {
      value: `${Math.round(
        (stats.successfulPosts /
          (stats.successfulPosts + stats.failedPosts || 1)) *
          100
      )}%`,
      label: "Success Rate",
      description: "Posts published successfully on first try",
      icon: <CheckCircle className="h-8 w-8 text-primary" />,
    },
  ];

  return (
    <section className="container">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">
          Trusted by Creators Worldwide
        </h2>
        <p className="text-lg text-muted-foreground">
          See the impact we&apos;re making in the social media world
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statistics.map((stat) => (
          <Card key={stat.label} className="text-center">
            <CardHeader className="pb-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                {stat.icon}
              </div>
              <CardTitle className="text-3xl font-bold text-primary mb-2">
                {stat.value}
              </CardTitle>
              <p className="font-semibold text-lg">{stat.label}</p>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
