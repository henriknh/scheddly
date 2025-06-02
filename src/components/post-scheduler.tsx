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
import { useState } from "react";

interface PostSchedulerProps {
  initialDate?: Date | null;
  onScheduleChange: (date: Date | undefined) => void;
}

export function PostScheduler({
  initialDate,
  onScheduleChange,
}: PostSchedulerProps) {
  const [date, setDate] = useState<Date | undefined>(
    initialDate ? new Date(initialDate) : undefined
  );
  const [hour, setHour] = useState<string>(date ? format(date, "h") : "12");
  const [minute, setMinute] = useState<string>(
    date ? format(date, "mm") : "00"
  );
  const [period, setPeriod] = useState<string>(date ? format(date, "a") : "am");

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      const currentDate = new Date(newDate);
      currentDate.setHours(
        period === "pm" ? (parseInt(hour) % 12) + 12 : parseInt(hour) % 12,
        parseInt(minute)
      );
      setDate(currentDate);
      onScheduleChange(currentDate);
    } else {
      setDate(undefined);
      onScheduleChange(undefined);
    }
  };

  const handleTimeChange = (
    newHour: string,
    newMinute: string,
    newPeriod: string
  ) => {
    setHour(newHour);
    setMinute(newMinute);
    setPeriod(newPeriod);
    if (date) {
      const newDate = new Date(date);
      newDate.setHours(
        newPeriod === "pm"
          ? (parseInt(newHour) % 12) + 12
          : parseInt(newHour) % 12,
        parseInt(newMinute)
      );
      setDate(newDate);
      onScheduleChange(newDate);
    }
  };

  return (
    <div className="flex items-center gap-2">
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
            {date ? format(date, "PPP p") : "Schedule post"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
            disabled={(date) => date < new Date()}
          />
          <div className="flex items-center gap-2 p-3 border-t">
            <Select
              value={hour}
              onValueChange={(value) => {
                handleTimeChange(value, minute, period);
              }}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder="Hour" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                  <SelectItem key={h} value={h.toString()}>
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={minute}
              onValueChange={(value) => {
                handleTimeChange(hour, value, period);
              }}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder="Min" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 60 }, (_, i) =>
                  i.toString().padStart(2, "0")
                ).map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={period}
              onValueChange={(value) => {
                handleTimeChange(hour, minute, value);
              }}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder="AM/PM" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="am">AM</SelectItem>
                <SelectItem value="pm">PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </PopoverContent>
      </Popover>
      {date && (
        <Button variant="ghost" onClick={() => handleDateSelect(undefined)}>
          Post now instead
        </Button>
      )}
    </div>
  );
}
