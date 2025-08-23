import { Breadcrumb } from "@/components/common/breadcrumb";

export default function ImageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Breadcrumb label="New Image Post" href="/dashboard/new-image-post" />

      {children}
    </>
  );
}
