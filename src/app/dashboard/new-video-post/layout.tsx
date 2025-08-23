import { Breadcrumb } from "@/components/common/breadcrumb";

export default function VideoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Breadcrumb label="New Video Post" href="/dashboard/new-video-post" />

      {children}
    </>
  );
}
