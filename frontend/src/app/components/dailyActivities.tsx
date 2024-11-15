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
import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

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

  function DatePickerDemo({ onDateSelect }: { onDateSelect: (date: Date) => void }) {
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
            "w-[280px] justify-start text-left font-normal",
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
    )
  }

  return (
    <div className=" daily-schedule-container p-4 bg-white shadow-md rounded-lg max-w-[800px]">
      <div className="flex space-x-4 mb-4 justify-between">
        <div className="flex space-x-4">
          <h2 className="text-dark text-xl font-semibold mb-2">Daily Plan</h2>
          <DatePickerDemo onDateSelect={handleDateSelect}/>
        </div>

        <div className="justify-between">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsDialogOpen(true)} className="w-full">
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
                          className="activity-item p-3 bg-gray-200 rounded-lg mt-2 transition-shadow hover:shadow-lg"
                        >
                          <h5 className="text-sm font-medium text-gray-800">
                            {activity.name}
                          </h5>
                          <p className="text-xs text-gray-600">
                            {activity.address}
                          </p>
                          <Button
                            className="mt-2 bg-blue-500 text-white hover:bg-blue-600"
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
       
      </div>
      <hr className="my-4 border-gray-300" />
      {/* Date Selector */}
      <div className="flex space-x-4 mb-4 overflow-x-auto m4 pt-1">
        {dates!.map((date) => {
            const dateKey = format(date, "PPP");
            const isSelected = selectedDate && format(selectedDate, "PPP") === dateKey;

            const handleDeleteDate = (dateToDelete: Date) => {
              setDates(dates.filter((d) => d !== dateToDelete));
              // If the deleted date is the selected date, reset the selection
              if (selectedDate && format(selectedDate, "PPP") === format(dateToDelete, "PPP")) {
                setSelectedDate(today);
              }
            };
            return (
              <div key={dateKey} className="relative">
                <Button
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => setSelectedDate(date)}
                  className={`flex-1 max-w-[200px] ${
                    isSelected ? "bg-blue-500 text-white" : "text-blue-500"
                  } flex items-center justify-center`}
                >
                  {dateKey}
                </Button>
               
                  {/* "X" Button to delete the date */}
                  <button
                    onClick={() => handleDeleteDate(date)}
                    className="absolute top-0 right-0 -mt-1 -mr-1 bg-black text-white rounded-full p-1 hover:bg-red-600 z-10"
                    style={{ fontSize: "10px", lineHeight: "0.5" }}
                  >
                    ✕
                  </button>
              </div>
            );
          })}
      </div>

      {/* Display Daily Plan Activities for Selected Date */}
      <div className="daily-plan-list mb-6 h-40 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
      {selectedDate && dailyPlans[format(selectedDate, "PPP")]?.length > 0 ? (
          dailyPlans[format(selectedDate, "PPP")].map((activity) => (
            <div
              key={activity.placeId}
              className="daily-plan-item bg-white shadow-sm rounded-lg p-4 mb-2"
            >
              <h3 className="text-lg font-medium text-gray-800">
                {activity.name}
              </h3>
              <p className="text-sm text-gray-600">{activity.address}</p>

              <button
                className="text-red-500 text-sm hover:underline mt-2"
                onClick={() =>
                  removeFromDailyPlan(format(selectedDate, "PPP"), activity.placeId!)
                }
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">
            No activities added for {selectedDate ? format(selectedDate, "PPP") : "this date"} yet.
          </p>
        )}
      </div>

      {/* Button to open the Add to Daily Plan modal */}
      
    </div>
  );
};

export default DailyActivities;
