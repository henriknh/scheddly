import { getSocialMediaIntegrations } from "@/app/api/social-media-integration/social-media-integration";
import { SocialMediaIntegrationsList } from "./SocialMediaIntegrationsList";

export async function SocialMediaIntegrations() {
  const integrations = await getSocialMediaIntegrations();

  return (
    <div className="space-y-4">
      <SocialMediaIntegrationsList integrations={integrations} />
    </div>
  );
}
