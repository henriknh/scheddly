import { Breadcrumb } from "@/components/common/breadcrumb";

export default function BrandsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Breadcrumb label="Brands" href="/dashboard/brands" />

      {children}
    </>
  );
}
