"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function PinterestRedirectPage() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = params.get("code");

    if (code) {
      const updatePinterestCode = async () => {
        try {
          const response = await fetch("/api/user/oauth2-code", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              platform: "PINTEREST",
              code,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to update Pinterest code");
          }

          const channel = new BroadcastChannel("oauth2_integration_complete");
          channel.postMessage("oauth2-success");
        } catch (error) {
          console.error("[PINTEREST_CODE_UPDATE_ERROR]", error);

          const channel = new BroadcastChannel("oauth2_integration_complete");
          channel.postMessage("oauth2-error");
        } finally {
          window.close();
        }
      };

      updatePinterestCode();
    }
  }, [params, router]);

  return <></>;
}
