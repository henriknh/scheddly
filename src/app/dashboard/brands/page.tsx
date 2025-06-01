import { getBrands } from "@/app/api/brand/get-brands";
import { BrandsList } from "@/components/brands/BrandsList";

export default async function BrandsPage() {
  const brands = await getBrands();

  return (
    <div className="space-y-4">
      <BrandsList brands={brands} />
    </div>
  );
}
