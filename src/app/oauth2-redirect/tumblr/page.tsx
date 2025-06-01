"use client";

import { SocialMedia } from "@/generated/prisma";
import { addSocialMediaIntegration } from "@/app/api/social-media-integration/social-media-integration";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function TumblrRedirectPage() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = params.get("code");

    if (code) {
      const createTumblrIntegration = async () => {
        try {
          await addSocialMediaIntegration(SocialMedia.TUMBLR, code);
          const channel = new BroadcastChannel("oauth2_integration_complete");
          channel.postMessage("oauth2-success");
        } catch (error) {
          console.error("[TUMBLR_INTEGRATION_ERROR]", error);
          const channel = new BroadcastChannel("oauth2_integration_complete");
          channel.postMessage("oauth2-error");
        } finally {
          window.close();
        }
      };

      createTumblrIntegration();
    }
  }, [params, router]);

  return <></>;
}
