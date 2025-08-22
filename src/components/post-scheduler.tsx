import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface PostSchedulerProps {
  initialDate?: Date | null;
  onScheduleChange: (date: Date | null) => void;
}

export function PostScheduler({
  initialDate,
  onScheduleChange,
}: PostSchedulerProps) {
  const [date, setDate] = useState<Date | null>(
    initialDate ? new Date(initialDate) : null
  );
  const [hour, setHour] = useState<string>(date ? format(date, "HH") : "12");
  const [minute, setMinute] = useState<string>(
    date ? format(date, "mm") : "00"
  );

  const params = useSearchParams();
  const dateParam = params.get("date");

  useEffect(() => {
    if (dateParam) {
      setDate(new Date(dateParam));
      // TODO: Delete search param date
    }
  }, [dateParam]);

  const handleDateSelect = (newDate: Date | null | undefined) => {
    if (newDate) {
      const currentDate = new Date(newDate);
      currentDate.setHours(parseInt(hour), parseInt(minute));
      setDate(currentDate);
      onScheduleChange(currentDate);
    } else {
      setDate(null);
      onScheduleChange(null);
    }
  };

  const handleTimeChange = (newHour: string, newMinute: string) => {
    setHour(newHour);
    setMinute(newMinute);
    const newDate = date ? new Date(date) : new Date();
    newDate.setHours(parseInt(newHour), parseInt(newMinute));
    setDate(newDate);
    onScheduleChange(newDate);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap gap-y-1">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP HH:mm") : "Schedule post"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date ?? undefined}
            onSelect={handleDateSelect}
            initialFocus
            disabled={(date) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return date < today;
            }}
          />
          <div className="flex items-center justify-center gap-2 p-3 border-t">
            <Select
              value={hour}
              onValueChange={(value) => {
                handleTimeChange(value, minute);
              }}
            >
              <SelectTrigger className="w-[65px]">
                <SelectValue placeholder="Hour" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 24 }, (_, i) =>
                  i.toString().padStart(2, "0")
                ).map((h) => (
                  <SelectItem key={h} value={h}>
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={minute}
              onValueChange={(value) => {
                handleTimeChange(hour, value);
              }}
            >
              <SelectTrigger className="w-[65px]">
                <SelectValue placeholder="Min" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 60 }, (_, i) =>
                  i.toString().padStart(2, "0")
                )
                  .filter((m) => parseInt(m) % 5 === 0)
                  .map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </PopoverContent>
      </Popover>
      {date && (
        <Button variant="ghost" onClick={() => handleDateSelect(null)}>
          Post now instead
        </Button>
      )}
    </div>
  );
}
