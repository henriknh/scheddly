import { getBrands } from "@/app/api/brand/get-brands";
import { BrandList } from "@/components/brands/BrandList";
import { Breadcrumb } from "@/components/common/breadcrumb";

export const dynamic = "force-dynamic";

export default async function BrandsPage() {
  const brands = await getBrands();

  return (
    <div>
      <Breadcrumb label="Brands" href="/dashboard/brands" />
      <BrandList brands={brands} />
    </div>
  );
}
