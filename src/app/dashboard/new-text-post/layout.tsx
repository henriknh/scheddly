import { Breadcrumb } from "@/components/common/breadcrumb";

export default function TextLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Breadcrumb label="New Text Post" href="/dashboard/new-text-post" />

      {children}
    </>
  );
}
