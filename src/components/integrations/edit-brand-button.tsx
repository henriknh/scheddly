import { useState } from "react";
import { Button } from "../ui/button";
import { EditBrandModal } from "../brands/EditBrandModal";
import { Pencil } from "lucide-react";
import { Brand } from "@/generated/prisma";

interface EditBrandButtonProps {
  brand: Brand;
}

export function EditBrandButton({ brand }: EditBrandButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
        <Pencil className="h-4 w-4" />
      </Button>

      <EditBrandModal
        brand={brand}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
