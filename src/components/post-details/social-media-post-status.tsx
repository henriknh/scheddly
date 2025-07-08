"use client";

import { deleteSocialMediaPost } from "@/app/api/post/delete-social-media-post";
import { postSocialMediaPost } from "@/app/api/post/post-social-media-post";
import {
  PostWithRelations,
  SocialMediaPostWithRelations,
} from "@/app/api/post/types";
import { SocialMediaIntegrationWithRelations } from "@/app/api/social-media-integration/types";
import { formatDateTime } from "@/lib/format-date";
import { getSocialMediaPlatform } from "@/lib/social-media-platforms";
import { cn } from "@/lib/utils";
import { ExternalLink, RefreshCwIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface SocialMediaPostStatusProps {
  post: PostWithRelations;
  socialMediaPost: SocialMediaPostWithRelations;
  integrations: SocialMediaIntegrationWithRelations[];
}

export function SocialMediaPostStatus({
  post,
  socialMediaPost,
  integrations,
}: SocialMediaPostStatusProps) {
  const [isPosting, setIsPosting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [active, setActive] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const platform = getSocialMediaPlatform(socialMediaPost.socialMedia);
  const platformName = platform?.name;
  const PlatformIcon = platform?.Icon;

  const integrationExists = integrations.some(
    (integration) =>
      integration.socialMedia === socialMediaPost.socialMedia &&
      integration.brandId === socialMediaPost.brandId
  );

  // Click outside to deactivate
  useEffect(() => {
    if (!active) return;
    function handleClick(e: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setActive(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [active]);

  const handlePost = () => {
    if (socialMediaPost.postedAt) {
      return;
    }

    setIsPosting(true);
    postSocialMediaPost(post, socialMediaPost).finally(() => {
      setIsPosting(false);
      router.refresh();
    });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    deleteSocialMediaPost(socialMediaPost.id).finally(() => {
      setIsDeleting(false);
      router.refresh();
    });
  };

  const getStatusColor = () => {
    if (!integrationExists) return "bg-warning";
    if (socialMediaPost.postedAt) return "bg-success";
    if (socialMediaPost.failedAt) return "bg-error";
    return "bg-warning";
  };

  return (
    <div className={cn("relative h-20", active && "z-50")}>
      <Card
        ref={cardRef}
        className={cn(
          active ? "scale-105 shadow-2xl bg-secondary" : "scale-100 ",
          "hover:bg-secondary cursor-pointer transition-all duration-300"
        )}
        style={active ? { zIndex: 1000 } : {}}
        onClick={() => {
          if (!active) setActive(true);
        }}
        tabIndex={integrationExists ? 0 : -1}
        aria-disabled={!integrationExists}
      >
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            {/* Platform (top left) */}
            <div className="flex items-center gap-1">
              {PlatformIcon && <PlatformIcon className="h-4 w-4" />}
              <span className="font-medium text-xs">{platformName}</span>
            </div>
            {/* Status (top right) */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "w-2.5 h-2.5 rounded-full cursor-pointer",
                    getStatusColor()
                  )}
                />
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-xs">
                  {integrationExists && socialMediaPost.postedAt && (
                    <div>
                      Posted at{" "}
                      {formatDateTime(new Date(socialMediaPost.postedAt))}
                    </div>
                  )}
                  {integrationExists && socialMediaPost.failedAt && (
                    <div>
                      Failed at{" "}
                      {formatDateTime(new Date(socialMediaPost.failedAt))}
                    </div>
                  )}
                  {integrationExists && socialMediaPost.failedReason && (
                    <div className="mt-1">
                      Error: {socialMediaPost.failedReason}
                    </div>
                  )}
                  {!integrationExists && <div>Integration missing</div>}
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>

        <CardContent
          className={cn(
            "pt-0 overflow-hidden h-full transition-all duration-300",
            active ? "h-20" : "h-0"
          )}
        >
          <div className="flex flex-col gap-4 h-full">
            {/* <div className="flex items-end gap-2 pt-4">
              <span className="text-7xl font-medium">
                {socialMediaPost.postedAt ? views : "—"}
              </span>
              <span className="text-xs text-muted-foreground pb-2">views</span>
            </div> */}

            <div
              className={cn(
                "transition-opacity duration-300",
                active ? "opacity-100" : "opacity-0 pointer-events-none"
              )}
            >
              {/* <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  <span>{socialMediaPost.postedAt ? likes : "—"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" />
                  <span>{socialMediaPost.postedAt ? comments : "—"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Share2 className="h-3 w-3" />
                  <span>{socialMediaPost.postedAt ? shares : "—"}</span>
                </div>
              </div> */}
              <div className="flex items-center gap-2 mt-4">
                {socialMediaPost.postedAt && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild={!!socialMediaPost.permalink}
                      className="flex-1"
                      disabled={!socialMediaPost.permalink}
                    >
                      {socialMediaPost.permalink ? (
                        <Link
                          href={socialMediaPost.permalink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                          View
                        </Link>
                      ) : (
                        <>
                          <ExternalLink className="h-4 w-4" />
                          View
                        </>
                      )}
                    </Button>

                    {integrationExists && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDelete}
                        disabled={isDeleting || !integrationExists}
                        className="flex-1 text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    )}
                  </>
                )}
                {integrationExists && !socialMediaPost.postedAt && (
                  <Button
                    size="sm"
                    onClick={handlePost}
                    disabled={isPosting || !integrationExists}
                    className="flex-1"
                  >
                    <RefreshCwIcon
                      className={cn("h-4 w-4", isPosting && "animate-spin")}
                    />
                    Post
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
