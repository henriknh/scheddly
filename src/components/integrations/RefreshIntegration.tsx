import { updateAccountInfo } from "@/app/actions/social-media-integrations";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface RefreshIntegrationProps {
  integrationId: string;
}

export function RefreshIntegration({ integrationId }: RefreshIntegrationProps) {
  const router = useRouter();

  const [refreshing, setRefreshing] = useState(false);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        setRefreshing(true);
        updateAccountInfo(integrationId)
          .then(() => {
            toast.success("Account info updated");
            router.refresh();
          })
          .catch((error) => {
            console.error(error);
            toast.error("Failed to update account info");
          })
          .finally(() => {
            setRefreshing(false);
          });
      }}
      disabled={refreshing}
    >
      <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
    </Button>
  );
}
