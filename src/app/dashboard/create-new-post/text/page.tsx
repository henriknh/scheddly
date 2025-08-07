import { TextPostForm } from "@/components/post-forms/text-post-form";
import { Header } from "@/components/common/Header";
import { getSocialMediaIntegrations } from "@/app/api/social-media-integration/get-social-media-integrations";
import { Breadcrumb } from "@/components/common/breadcrumb";

interface TextPostPageProps {
  searchParams: Promise<{ date?: string }>;
}

export default async function TextPostPage({ searchParams }: TextPostPageProps) {
  const { date } = await searchParams;
  const integrations = await getSocialMediaIntegrations();

  return (
    <div className="space-y-4">
      <Breadcrumb label="Text" href="/dashboard/create-new-post/text" />
      <Header>Create new text post</Header>
      <TextPostForm integrations={integrations} initialDate={date} />
    </div>
  );
}
