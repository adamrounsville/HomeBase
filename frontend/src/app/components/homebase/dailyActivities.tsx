"use client";

import { useState } from "react";
import { ActivityGroup, cn, Place } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Day = "Day 1" | "Day 2" | "Day 3";

interface DailyActivitiesProps {
  dailyPlans: Record<string, Place[]>;
  setDailyPlans: (plans: Record<string, Place[]>) => void;
  activityGroups: ActivityGroup[];
}

const DailyActivities = ({
  dailyPlans,
  setDailyPlans,
  activityGroups,
}: DailyActivitiesProps) => {
  const today = new Date();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [dates, setDates] = useState<Date[]>([today]);

  // Add activity to the selected date's daily plan
  const addToDailyPlan = (activity: Place) => {
    if (selectedDate) {
      const dateKey = format(selectedDate, "PPP");
      if (!dailyPlans[dateKey]?.some((a) => a.placeId === activity.placeId)) {
        setDailyPlans({
          ...dailyPlans,
          [dateKey]: [...(dailyPlans[dateKey] || []), activity],
        });
      }
      setIsDialogOpen(false); // Close dialog after adding
    }
  };

  const handleDateSelect = (date: Date) => {
    const formattedDate = format(date, "PPP");
    if (!dates!.some((d) => format(d, "PPP") === formattedDate)) {
      setDates([...dates!, date]);
      setDailyPlans({ ...dailyPlans, [formattedDate]: [] });
    }
    setSelectedDate(date);
  };

  // Remove activity from a specific day's plan
  const removeFromDailyPlan = (dateKey: string, activityId: string) => {
    setDailyPlans({
      ...dailyPlans,
      [dateKey]: dailyPlans[dateKey].filter((a) => a.placeId !== activityId),
    });
  };

  function DatePickerDemo({
    onDateSelect,
  }: {
    onDateSelect: (date: Date) => void;
  }) {
    const [date, setDate] = useState<Date | undefined>();

    const handleDateSelect = (selectedDate: Date | undefined) => {
      if (selectedDate) {
        setDate(selectedDate);
        onDateSelect(selectedDate);
      }
    };

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[150px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <div className="daily-schedule-container p-4 bg-white shadow-md rounded-lg max-w-[1000px]">
      {/* Header with title, date picker, add button, and selected dates */}
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between items-center mb-4">
        {/* Title and Date Picker */}
        <div className="flex items-center space-x-4">
          <h2 className="text-dark text-xl font-semibold">Daily Plan</h2>
          <DatePickerDemo onDateSelect={handleDateSelect} />
        </div>

        {/* Selected Dates */}
        <div className="flex space-x-2 overflow-x-auto">
          {dates!.map((date) => {
            const dateKey = format(date, "PPP");
            const isSelected =
              selectedDate && format(selectedDate, "PPP") === dateKey;

            const handleDeleteDate = (dateToDelete: Date) => {
              setDates(dates.filter((d) => d !== dateToDelete));
              if (
                selectedDate &&
                format(selectedDate, "PPP") === format(dateToDelete, "PPP")
              ) {
                setSelectedDate(today);
              }
            };

            return (
              <div key={dateKey} className="relative p-2">
                <Button
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => setSelectedDate(date)}
                  className={`max-w-[200px] ${
                    isSelected
                      ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 shadow-lg"
                      : "text-black"
                  } flex items-center justify-center`}
                >
                  {dateKey}
                </Button>
                <button
                  onClick={() => handleDeleteDate(date)}
                  className="absolute top-0 right-0 bg-black text-white rounded-full p-1 hover:bg-red-600 z-10"
                  style={{
                    transform: "translate(50%, 10%)", // Increased downward shift
                    fontSize: "10px",
                    lineHeight: "0.5",
                  }}
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>

        {/* Add to Daily Plan Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              Add to Daily Plan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select an Activity to Add</DialogTitle>
            </DialogHeader>

            {/* Scrollable Activity Groups */}
            <div className="overflow-y-auto max-h-[400px]">
              {activityGroups.map((group) => (
                <div key={group.id} className="activity-group mb-4">
                  <h4 className="font-semibold text-lg text-gray-700">
                    {group.title}
                  </h4>
                  {group.activities.length > 0 ? (
                    group.activities.map((activity) => (
                      <div
                        key={activity.placeId}
                        className="activity-item p-2 bg-gray-200 rounded-lg mt-2 transition-shadow hover:shadow-lg"
                      >
                        <h5 className="text-xs font-medium text-gray-800">
                          {activity.name}
                        </h5>
                        <p className="text-[10px] text-gray-600">
                          {activity.address}
                        </p>
                        <Button
                          className="mt-2 bg-blue-500 text-white hover:bg-blue-600 text-xs px-2 py-1"
                          onClick={() => addToDailyPlan(activity)}
                        >
                          Add to Plan
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500">
                      No activities in this group.
                    </p>
                  )}
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Divider */}
      <hr className="my-4 border-gray-300" />

      {/* Container for Activities */}
      <div className="activities-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-[150px] bg-gray-50 border border-gray-200 rounded-lg p-4">
        {/* Displaying activities for the selected date */}
        {selectedDate && dailyPlans[format(selectedDate, "PPP")]?.length > 0 ? (
          dailyPlans[format(selectedDate, "PPP")].map((activity) => (
            <div
              key={activity.placeId}
              className="daily-plan-item bg-white shadow-sm rounded-lg p-3 mb-2"
            >
              <h3 className="text-sm font-medium text-gray-800">
                {activity.name}
              </h3>
              <p className="text-xs text-gray-600">{activity.address}</p>

              <button
                className="text-red-500 text-xs hover:underline mt-2"
                onClick={() =>
                  removeFromDailyPlan(
                    format(selectedDate, "PPP"),
                    activity.placeId!
                  )
                }
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">
            No activities added for{" "}
            {selectedDate ? format(selectedDate, "PPP") : "this date"} yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default DailyActivities;
