import { format } from "date-fns";

export function formatDateToString(date: Date) {
  const isLessThanOneMinuteAgo = new Date().getTime() - date.getTime() < 60000;
  if (isLessThanOneMinuteAgo) {
    const secondsAgo = Math.floor(
      (new Date().getTime() - date.getTime()) / 1000
    );
    return `${secondsAgo}s ago`;
  }

  const isLessThanOneHourAgo = new Date().getTime() - date.getTime() < 3600000;
  if (isLessThanOneHourAgo) {
    const minutesAgo = Math.floor(
      (new Date().getTime() - date.getTime()) / 60000
    );
    return `${minutesAgo}m ago`;
  }

  const isLessThanOneDayAgo = new Date().getTime() - date.getTime() < 86400000;
  if (isLessThanOneDayAgo) {
    const hoursAgo = Math.floor(
      (new Date().getTime() - date.getTime()) / 3600000
    );
    return `${hoursAgo}h ago`;
  }

  return format(new Date(date), "MMM d, yyyy");
}
