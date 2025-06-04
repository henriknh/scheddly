import { Breadcrumb } from "@/components/common/breadcrumb";

export default async function PostLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    slug: string;
  };
}) {
  const slug = (await params).slug;

  return (
    <div>
      <Breadcrumb label="Post" href={`/dashboard/posts/${slug}`} />
      {children}
    </div>
  );
}
