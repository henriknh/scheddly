"use client";

import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { useEffect, useState } from "react";
import { PostWithRelations } from "@/app/api/post/types";
import { WeekdayCell } from "./WeekdayCell";
import { Brand } from "@/generated/prisma";
import { PostFilters } from "./PostFilters";
import { Header } from "../common/Header";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

interface WeeklyCalendarProps {
  posts?: PostWithRelations[];
  brands: Brand[];
  onDateSelect?: (date: Date) => void;
}

export function WeeklyCalendar({
  posts = [],
  brands,
  onDateSelect,
}: WeeklyCalendarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get the Monday of the current week
  const getMondayOfWeek = (date: Date) => {
    const monday = startOfWeek(date, { weekStartsOn: 1 });
    return monday;
  };

  // Generate dates: 1 week back + current week + 3 weeks forward = 5 weeks total
  const generateCalendarDates = () => {
    const monday = getMondayOfWeek(currentDate);
    const dates: Date[] = [];

    // Start 1 week back from the current week's Monday
    const startDate = addDays(monday, -7);

    // Generate 35 days (5 weeks * 7 days)
    for (let i = 0; i < 35; i++) {
      dates.push(addDays(startDate, i));
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
        {/* Week day headers */}
        <div className="grid grid-cols-7 gap-2 bg-card rounded-md">
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
        <div className="grid grid-cols-7 gap-2">
          {dates.map((date, index) => {
            const postsForDate = getPostsForDate(date);

            return (
              <WeekdayCell
                key={index}
                date={date}
                posts={postsForDate}
                onDateClick={handleDateClick}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
