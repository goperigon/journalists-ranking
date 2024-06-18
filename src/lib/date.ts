import { subDays, format } from "date-fns";

export function getLastDatePeriodFromToday(previousDate: Date): {
  from: string;
  to: string;
} {
  // Get the current date
  const today = new Date();

  const datePeriod = {
    from: format(previousDate, "yyyy-MM-dd"),
    to: format(today, "yyyy-MM-dd"), // Format today's date
  };

  return datePeriod;
}
