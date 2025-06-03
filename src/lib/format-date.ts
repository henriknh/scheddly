import { format } from "date-fns";

export function formatDateAgo(date: Date) {
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

export function formatDate(date: Date) {
  return format(date, "MMM d, yyyy");
}

export function formatDateTime(date: Date) {
  return format(date, "MMM d, yyyy HH:mm");
}

export function formatDateIn(date: Date) {
  const inLessThanOneMinute = date.getTime() - new Date().getTime() < 60000;
  if (inLessThanOneMinute) {
    const inSeconds = Math.floor(
      (date.getTime() - new Date().getTime()) / 1000
    );
    if (inSeconds === 0) {
      return "In a few seconds";
    }
    return `In ${inSeconds}s`;
  }

  const isLessThanOneHour = date.getTime() - new Date().getTime() < 3600000;
  if (isLessThanOneHour) {
    const isMinutes = Math.floor(
      (date.getTime() - new Date().getTime()) / 60000
    );

    return `In ${isMinutes}m`;
  }

  const isLessThanOneDay = date.getTime() - new Date().getTime() < 86400000;
  if (isLessThanOneDay) {
    const isHours = Math.floor(
      (date.getTime() - new Date().getTime()) / 3600000
    );

    return `In ${isHours}h`;
  }

  const yearIsDifferent = date.getFullYear() !== new Date().getFullYear();
  if (yearIsDifferent) {
    return format(date, "MMM d, yyyy");
  }

  return format(date, "MMM d");
}
