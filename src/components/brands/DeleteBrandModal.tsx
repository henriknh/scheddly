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

interface DeleteBrandModalProps {
  brandId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteBrandModal({
  brandId,
  isOpen,
  onClose,
}: DeleteBrandModalProps) {
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
          <AlertDialogTitle>Do you want to delete this brand?</AlertDialogTitle>
          <AlertDialogDescription>
            Connected social media integrations won&apos;t be deleted but will
            instead be disconnected.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} variant="destructive">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
