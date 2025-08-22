"use client";

import { PostWithRelations } from "@/app/api/post/types";
import { Brand } from "@/generated/prisma";
import { useScreenSize } from "@/hooks/use-screen-size";
import { addDays, format, isSameDay, subDays } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PostFilters } from "./PostFilters";
import { WeekdayCell } from "./WeekdayCell";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";
import { ChevronRight } from "lucide-react";

interface WeeklyCalendarProps {
  posts?: PostWithRelations[];
  brands: Brand[];
}

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function WeeklyCalendar({ posts = [], brands }: WeeklyCalendarProps) {
  const searchParams = useSearchParams();
  const screenSize = useScreenSize();
  const router = useRouter();

  const viewIsXDaysWide = useMemo(() => {
    if (screenSize === "mobile") {
      return 1;
    } else if (screenSize === "tablet") {
      return 2;
    } else {
      return 7;
    }
  }, [screenSize]);

  const getNumberOfDaysBackward = useMemo(() => {
    if (screenSize === "mobile") {
      return -1;
    } else if (screenSize === "tablet") {
      return -2;
    } else {
      return -7 - new Date().getDay() + 1;
    }
  }, [screenSize]);

  const getNumberOfDaysForward = useMemo(() => {
    if (screenSize === "mobile") {
      return 7;
    } else if (screenSize === "tablet") {
      return 13;
    } else {
      return 7 - new Date().getDay() + 14;
    }
  }, [screenSize]);

  const [currentDate, setCurrentDate] = useState<Date>(() => {
    const currentDate = searchParams.get("currentDate");
    if (currentDate) {
      return new Date(currentDate);
    }
    return new Date();
  });

  const updateQueryParams = useCallback(
    (params: Record<string, string | null | undefined>) => {
      const newParams = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          newParams.set(key, value);
        } else {
          newParams.delete(key);
        }
      });
      router.push(`?${newParams.toString()}`);
    },
    [router, searchParams]
  );

  useEffect(() => {
    updateQueryParams({
      currentDate: format(currentDate, "yyyy-MM-dd"),
    });
  }, [currentDate, router, searchParams, updateQueryParams]);

  const dates = useMemo(() => {
    const dates: Date[] = [];

    for (let i = getNumberOfDaysBackward; i <= getNumberOfDaysForward; i++) {
      dates.push(addDays(currentDate, i));
    }

    return dates;
  }, [currentDate, getNumberOfDaysBackward, getNumberOfDaysForward]);

  useEffect(() => {
    if (screenSize === "desktop") {
      if (dates[0].getDay() !== 1) {
        setCurrentDate(subDays(currentDate, dates[0].getDay() - 1));
      }
    }
  }, [dates, screenSize, currentDate]);

  const getPostsForDate = (date: Date) => {
    return posts.filter((post) => {
      if (post.scheduledAt) {
        return isSameDay(new Date(post.scheduledAt), date);
      } else {
        return isSameDay(new Date(post.updatedAt), date);
      }
    });
  };

  const handleToday = useCallback(() => {
    const newDate = new Date();

    setCurrentDate(newDate);
    updateQueryParams({
      currentDate: format(newDate, "yyyy-MM-dd"),
    });
  }, [updateQueryParams]);

  const handlePrevious = useCallback(() => {
    const newDate = addDays(currentDate, -viewIsXDaysWide);

    setCurrentDate(newDate);
    updateQueryParams({
      currentDate: format(newDate, "yyyy-MM-dd"),
    });
  }, [currentDate, updateQueryParams, viewIsXDaysWide]);

  const handleNext = useCallback(() => {
    const newDate = addDays(currentDate, viewIsXDaysWide);

    setCurrentDate(newDate);
    updateQueryParams({
      currentDate: format(newDate, "yyyy-MM-dd"),
    });
  }, [currentDate, updateQueryParams, viewIsXDaysWide]);

  return (
    <div className="space-y-4">
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

        <PostFilters brands={brands} />
      </div>

      <div className="space-y-2">
        {/* Week day headers - only show on desktop */}
        <div className="grid-cols-7 gap-2 bg-card rounded-md hidden lg:grid">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-muted-foreground py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-2">
          {dates.map((date, index) => {
            const postsForDate = getPostsForDate(date);

            return (
              <WeekdayCell
                key={index}
                date={date}
                posts={postsForDate}
                screenSize={screenSize}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
