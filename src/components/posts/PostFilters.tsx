"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Brand, PostType, SocialMedia } from "@/generated/prisma";
import { getPostTypeName } from "@/lib/post-type-name";
import { socialMediaPlatforms } from "@/lib/social-media-platforms";
import { Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { cn } from "@/lib/utils";

interface PostFiltersProps {
  brands: Brand[];
}

export function PostFilters({ brands }: PostFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const hasFiltersActive = useMemo(() => {
    return (
      searchParams.has("brandId") ||
      searchParams.has("postType") ||
      searchParams.has("socialMedia") ||
      searchParams.has("status")
    );
  }, [searchParams]);

  const updateQueryParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }

      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  const resetFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("brandId");
    params.delete("postType");
    params.delete("socialMedia");
    params.delete("status");
    router.push(`?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Filter className="h-4 w-4" />

          <span
            className={cn(
              "absolute top-0.5 right-0.5 bg-red-500 rounded-full w-2 h-2 transition-all duration-300",
              hasFiltersActive ? "opacity-100 scale-100" : "opacity-0 scale-0"
            )}
          ></span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 flex flex-col gap-4">
          <Select
            value={searchParams.get("brandId") || "all"}
            onValueChange={(value) => updateQueryParams("brandId", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All brands</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.id}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={searchParams.get("postType") || "all"}
            onValueChange={(value) => updateQueryParams("postType", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All post types</SelectItem>
              {Object.values(PostType).map((type) => (
                <SelectItem key={type} value={type}>
                  {getPostTypeName(type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={searchParams.get("socialMedia") || "all"}
            onValueChange={(value) => updateQueryParams("socialMedia", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All platforms</SelectItem>
              {Object.values(SocialMedia)
                .filter((media) =>
                  socialMediaPlatforms.some((platform) => platform.id === media)
                )
                .map((media) => (
                  <SelectItem key={media} value={media}>
                    {
                      socialMediaPlatforms.find(
                        (platform) => platform.id === media
                      )?.name
                    }
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Select
            value={searchParams.get("status") || "all"}
            onValueChange={(value) => updateQueryParams("status", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="posted">Posted</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <SheetFooter>
          <div className="w-full flex flex-col gap-2">
            <SheetClose asChild>
              <Button
                variant="outline"
                onClick={resetFilters}
                disabled={!hasFiltersActive}
              >
                Reset filters
              </Button>
            </SheetClose>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
