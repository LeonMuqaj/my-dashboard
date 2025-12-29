"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";

interface Props {
  startDate: string;
  endDate: string;
}

// Get all dates between start and end for highlighting
const getDateRange = (startISO: string, endISO: string): Date[] => {
  const dates: Date[] = [];
  const start = new Date(startISO);
  const end = new Date(endISO);
  const current = new Date(start);

  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
};

export default function ProjectDetailCalendar({ startDate, endDate }: Props) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Selected range for the calendar
  const [selectedRange] = React.useState<DateRange>({
    from: start,
    to: end,
  });

  // Get all dates in the project range for highlighting
  const projectDates = getDateRange(startDate, endDate);

  // Calculate number of months to display based on project duration
  const monthsDiff =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());
  const numberOfMonths = Math.min(Math.max(monthsDiff + 1, 2), 3);

  return (
    <div className="flex flex-col gap-6">
      {/* Calendar */}
      <div className="flex justify-center">
        <Calendar
          mode="range"
          selected={selectedRange}
          className="rounded-xl border bg-card p-4 shadow-sm"
          classNames={{
            range_start: "calendar-project-violet",
            range_middle: "calendar-project-violet",
            range_end: "calendar-project-violet",
          }}
          numberOfMonths={numberOfMonths}
          defaultMonth={start}
        />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded bg-gradient-to-r from-violet-500 to-purple-600"></span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Project Duration
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-full border-2 border-violet-500 bg-transparent"></span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Start/End Date
          </span>
        </div>
      </div>
    </div>
  );
}
