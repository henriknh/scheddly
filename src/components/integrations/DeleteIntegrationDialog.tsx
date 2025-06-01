import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { deleteSocialMediaIntegration } from "@/app/api/social-media-integration/social-media-integration";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface DeleteIntegrationDialogProps {
  integrationId: string;
}

export function DeleteIntegrationDialog({
  integrationId,
}: DeleteIntegrationDialogProps) {
  const router = useRouter();

  const deleteIntegration = async (id: string) => {
    try {
      await deleteSocialMediaIntegration(id);

      router.refresh();
      toast.success("Integration removed successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove integration");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash2Icon className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            integration.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteIntegration(integrationId)}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
