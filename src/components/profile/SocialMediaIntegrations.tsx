"use client";

import { SocialMedia } from "@/generated/prisma";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { SocialMediaIntegrationsRow } from "./SocialMediaIntegrationsRow";

export type Platform = {
  id: SocialMedia;
  name: string;
  description: string;
  icon: string;
  clientIdLabel?: string;
  clientSecretLabel?: string;
  accessTokenLabel?: string;
  configurationGuideUrl: string;
};

export function SocialMediaIntegrations() {
  const platforms: Platform[] = [
    {
      id: SocialMedia.TUMBLR,
      name: "Tumblr",
      description: "Share your products and content on Tumblr",
      icon: "/icons/tumblr.svg",
      clientIdLabel: "OAuth consumer key",
      clientSecretLabel: "OAuth consumer secret",
      configurationGuideUrl: "https://www.tumblr.com/oauth/apps",
    },

    {
      id: SocialMedia.PINTEREST,
      name: "Pinterest",
      description: "Share your products and content on Pinterest",
      icon: "/icons/pinterest.svg",
      clientIdLabel: "App ID",
      clientSecretLabel: "App secret key",
      configurationGuideUrl: "https://developers.pinterest.com/apps/",
    },
  ].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {platforms.map((platform) => (
              <SocialMediaIntegrationsRow
                key={platform.id}
                platform={platform}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
