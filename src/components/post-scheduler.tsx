import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

interface PostSchedulerProps {
  onScheduleChange: (date: Date | undefined) => void;
}

export function PostScheduler({ onScheduleChange }: PostSchedulerProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    onScheduleChange(newDate);
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
            {date ? format(date, "PPP") : "Schedule post"}
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
