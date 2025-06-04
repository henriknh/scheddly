import { Breadcrumb } from "@/components/common/breadcrumb";

export default function TextLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Breadcrumb label="Text" href="/dashboard/create-new-post/text" />
      {children}
    </div>
  );
}
