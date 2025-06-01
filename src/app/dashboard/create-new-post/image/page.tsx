import { Header } from "@/components/common/Header";
import { ImagePostForm } from "@/components/post-forms/image-post-form";
import { getSocialMediaIntegrations } from "@/app/api/social-media-integration/get-social-media-integrations";

export default async function ImagePostPage() {
  const integrations = await getSocialMediaIntegrations();

  return (
    <div className="space-y-4">
      <Header>Create new image post</Header>
      <ImagePostForm integrations={integrations} />
    </div>
  );
}
