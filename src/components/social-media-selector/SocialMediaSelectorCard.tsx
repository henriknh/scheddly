"use client";

import { SocialMediaPostParams } from "@/app/api/post/create-post";
import { SocialMediaIntegrationWithRelations } from "@/app/api/social-media-integration/types";
import { SocialMedia } from "@/generated/prisma";
import { socialMediaPlatforms } from "@/lib/social-media-platforms";
import { UserAvatar } from "../common/UserAvatar";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface SocialMediaSelectorCardProps {
  integration: SocialMediaIntegrationWithRelations;
  socialMediaPost?: SocialMediaPostParams;
  onChange: (socialMediaPost?: SocialMediaPostParams) => void;
}

export function SocialMediaSelectorCard({
  integration,
  socialMediaPost,
  onChange,
}: SocialMediaSelectorCardProps) {
  const platform = socialMediaPlatforms.find(
    (p) => p.id === integration.socialMedia
  );

  if (!platform) return null;

  const hasXCommunities =
    integration.socialMedia === SocialMedia.X &&
    integration.xCommunities &&
    integration.xCommunities.length > 0;

  return (
    <Card key={integration.id}>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <div className="text-base font-medium flex items-center gap-2">
                  <platform.Icon className="h-4 w-4" />
                  <span>{platform.name}</span>
                </div>
                {integration.accountUsername && (
                  <span className="text-xs opacity-70 flex items-center gap-2">
                    <UserAvatar
                      src={integration.accountAvatarUrl || undefined}
                    />
                    {integration.accountName}
                  </span>
                )}
              </div>
            </div>

            <Checkbox
              checked={!!socialMediaPost}
              onCheckedChange={() => {
                onChange(
                  !socialMediaPost
                    ? {
                        socialMediaIntegration: integration,
                        xShareWithFollowers: true,
                        xCommunityId: null,
                      }
                    : undefined
                );
              }}
            />
          </div>
        </CardTitle>
      </CardHeader>

      {hasXCommunities && (
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id={`share-with-followers-${integration.id}`}
                checked={socialMediaPost?.xShareWithFollowers}
                onCheckedChange={() => {
                  onChange({
                    socialMediaIntegration: integration,
                    xShareWithFollowers: !socialMediaPost?.xShareWithFollowers,
                    xCommunityId: socialMediaPost?.xCommunityId,
                  });
                }}
                disabled={!socialMediaPost}
              />
              <Label htmlFor={`share-with-followers-${integration.id}`}>
                Share with followers
              </Label>
            </div>

            {hasXCommunities && (
              <Select
                value={socialMediaPost?.xCommunityId ?? "no-community"}
                onValueChange={(value) => {
                  onChange({
                    socialMediaIntegration: integration,
                    xShareWithFollowers: socialMediaPost?.xShareWithFollowers,
                    xCommunityId: value,
                  });
                }}
                disabled={!socialMediaPost}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a community" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-community">No community</SelectItem>
                  {integration.xCommunities?.map((community) => (
                    <SelectItem key={community.xId} value={community.xId}>
                      {community.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
