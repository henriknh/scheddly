"use client";

import { PostWithRelations } from "@/app/api/post/types";
import { Brand } from "@/generated/prisma";
import { addDays, format, isSameDay } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PostFilters } from "./PostFilters";
import { WeekdayCell } from "./WeekdayCell";

interface WeeklyCalendarProps {
  posts?: PostWithRelations[];
  brands: Brand[];
  onDateSelect?: (date: Date) => void;
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

export function WeeklyCalendar({
  posts = [],
  brands,
  onDateSelect,
}: WeeklyCalendarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentDate, setCurrentDate] = useState(new Date());
  const screenSize = useScreenSize();

  // Generate dates based on screen size
  const generateCalendarDates = () => {
    const dates: Date[] = [];
    const today = new Date();

    if (screenSize === "mobile") {
      // Mobile (<640px): 1 day back + 7 days forward (8 days total)
      const startDate = addDays(today, -1);
      for (let i = 0; i < 8; i++) {
        dates.push(addDays(startDate, i));
      }
    } else if (screenSize === "tablet") {
      // Tablet (<1024px): 2-3 days back + 13-14 days forward (16 days total)
      const startDate = addDays(today, -2);
      for (let i = 0; i < 16; i++) {
        dates.push(addDays(startDate, i));
      }
    } else {
      // Desktop (≥1024px): 7-13 days back + good number forward (21 days total)
      const startDate = addDays(today, -7 - new Date().getDay() + 1);
      for (let i = 0; i < 7 * 4; i++) {
        dates.push(addDays(startDate, i));
      }
    }

    return dates;
  };

  const dates = generateCalendarDates();
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const handleDateClick = (date: Date) => {
    onDateSelect?.(date);
  };

  const getPostsForDate = (date: Date) => {
    return posts.filter((post) => {
      if (post.scheduledAt) {
        return isSameDay(new Date(post.scheduledAt), date);
      } else {
        return isSameDay(new Date(post.updatedAt), date);
      }
    });
  };

  useEffect(() => {
    const newDateFrom = format(dates[0], "yyyy-MM-dd");
    const newDateTo = format(dates[dates.length - 1], "yyyy-MM-dd");

    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    if (dateFrom !== newDateFrom || dateTo !== newDateTo) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("dateFrom", newDateFrom);
      params.set("dateTo", newDateTo);
      router.push(`?${params.toString()}`);
    }
  }, [dates, router, searchParams]);

  return (
    <div className="space-y-4">
      <PostFilters
        brands={brands}
        currentDate={currentDate}
        onCurrentDateChange={setCurrentDate}
      />
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
                onDateClick={handleDateClick}
                screenSize={screenSize}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
