import { getLastDatePeriodFromToday } from "@/lib/date";
import { subMonths, subDays } from "date-fns";

export default {
  lastPostFilterValues: [
    {
      label: "Last week",
      value: "last-week",
      period: getLastDatePeriodFromToday(subDays(new Date(), 7)),
    },
    {
      label: "Last month",
      value: "last-month",
      period: getLastDatePeriodFromToday(subMonths(new Date(), 1)),
    },
    {
      label: "Last 6 months",
      value: "last-6-months",
      period: getLastDatePeriodFromToday(subMonths(new Date(), 6)),
    },
  ],
};
