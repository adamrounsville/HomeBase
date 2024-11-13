"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ActivityGroup, Place } from "@/lib/utils";
import { HexColorPicker } from "react-colorful";

interface props {
  activityGroups: ActivityGroup[];
  openGroup: string | null;
  selectedActivity: number | null;
  setActivityGroups: (activityGroups: ActivityGroup[]) => void;
  addToDailyPlan: (activity: Place) => void; // New prop
  setOpenGroup: (group: any) => void;
  setSelectedActivity: (activityId:number) => void;
  
}
//  https://codesandbox.io/p/sandbox/react-colorful-demo-u5vwp?file=%2Fsrc%2FApp.js

const ActivitySelector = ({ activityGroups, openGroup, addToDailyPlan,selectedActivity, setActivityGroups, setOpenGroup, setSelectedActivity}: props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newActivityTitle, setNewActivityTitle] = useState("");
  const [color, setColor] = useState("#b32aa9");

  // Function to toggle group dropdown
  const toggleGroup = (id: string) => {
    setOpenGroup((prevOpenGroup: string) => (prevOpenGroup === id ? null : id));
  };

  // Function to handle adding a new activity group
  const handleAddActivity = () => {
    if (newActivityTitle.trim()) {
      const newItem = new ActivityGroup(
        `group-${activityGroups.length + 1}`,
        newActivityTitle,
        [],
        color
      );

      setActivityGroups([...activityGroups, newItem]);
      setNewActivityTitle("");
      setIsDialogOpen(false);
    }
  };

  const handleSelectActivity = (index: number) =>{
    if(index != selectedActivity){
      setSelectedActivity(index);
    }
  }

  // Function to handle removing an activity group
  const handleRemoveActivityGroup = (groupId: string) => {
    setActivityGroups(activityGroups.filter((group) => group.id !== groupId));
  };

  // Function to handle removing an activity from a specific group
  const handleRemoveActivity = (groupId: string, activityIndex: number) => {
    setActivityGroups(
      activityGroups.map((group) =>
        group.id === groupId
          ? new ActivityGroup(
              group.id,
              group.title,
              group.activities.filter((_, index) => index !== activityIndex),
              group.color
            )
          : group
      )
    );
  };
  const StopPropagationWrapper = ({ children }: { children: React.ReactNode }) => (
    <div onClick={(e) => e.stopPropagation()}>{children}</div>
  );

  return (
    <>
      <div className="activity-selector-header">
        <h2 className="activity-title">Activities</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger>
            <i
              className="fas fa-plus"
              onClick={() => setIsDialogOpen(true)}
            ></i>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <div className = "homebase-modal-div">
                <DialogTitle>Add a New Activity Group</DialogTitle>
                <DialogDescription>
                  Please enter the title of your new Activity Group.
                </DialogDescription>
                <Input
                  value={newActivityTitle}
                  onChange={(e) => setNewActivityTitle(e.target.value)}
                  placeholder="Enter activity title"
                />
              </div>
              <div className = "homebase-modal-div">
                <DialogTitle>Select an Activity Group Color</DialogTitle>
                <div className="homebase-modal-div">
                  <HexColorPicker color={color} onChange={setColor} />
                  <div className="value" style={{ borderColor: color }}>
                    Current color {color}
                  </div>
                </div>
              </div>
              <Button onClick={handleAddActivity}>Create</Button>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      <div className="activity-list">
        {activityGroups.map((group) => (
          <div key={group.id} className="activity-group duration-200 ease-in-out hover:shadow-lg hover:scale-105">
            <div className="group-header" onClick={() => toggleGroup(group.id)}>
              <span className="group-title">{group.title}</span>
              <Popover>
              <StopPropagationWrapper>
                <PopoverTrigger className="value-button" style={{ backgroundColor: group.color }} />
              </StopPropagationWrapper>
                  <PopoverContent>Edit Activity Group Color
                    <div className="homebase-modal-div"  onClick={(e) => e.stopPropagation()}>
                        <HexColorPicker color={group.color} onChange={setColor} />
                    </div>
                    <Button onClick={(e) => e.stopPropagation()}>Save Color</Button>
                  </PopoverContent>
                  
              </Popover>
              {/* <button className="value-button" style={{ backgroundColor: group.color }}/> */}
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <i className="fa-solid fa-ellipsis group-options"></i>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => handleRemoveActivityGroup(group.id)}
                  >
                    Delete Group
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Open / Close</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {openGroup === group.id && (
              <div className="activity-items-container space-y-4 pt-2">
                {group.activities.length === 0 ? (
                  <div className="no-items-message">
                  Add a location to this activity group.
                  </div>
                ) : (
                  group.activities.map((activity, index) => (
                    <div
                      key={index}
                      className="activity-item relative bg-gray-100 border border-gray-300 p-4 rounded-lg shadow-sm duration-200 ease-in-out hover:bg-gray-200 hover:shadow-lg hover:scale-105"
                      onClick={() => handleSelectActivity(index)}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-semibold text-gray-800">
                          {activity.Name}
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <i className="fa-solid fa-ellipsis cursor-pointer text-gray-500 absolute top-2 right-3"></i>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleRemoveActivity(group.id, index)}>
                              Remove
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => addToDailyPlan(activity)}>
                              Add To Daily Plan
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <h1 className="text-sm text-gray-600 mb-4">{activity.Address}</h1>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default ActivitySelector;
