"use client";

import { Brand } from "@/generated/prisma";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { Header } from "@/components/common/Header";
import { useState } from "react";
import { AddBrandModal } from "@/components/brands/AddBrandModal";

const columns: ColumnDef<Brand>[] = [
  {
    accessorKey: "name",
    header: "Brand Name",
  },
  {
    accessorKey: "website",
    header: "Website",
  },
  {
    accessorKey: "createdAt",
    header: "Added",
    cell: ({ row }) => {
      return new Date(row.getValue("createdAt")).toLocaleDateString();
    },
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
