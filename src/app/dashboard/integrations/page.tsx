import { getBrands } from "@/app/api/brand/get-brands";
import { getSocialMediaIntegrations } from "@/app/api/social-media-integration/get-social-media-integrations";
import { BrandsWithIntegrationsList } from "@/components/integrations/BrandsWithIntegrationsList";

export default async function IntegrationsPage() {
  const brands = await getBrands();
  const integrations = await getSocialMediaIntegrations();

  return (
    <div className="space-y-4">
      <BrandsWithIntegrationsList brands={brands} integrations={integrations} />
    </div>
  );
}
