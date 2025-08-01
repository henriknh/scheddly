"use client";

import { useState } from "react";
import { Brand } from "@/generated/prisma";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { AddBrandModal } from "./AddBrandModal";
import { EditBrandModal } from "./EditBrandModal";
import { DeleteBrandDialog } from "./DeleteBrandDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  PinterestIcon,
  ThreadsIcon,
  TikTokIcon,
  TumblrIcon,
  XIcon,
  YouTubeIcon,
} from "@/components/icons";

interface BrandListProps {
  brands: (Brand & {
    socialMediaIntegrations: { socialMedia: string }[];
  })[];
}

const socialMediaIconMap = {
  FACEBOOK: FacebookIcon,
  INSTAGRAM: InstagramIcon,
  LINKEDIN: LinkedInIcon,
  PINTEREST: PinterestIcon,
  THREADS: ThreadsIcon,
  TIKTOK: TikTokIcon,
  TUMBLR: TumblrIcon,
  X: XIcon,
  YOUTUBE: YouTubeIcon,
};

export function BrandList({ brands }: BrandListProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [deletingBrand, setDeletingBrand] = useState<Brand | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Brands</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Brand
        </Button>
      </div>

      {brands.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No brands found. Create your first brand to get started.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Integrations</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brands.map((brand) => (
              <TableRow key={brand.id}>
                <TableCell className="font-medium">{brand.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {brand.socialMediaIntegrations.map((integration, index) => {
                      const IconComponent =
                        socialMediaIconMap[
                          integration.socialMedia as keyof typeof socialMediaIconMap
                        ];
                      return IconComponent ? (
                        <IconComponent key={index} className="h-4 w-4" />
                      ) : null;
                    })}
                    {brand.socialMediaIntegrations.length === 0 && (
                      <span className="text-muted-foreground text-sm">
                        No integrations
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(brand.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingBrand(brand)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeletingBrand(brand)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <AddBrandModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {editingBrand && (
        <EditBrandModal
          brand={editingBrand}
          isOpen={!!editingBrand}
          onClose={() => setEditingBrand(null)}
        />
      )}

      {deletingBrand && (
        <DeleteBrandDialog
          brandId={deletingBrand.id}
          isOpen={!!deletingBrand}
          onClose={() => setDeletingBrand(null)}
        />
      )}
    </div>
  );
}
