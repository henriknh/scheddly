import { getBrands } from "@/app/api/brand/get-brands";
import { getSocialMediaIntegrations } from "@/app/api/social-media-integration/get-social-media-integrations";
import { AllIntegrationsList } from "@/components/integrations/AllIntegrationsList";
import { Breadcrumb } from "@/components/common/breadcrumb";

export default async function IntegrationsPage() {
  const brands = await getBrands();
  const integrations = await getSocialMediaIntegrations();

  return (
    <div className="space-y-8">
      <Breadcrumb label="Integrations" href="/dashboard/integrations" />
      <AllIntegrationsList brands={brands} integrations={integrations} />
    </div>
  );
}
