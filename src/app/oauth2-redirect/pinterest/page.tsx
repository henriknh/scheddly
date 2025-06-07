"use client";

import { SocialMedia } from "@/generated/prisma";
import { addSocialMediaIntegration } from "@/app/api/social-media-integration/add-social-media-integration";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function PinterestRedirectPage() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = params.get("code");
    const brandId = params.get("state");

    if (code && brandId) {
      const createPinterestIntegration = async () => {
        try {
          await addSocialMediaIntegration(SocialMedia.PINTEREST, code, brandId);
          const channel = new BroadcastChannel("oauth2_integration_complete");
          channel.postMessage("oauth2-success");
        } catch (error) {
          console.error("[PINTEREST_INTEGRATION_ERROR]", error);
          const channel = new BroadcastChannel("oauth2_integration_complete");
          channel.postMessage("oauth2-error");
        } finally {
          window.close();
        }
      };

      createPinterestIntegration();
    }
  }, [params, router]);

  return <></>;
}
