"use client";

import { useState } from "react";
import { ActivityGroup, Place } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Day = "Day 1" | "Day 2" | "Day 3";

interface DailyActivitiesProps {
  dailyPlans: Record<Day, Place[]>;
  setDailyPlans: (plans: Record<Day, Place[]>) => void;
  activityGroups: ActivityGroup[];
}

const DailyActivities = ({
  dailyPlans,
  setDailyPlans,
  activityGroups,
}: DailyActivitiesProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Day>("Day 1");

  // Add activity to the selected date's daily plan
  const addToDailyPlan = (activity: Place) => {
    if (
      !dailyPlans[selectedDate].some((a) => a.Place_ID === activity.Place_ID)
    ) {
      setDailyPlans({
        ...dailyPlans,
        [selectedDate]: [...dailyPlans[selectedDate], activity],
      });
    }
    setIsDialogOpen(false); // Close dialog after adding
  };

  // Remove activity from a specific day's plan
  const removeFromDailyPlan = (date: Day, activityId: string) => {
    setDailyPlans({
      ...dailyPlans,
      [date]: dailyPlans[date].filter((a) => a.Place_ID !== activityId),
    });
  };

  return (
    <div className="daily-activities p-4 bg-white shadow-md rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Daily Plan</h3>

      {/* Date Selector */}
      <div className="flex space-x-4 mb-4">
        {(["Day 1", "Day 2", "Day 3"] as Day[]).map((day) => (
          <Button
            key={day}
            variant={selectedDate === day ? "default" : "outline"}
            onClick={() => setSelectedDate(day)}
            className={`flex-1 ${
              selectedDate === day ? "bg-blue-500 text-white" : "text-blue-500"
            }`}
          >
            {day}
          </Button>
        ))}
      </div>

      {/* Display Daily Plan Activities for Selected Date */}
      <div className="daily-plan-list mb-6 h-40 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
        {dailyPlans[selectedDate].length > 0 ? (
          dailyPlans[selectedDate].map((activity) => (
            <div
              key={activity.Place_ID}
              className="daily-plan-item bg-white shadow-sm rounded-lg p-4 mb-2 "
            >
              <h3 className="text-lg font-medium text-gray-800">
                {activity.Name}
              </h3>
              <p className="text-sm text-gray-600">{activity.Address}</p>

              <button
                className="text-red-500 text-sm hover:underline mt-2"
                onClick={() =>
                  removeFromDailyPlan(selectedDate, activity.Place_ID!)
                }
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">
            No activities added to {selectedDate} yet.
          </p>
        )}
      </div>

      {/* Button to open the Add to Daily Plan modal */}
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
          <div className="activity-groups overflow-y-auto max-h-[400px]">
            {activityGroups.map((group) => (
              <div key={group.id} className="activity-group mb-4">
                <h4 className="font-semibold text-lg text-gray-700">
                  {group.title}
                </h4>
                {group.activities.length > 0 ? (
                  group.activities.map((activity) => (
                    <div
                      key={activity.Place_ID}
                      className="activity-item p-3 bg-gray-200 rounded-lg mt-2 transition-shadow hover:shadow-lg"
                    >
                      <h5 className="text-sm font-medium text-gray-800">
                        {activity.Name}
                      </h5>
                      <p className="text-xs text-gray-600">
                        {activity.Address}
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
  );
};

export default DailyActivities;
