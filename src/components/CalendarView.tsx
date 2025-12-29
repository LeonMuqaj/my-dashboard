"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palmtree, CalendarDays, Users, PartyPopper } from "lucide-react";

// Sample data - you can later connect this to your Zustand store or API
const workerVacations = [
  {
    id: 1,
    worker: "John Doe",
    startDate: new Date(2025, 11, 23),
    endDate: new Date(2025, 11, 27),
    color: "bg-blue-500",
    cssColor: "#3b82f6",
  },
  {
    id: 2,
    worker: "Jane Smith",
    startDate: new Date(2025, 11, 30),
    endDate: new Date(2026, 0, 3),
    color: "bg-purple-500",
    cssColor: "#a855f7",
  },
  {
    id: 3,
    worker: "Mike Johnson",
    startDate: new Date(2026, 0, 6),
    endDate: new Date(2026, 0, 10),
    color: "bg-cyan-500",
    cssColor: "#06b6d4",
  },
];

const officialHolidays = [
  {
    id: 1,
    name: "Christmas Eve",
    date: new Date(2025, 11, 24),
    color: "bg-red-500",
    cssColor: "#ef4444",
  },
  {
    id: 2,
    name: "Christmas Day",
    date: new Date(2025, 11, 25),
    color: "bg-red-500",
    cssColor: "#ef4444",
  },
  {
    id: 3,
    name: "New Year's Day",
    date: new Date(2026, 0, 1),
    color: "bg-red-500",
    cssColor: "#ef4444",
  },
  {
    id: 4,
    name: "Epiphany",
    date: new Date(2026, 0, 6),
    color: "bg-red-500",
    cssColor: "#ef4444",
  },
];

// Get vacation dates per worker for different colors
const getWorker1Dates = () => {
  const dates: Date[] = [];
  const vacation = workerVacations[0];
  const current = new Date(vacation.startDate);
  while (current <= vacation.endDate) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

const getWorker2Dates = () => {
  const dates: Date[] = [];
  const vacation = workerVacations[1];
  const current = new Date(vacation.startDate);
  while (current <= vacation.endDate) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

const getWorker3Dates = () => {
  const dates: Date[] = [];
  const vacation = workerVacations[2];
  const current = new Date(vacation.startDate);
  while (current <= vacation.endDate) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

// Get all holiday dates for highlighting
const getHolidayDates = () => {
  return officialHolidays.map((h) => h.date);
};

export default function CalendarView() {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    new Date()
  );

  const worker1Dates = getWorker1Dates();
  const worker2Dates = getWorker2Dates();
  const worker3Dates = getWorker3Dates();
  const holidayDates = getHolidayDates();

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
          <CalendarDays className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Calendar</h1>
          <p className="text-muted-foreground text-sm">
            Manage vacations, holidays & project timelines
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="vacations" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="vacations" className="flex items-center gap-2">
            <Palmtree className="h-4 w-4" />
            Vacations & Holidays
          </TabsTrigger>
        </TabsList>

        {/* Vacations & Holidays Tab */}
        <TabsContent value="vacations" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-2 rounded-xl border bg-card p-4 shadow-sm">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="w-full"
                modifiers={{
                  worker1: worker1Dates,
                  worker2: worker2Dates,
                  worker3: worker3Dates,
                  holiday: holidayDates,
                }}
                modifiersClassNames={{
                  worker1: "calendar-worker-1",
                  worker2: "calendar-worker-2",
                  worker3: "calendar-worker-3",
                  holiday: "calendar-holiday",
                }}
                numberOfMonths={2}
              />
            </div>

            {/* Legend & Lists */}
            <div className="flex flex-col gap-4">
              {/* Legend */}
              <div className="rounded-xl border bg-card p-4 shadow-sm">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-red-500"></span>
                  Legend
                </h3>
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded bg-blue-500"></span>
                    <span>John Doe</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded bg-purple-500"></span>
                    <span>Jane Smith</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded bg-cyan-500"></span>
                    <span>Mike Johnson</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 pt-1 border-t">
                    <span className="h-3 w-3 rounded bg-red-500"></span>
                    <span>Official Holiday</span>
                  </div>
                </div>
              </div>

              {/* Worker Vacations List */}
              <div className="rounded-xl border bg-card p-4 shadow-sm flex-1">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  Worker Vacations
                </h3>
                <div className="flex flex-col gap-2">
                  {workerVacations.map((vacation) => (
                    <div
                      key={vacation.id}
                      className="flex items-center gap-3 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${vacation.color}`}
                      ></span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {vacation.worker}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {vacation.startDate.toLocaleDateString()} -{" "}
                          {vacation.endDate.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Holidays List */}
              <div className="rounded-xl border bg-card p-4 shadow-sm flex-1">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <PartyPopper className="h-4 w-4 text-red-500" />
                  Official Holidays
                </h3>
                <div className="flex flex-col gap-2">
                  {officialHolidays.map((holiday) => (
                    <div
                      key={holiday.id}
                      className="flex items-center gap-3 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${holiday.color}`}
                      ></span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {holiday.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {holiday.date.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
