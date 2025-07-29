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
import { addDays, format } from "date-fns";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

interface PostFiltersProps {
  brands: Brand[];
  currentDate: Date;
  onCurrentDateChange: (date: Date) => void;
}

// Custom hook to detect screen size
function useScreenSize() {
  const [screenSize, setScreenSize] = useState<"mobile" | "tablet" | "desktop">(
    "desktop"
  );

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width <= 768) {
        setScreenSize("mobile");
      } else if (width <= 1024) {
        setScreenSize("tablet");
      } else {
        setScreenSize("desktop");
      }
    };

    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  return screenSize;
}

export function PostFilters({
  brands,
  currentDate,
  onCurrentDateChange,
}: PostFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const screenSize = useScreenSize();

  useEffect(() => {
    setDateFrom(
      searchParams.get("dateFrom")
        ? new Date(searchParams.get("dateFrom")!)
        : undefined
    );
    setDateTo(
      searchParams.get("dateTo")
        ? new Date(searchParams.get("dateTo")!)
        : undefined
    );
  }, [searchParams]);

  const updateQueryParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    const updateQueryParams = (
      params: Record<string, string | null | undefined>
    ) => {
      const newParams = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          newParams.set(key, value);
        } else {
          newParams.delete(key);
        }
      });
      router.push(`?${newParams.toString()}`);
    };

    if (dateFrom && dateTo) {
      updateQueryParams({
        dateFrom: dateFrom ? format(dateFrom, "yyyy-MM-dd") : undefined,
        dateTo: dateTo ? format(dateTo, "yyyy-MM-dd") : undefined,
      });
    } else {
      updateQueryParams({
        dateFrom: undefined,
        dateTo: undefined,
      });
    }
  }, [dateFrom, dateTo, router, searchParams]);

  const handlePrevious = () => {
    if (screenSize === "mobile") {
      // Mobile: Navigate by days
      onCurrentDateChange(addDays(currentDate, -1));
    } else {
      // Tablet and Desktop: Navigate by weeks
      onCurrentDateChange(addDays(currentDate, -7));
    }
  };

  const handleNext = () => {
    if (screenSize === "mobile") {
      // Mobile: Navigate by days
      onCurrentDateChange(addDays(currentDate, 1));
    } else {
      // Tablet and Desktop: Navigate by weeks
      onCurrentDateChange(addDays(currentDate, 7));
    }
  };

  const handleToday = () => {
    onCurrentDateChange(new Date());
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        variant="outline"
        onClick={handleToday}
        className="flex-1 md:flex-none"
      >
        Today
      </Button>

      <Button variant="outline" size="icon" onClick={handlePrevious}>
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button variant="outline" size="icon" onClick={handleNext}>
        <ChevronRight className="h-4 w-4" />
      </Button>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 flex flex-col gap-4">
            <Select
              value={searchParams.get("brandId") || "all"}
              onValueChange={(value) => updateQueryParam("brandId", value)}
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
              onValueChange={(value) => updateQueryParam("postType", value)}
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
              onValueChange={(value) => updateQueryParam("socialMedia", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All platforms</SelectItem>
                {Object.values(SocialMedia)
                  .filter((media) =>
                    socialMediaPlatforms.some(
                      (platform) => platform.id === media
                    )
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
              onValueChange={(value) => updateQueryParam("status", value)}
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

          {/* <SheetFooter>
              <div className="w-full flex flex-col gap-2">
                <Button type="submit">Apply filters</Button>
                <SheetClose asChild>
                  <Button variant="ghost">Reset filters</Button>
                </SheetClose>
              </div>
            </SheetFooter> */}
        </SheetContent>
      </Sheet>
    </div>
  );
}
