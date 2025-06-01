import { getSocialMediaIntegrations } from "@/app/api/social-media-integration/social-media-integration";
import { getBrands } from "@/app/api/brand/get-brands";
import { SocialMediaIntegrationsList } from "./SocialMediaIntegrationsList";

export async function SocialMediaIntegrations() {
  const integrations = await getSocialMediaIntegrations();
  const brands = await getBrands();

  return (
    <div className="space-y-4">
      <SocialMediaIntegrationsList
        integrations={integrations}
        brands={brands}
      />
    </div>
  );
}
