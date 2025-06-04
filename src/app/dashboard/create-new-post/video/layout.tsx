import { Breadcrumb } from "@/components/common/breadcrumb";

export default function VideoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Breadcrumb label="Video" href="/dashboard/create-new-post/video" />
      {children}
    </div>
  );
}
