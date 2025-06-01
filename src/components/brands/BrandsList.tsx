"use client";

import { AddBrandModal } from "@/components/brands/AddBrandModal";
import { DeleteBrandDialog } from "@/components/brands/DeleteBrandDialog";
import { EditBrandModal } from "@/components/brands/EditBrandModal";
import { Header } from "@/components/common/Header";
import { Button } from "@/components/ui/button";
import { DataTable, DataTableColumnDef } from "@/components/ui/data-table";
import { Brand } from "@/generated/prisma";
import { Pencil, Plus } from "lucide-react";
import { useState } from "react";

const columns: DataTableColumnDef<Brand, unknown>[] = [
  {
    accessorKey: "name",
    header: "Brand Name",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex justify-end gap-2">
          <EditBrandButton brand={row.original} />
          <DeleteBrandDialog brandId={row.original.id} />
        </div>
      );
    },
    size: 0,
    align: "end",
  },
];

interface EditBrandButtonProps {
  brand: Brand;
}

function EditBrandButton({ brand }: EditBrandButtonProps) {
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

interface BrandsListProps {
  brands: Brand[];
}

export function BrandsList({ brands }: BrandsListProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Header>Brands</Header>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Brand
        </Button>
      </div>
      <DataTable columns={columns} data={brands} />
      <AddBrandModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
