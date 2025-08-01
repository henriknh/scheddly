import { toast } from "sonner";
import { deleteBrand } from "@/app/api/brand/delete-brand";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { useRouter } from "next/navigation";

interface DeleteBrandDialogProps {
  brandId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteBrandDialog({
  brandId,
  isOpen,
  onClose,
}: DeleteBrandDialogProps) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await deleteBrand(brandId);
      router.refresh();
      toast.success("Brand removed successfully");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove brand");
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            brand and remove it from any associated integrations.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
