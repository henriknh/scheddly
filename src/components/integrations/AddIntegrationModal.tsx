import {
  SocialMediaPlatform,
  socialMediaPlatforms,
} from "@/lib/social-media-platforms";
import { PlusIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface AddIntegrationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddIntegrationModal({
  isOpen,
  onOpenChange,
}: AddIntegrationModalProps) {
  const router = useRouter();

  const socialMediaDataButtons = useMemo(() => {
    const getOauthPageUrl = (socialMediaPlatform: SocialMediaPlatform) => {
      return socialMediaPlatform.socialMediaApiFunctions.oauthPageUrl();
    };

    const handlePlatformSelect = (socialMediaPlatform: SocialMediaPlatform) => {
      const oauthPageUrl = getOauthPageUrl(socialMediaPlatform);

      if (oauthPageUrl) {
        const channel = new BroadcastChannel("oauth2_integration_complete");
        window.open(oauthPageUrl, "_blank");

        channel.onmessage = (event) => {
          const oauth2Success = event?.data === "oauth2-success";

          if (oauth2Success) {
            toast.success(
              `Connection established to ${socialMediaPlatform.name}`
            );
            router.refresh();
          } else {
            toast.error(`Connection failed to ${socialMediaPlatform.name}`);
          }

          channel.close();
          onOpenChange(false);
        };
      }
    };

    return socialMediaPlatforms.map((socialMediaPlatform) => ({
      icon: socialMediaPlatform.icon,
      name: socialMediaPlatform.name,
      onClick: () => handlePlatformSelect(socialMediaPlatform),
      disabled: !getOauthPageUrl(socialMediaPlatform),
    }));
  }, [onOpenChange, router]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="w-4 h-4" />
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
          {socialMediaDataButtons.map((socialMediaDataButton) => (
            <Button
              key={socialMediaDataButton.name}
              className="cursor-pointer hover:bg-accent transition-colors"
              onClick={socialMediaDataButton.onClick}
              disabled={socialMediaDataButton.disabled}
            >
              <Image
                src={socialMediaDataButton.icon}
                alt={socialMediaDataButton.name}
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="text-sm font-medium">
                {socialMediaDataButton.name}
              </span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
