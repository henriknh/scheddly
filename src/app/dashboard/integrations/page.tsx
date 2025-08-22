import { getBrands } from "@/app/api/brand/get-brands";
import { getSocialMediaIntegrations } from "@/app/api/social-media-integration/get-social-media-integrations";
import { AllIntegrationsList } from "@/components/integrations/AllIntegrationsList";

export default async function IntegrationsPage() {
  const brands = await getBrands();
  const integrations = await getSocialMediaIntegrations();

  return <AllIntegrationsList brands={brands} integrations={integrations} />;
}
