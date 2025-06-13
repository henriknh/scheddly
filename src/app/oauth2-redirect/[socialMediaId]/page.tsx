"use client";

import { addSocialMediaIntegration } from "@/app/api/social-media-integration/add-social-media-integration";
import { SocialMedia } from "@/generated/prisma";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function PinterestRedirectPage() {
  const { socialMediaId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  console.log(socialMediaId, searchParams);

  useEffect(() => {
    const code = searchParams.get("code");
    const brandId = searchParams.get("state");

    const matchingSocialMedia = Object.values(SocialMedia).find(
      (socialMedia) =>
        socialMedia.toLowerCase() === (socialMediaId as string).toLowerCase()
    );

    if (!matchingSocialMedia) {
      const channel = new BroadcastChannel("oauth2_integration_complete");
      channel.postMessage({
        error: `[INTEGRATION_ERROR] Invalid social media id: ${socialMediaId}`,
      });
      return;
    }

    if (!code) {
      const channel = new BroadcastChannel("oauth2_integration_complete");
      channel.postMessage({
        error: `[INTEGRATION_ERROR][${matchingSocialMedia}] No code provided`,
      });
      return;
    }

    if (!brandId) {
      const channel = new BroadcastChannel("oauth2_integration_complete");
      channel.postMessage({
        error: `[INTEGRATION_ERROR][${matchingSocialMedia}] No brand id provided`,
      });
      return;
    }
    const createIntegration = async () => {
      try {
        await addSocialMediaIntegration(matchingSocialMedia, code, brandId);
        const channel = new BroadcastChannel("oauth2_integration_complete");
        channel.postMessage({
          success: true,
        });
        window.close();
      } catch (error) {
        const channel = new BroadcastChannel("oauth2_integration_complete");
        channel.postMessage({
          error: `[INTEGRATION_ERROR][${matchingSocialMedia}]`,
          errorDetails: error,
        });
      } finally {
      }
    };

    createIntegration();
  }, [socialMediaId, router, searchParams]);

  return <></>;
}
