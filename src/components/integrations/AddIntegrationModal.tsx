import { PlusIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { platforms } from "./SocialMediaIntegrations";

interface AddIntegrationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddIntegrationModal({
  isOpen,
  onOpenChange,
}: AddIntegrationModalProps) {
  const router = useRouter();

  const handlePlatformSelect = (platform: (typeof platforms)[number]) => {
    if (!platform.configurationGuideUrl) return;

    const oauth2Url = (() => {
      switch (platform.id) {
        case "PINTEREST":
          return process.env
            .NEXT_PUBLIC_SOCIAL_MEDIA_INTEGRATION_PINTEREST_CLIENT_ID &&
            process.env
              .NEXT_PUBLIC_SOCIAL_MEDIA_INTEGRATION_PINTEREST_REDIRECT_URI
            ? `https://www.pinterest.com/oauth/?client_id=${process.env.NEXT_PUBLIC_SOCIAL_MEDIA_INTEGRATION_PINTEREST_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_SOCIAL_MEDIA_INTEGRATION_PINTEREST_REDIRECT_URI}&response_type=code&scope=boards:read,pins:read`
            : null;
        case "TUMBLR":
          return process.env
            .NEXT_PUBLIC_SOCIAL_MEDIA_INTEGRATION_TUMBLR_CLIENT_ID &&
            process.env.NEXT_PUBLIC_SOCIAL_MEDIA_INTEGRATION_TUMBLR_REDIRECT_URI
            ? `https://www.tumblr.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_SOCIAL_MEDIA_INTEGRATION_TUMBLR_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_SOCIAL_MEDIA_INTEGRATION_TUMBLR_REDIRECT_URI}&response_type=code&scope=write&state=1`
            : null;
        default:
          return null;
      }
    })();

    if (oauth2Url) {
      const channel = new BroadcastChannel("oauth2_integration_complete");
      window.open(oauth2Url, "_blank");

      channel.onmessage = (event) => {
        const oauth2Success = event?.data === "oauth2-success";

        if (oauth2Success) {
          toast.success(`Connection established to ${platform.name}`);
          router.refresh();
        } else {
          toast.error(`Connection failed to ${platform.name}`);
        }

        channel.close();
        onOpenChange(false);
      };
    } else {
      window.open(platform.configurationGuideUrl, "_blank");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="w-4 h-4 mr-2" />
          Add integration
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose platform</DialogTitle>
          <DialogDescription>
            Select a social media platform to integrate with
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {platforms.map((platform) => (
            <Card
              key={platform.id}
              className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() => handlePlatformSelect(platform)}
            >
              <CardContent className="pt-6">
                <div className="flex flex-col items-center gap-2">
                  <Image
                    src={platform.icon}
                    alt={platform.name}
                    width={32}
                    height={32}
                    className="h-8 w-8"
                  />
                  <span className="text-sm font-medium">{platform.name}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
