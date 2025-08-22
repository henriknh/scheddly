import { Breadcrumb } from "@/components/common/breadcrumb";

export default async function PostLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } = await params;

  return (
    <>
      <Breadcrumb label="Post" href={`/dashboard/posts/${slug}`} />

      {children}
    </>
  );
}
