"use client";

import { SocialMedia } from "@/generated/prisma";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function TumblrRedirectPage() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = params.get("code");

    if (code) {
      const updateTumblrCode = async () => {
        try {
          const response = await fetch("/api/user/oauth2-code", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              platform: SocialMedia.TUMBLR,
              code,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to update Tumblr code");
          }

          const channel = new BroadcastChannel("oauth2_integration_complete");
          channel.postMessage("oauth2-success");
        } catch (error) {
          console.error("[TUMBLR_CODE_UPDATE_ERROR]", error);

          const channel = new BroadcastChannel("oauth2_integration_complete");
          channel.postMessage("oauth2-error");
        } finally {
          window.close();
        }
      };

      updateTumblrCode();
    }
  }, [params, router]);

  return <></>;
}
