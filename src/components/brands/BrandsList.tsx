"use client";

import { AddBrandModal } from "@/components/brands/AddBrandModal";
import { DeleteBrandDialog } from "@/components/brands/DeleteBrandDialog";
import { Header } from "@/components/common/Header";
import { Button } from "@/components/ui/button";
import { DataTable, DataTableColumnDef } from "@/components/ui/data-table";
import { Brand } from "@/generated/prisma";
import { Plus } from "lucide-react";
import { useState } from "react";

const columns: DataTableColumnDef<Brand, unknown>[] = [
  {
    accessorKey: "name",
    header: "Brand Name",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <DeleteBrandDialog brandId={row.original.id} />;
    },
    size: 0,
    align: "end",
  },
];

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
