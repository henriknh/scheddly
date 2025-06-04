import { Breadcrumb } from "@/components/common/breadcrumb";

export default function ImageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Breadcrumb label="Image" href="/dashboard/create-new-post/image" />
      {children}
    </div>
  );
}
