import { getAlreadyScheduledDates } from "@/app/api/post/get-already-scheduled-dates";
import { getSocialMediaIntegrations } from "@/app/api/social-media-integration/get-social-media-integrations";
import { ImagePostForm } from "@/components/post-forms/image-post-form";

interface ImagePostPageProps {
  searchParams: Promise<{ date?: string }>;
}

export default async function ImagePostPage({
  searchParams,
}: ImagePostPageProps) {
  const { date } = await searchParams;
  const integrations = await getSocialMediaIntegrations();

  const alreadyScheduledDates = await getAlreadyScheduledDates();

  return (
    <ImagePostForm
      integrations={integrations}
      alreadyScheduledDates={alreadyScheduledDates}
      initialDate={date}
    />
  );
}
