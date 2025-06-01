import { Header } from "@/components/common/Header";
import { VideoPostForm } from "@/components/post-forms/video-post-form";
import { getSocialMediaIntegrations } from "@/app/api/social-media-integration/get-social-media-integrations";

export default async function VideoPostPage() {
  const integrations = await getSocialMediaIntegrations();

  return (
    <div className="space-y-4">
      <Header>Create new video post</Header>
      <VideoPostForm integrations={integrations} />
    </div>
  );
}
