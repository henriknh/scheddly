import { deleteXCommunity } from "@/app/api/social-media-integration/delete-x-community";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { XCommunity } from "@/generated/prisma";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteXCommunityModalProps {
  community: XCommunity;
}

export function DeleteXCommunityModal({
  community,
}: DeleteXCommunityModalProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await deleteXCommunity(community.id);
      setOpen(false);
      toast.success("X community deleted");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete X community");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete X Community</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this X community? This action is
            irreversible.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
