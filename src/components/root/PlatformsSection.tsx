import { socialMediaPlatforms } from "@/lib/social-media-platforms";

export function PlatformsSection() {
  return (
    <section id="platforms" className="container pt-32">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Connect All Your Platforms
        </h2>
        <p className="text-muted-foreground">
          Schedule, publish, and manage content across your social media
          platforms from one powerful dashboard
        </p>
      </div>
      <div className="flex flex-wrap justify-center items-center gap-4">
        {socialMediaPlatforms.map((platform) => {
          const IconComponent = platform.Icon;
          return (
            <div
              key={platform.name}
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="h-8 w-8 flex items-center justify-center">
                {typeof IconComponent === "string" ? (
                  <span className="text-2xl">{IconComponent}</span>
                ) : (
                  <IconComponent className="h-6 w-6" />
                )}
              </div>
              <span className="text-xs font-medium text-center">
                {platform.name}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
