"use client";

import { PostType, Brand, SocialMedia } from "@/generated/prisma";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getPostTypeName } from "@/lib/post-type-name";
import { socialMediaPlatforms } from "@/lib/social-media-platforms";
import { useRouter, useSearchParams } from "next/navigation";
import { format, addDays, startOfWeek } from "date-fns";
import { useEffect, useState } from "react";

interface PostFiltersProps {
  brands: Brand[];
  currentDate: Date;
  onCurrentDateChange: (date: Date) => void;
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

  const handlePreviousWeek = () => {
    onCurrentDateChange(addDays(currentDate, -7));
  };

  const handleNextWeek = () => {
    onCurrentDateChange(addDays(currentDate, 7));
  };

  const handleToday = () => {
    onCurrentDateChange(new Date());
  };

  // Get the Monday of the current week
  const getMondayOfWeek = (date: Date) => {
    const monday = startOfWeek(date, { weekStartsOn: 1 });
    return monday;
  };

  return (
    <div className="grid md:grid-cols-4 lg:grid-cols-7 gap-2">
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
              socialMediaPlatforms.some((platform) => platform.id === media)
            )
            .map((media) => (
              <SelectItem key={media} value={media}>
                {
                  socialMediaPlatforms.find((platform) => platform.id === media)
                    ?.name
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

      <div className="flex items-center justify-end gap-2 md:col-span-4 lg:col-span-3">
        <div className="text-sm text-muted-foreground md:block hidden">
          {format(getMondayOfWeek(currentDate), "MMM yyyy")}
        </div>
        <Button variant="outline" size="icon" onClick={handlePreviousWeek}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          onClick={handleToday}
          className="flex-1 md:flex-none"
        >
          Today
        </Button>
        <Button variant="outline" size="icon" onClick={handleNextWeek}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
