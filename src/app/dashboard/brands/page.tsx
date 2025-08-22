import { getBrands } from "@/app/api/brand/get-brands";
import { BrandList } from "@/components/brands/BrandList";

export const dynamic = "force-dynamic";

export default async function BrandsPage() {
  const brands = await getBrands();

  return <BrandList brands={brands} />;
}
