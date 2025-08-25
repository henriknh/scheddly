"use client";

import { SocialMediaPostParams } from "@/app/api/post/create-post";
import { SocialMediaIntegrationWithRelations } from "@/app/api/social-media-integration/types";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SocialMedia, InstagramPostType } from "@/generated/prisma";
import { socialMediaPlatforms } from "@/lib/social-media-platforms";
import { UserAvatar } from "../common/UserAvatar";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
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
                        instagramPostType:
                          integration.socialMedia === SocialMedia.INSTAGRAM
                            ? InstagramPostType.POST
                            : null,
                      }
                    : undefined
                );
              }}
            />
          </div>
        </CardTitle>
      </CardHeader>

      {(hasXCommunities ||
        integration.socialMedia === SocialMedia.INSTAGRAM) && (
        <CardContent>
          <div className="space-y-4">
            {integration.socialMedia === SocialMedia.INSTAGRAM && (
              <ToggleGroup
                type="single"
                value={
                  socialMediaPost?.instagramPostType || InstagramPostType.POST
                }
                onValueChange={(value: InstagramPostType) => {
                  if (socialMediaPost) {
                    onChange({
                      ...socialMediaPost,
                      instagramPostType: value,
                    });
                  }
                }}
                variant="outline"
                disabled={!socialMediaPost}
              >
                <ToggleGroupItem
                  value={InstagramPostType.POST}
                  aria-label="Toggle post"
                >
                  Post
                </ToggleGroupItem>
                <ToggleGroupItem
                  value={InstagramPostType.STORY}
                  aria-label="Toggle story"
                >
                  Story
                </ToggleGroupItem>
                <ToggleGroupItem
                  value={InstagramPostType.REEL}
                  aria-label="Toggle reel"
                >
                  Reel
                </ToggleGroupItem>
              </ToggleGroup>
            )}
            {integration.socialMedia === SocialMedia.X && (
              <>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`share-with-followers-${integration.id}`}
                    checked={socialMediaPost?.xShareWithFollowers}
                    onCheckedChange={() => {
                      onChange({
                        socialMediaIntegration: integration,
                        xShareWithFollowers:
                          !socialMediaPost?.xShareWithFollowers,
                        xCommunityId: socialMediaPost?.xCommunityId,
                      });
                    }}
                    disabled={
                      !socialMediaPost || !socialMediaPost?.xCommunityId
                    }
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
                        xShareWithFollowers:
                          value === "no-community"
                            ? true
                            : socialMediaPost?.xShareWithFollowers,
                        xCommunityId: value === "no-community" ? null : value,
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
              </>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
