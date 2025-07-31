import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  PinterestIcon,
  ThreadsIcon,
  TikTokIcon,
  TumblrIcon,
  XIcon,
  YouTubeIcon,
} from "@/components/icons";

export function PlatformsSection() {
  const platforms = [
    { name: "Instagram", icon: InstagramIcon },
    { name: "Facebook", icon: FacebookIcon },
    { name: "Threads", icon: ThreadsIcon },
    { name: "X (Twitter)", icon: XIcon },
    { name: "LinkedIn", icon: LinkedInIcon },
    { name: "TikTok", icon: TikTokIcon },
    { name: "Pinterest", icon: PinterestIcon },
    { name: "Tumblr", icon: TumblrIcon },
    { name: "YouTube", icon: YouTubeIcon },
  ];

  return (
    <section className="container">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Connect All Your Platforms
        </h2>
        <p className="text-muted-foreground">
          Manage 10+ social media platforms from one dashboard
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {platforms.map((platform) => {
          const IconComponent = platform.icon;
          return (
            <div
              key={platform.name}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:border-primary/50 transition-colors"
            >
              <div className="h-8 w-8 flex items-center justify-center">
                {typeof IconComponent === "string" ? (
                  <span className="text-2xl">{IconComponent}</span>
                ) : (
                  <IconComponent className="h-6 w-6" />
                )}
              </div>
              <span className="text-sm font-medium">{platform.name}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
