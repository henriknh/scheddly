import { Trash2Icon } from "lucide-react";
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
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface DeleteBrandDialogProps {
  brandId: string;
}

export function DeleteBrandDialog({ brandId }: DeleteBrandDialogProps) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await deleteBrand(brandId);
      router.refresh();
      toast.success("Brand removed successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove brand");
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
