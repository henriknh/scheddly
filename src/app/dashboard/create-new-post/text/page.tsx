import { TextPostForm } from "@/components/post-forms/text-post-form";
import { Header } from "@/components/common/Header";
import { getSocialMediaIntegrations } from "@/app/api/social-media-integration/social-media-integration";

export default async function TextPostPage() {
  const integrations = await getSocialMediaIntegrations();

  return (
    <div className="space-y-4">
      <Header>Create new text post</Header>
      <TextPostForm integrations={integrations} />
    </div>
  );
}
