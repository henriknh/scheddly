import { getAlreadyScheduledDates } from "@/app/api/post/get-already-scheduled-dates";
import { getSocialMediaIntegrations } from "@/app/api/social-media-integration/get-social-media-integrations";
import { TextPostForm } from "@/components/post-forms/text-post-form";

interface TextPostPageProps {
  searchParams: Promise<{ date?: string }>;
}

export default async function TextPostPage({
  searchParams,
}: TextPostPageProps) {
  const { date } = await searchParams;
  const integrations = await getSocialMediaIntegrations();
  const alreadyScheduledDates = await getAlreadyScheduledDates();

  return (
    <TextPostForm
      integrations={integrations}
      alreadyScheduledDates={alreadyScheduledDates}
      initialDate={date}
    />
  );
}
