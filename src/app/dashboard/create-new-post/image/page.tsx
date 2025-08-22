import { getSocialMediaIntegrations } from "@/app/api/social-media-integration/get-social-media-integrations";
import { Header } from "@/components/common/Header";
import { ImagePostForm } from "@/components/post-forms/image-post-form";

interface ImagePostPageProps {
  searchParams: Promise<{ date?: string }>;
}

export default async function ImagePostPage({
  searchParams,
}: ImagePostPageProps) {
  const { date } = await searchParams;
  const integrations = await getSocialMediaIntegrations();

  return (
    <div className="space-y-4">
      <Header>Create new image post</Header>
      <ImagePostForm integrations={integrations} initialDate={date} />
    </div>
  );
}
