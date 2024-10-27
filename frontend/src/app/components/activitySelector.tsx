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
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ActivityGroup, Place } from "@/lib/utils";
import { Props } from "next/script";
interface props {
  activityGroups: ActivityGroup[];
  setActivityGroups: (activityGroups: ActivityGroup[]) => void;
}

const ActivitySelector = ({ activityGroups, setActivityGroups }: props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // State to track new activity input
  const [newActivityTitle, setNewActivityTitle] = useState("");

  // State to track the currently open group
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  // Function to toggle group dropdown
  const toggleGroup = (id: string) => {
    setOpenGroup((prevOpenGroup) => (prevOpenGroup === id ? null : id));
  };

  // Old functionality unsure if we will need to refactor to this old version later on so keep for now ??
  // // Function to handle adding new activity group
  // const handleAddActivity = () => {
  //   if (newActivityTitle.trim()) {
  //     const newItem = new ActivityGroup(
  //       `group-${activityGroups.length + 1}`,
  //       newActivityTitle,
  //       []
  //     );
  //     setActivityGroups([...activityGroups, newItem]);
  //     setNewActivityTitle("");
  //     setIsDialogOpen(false);
  //   }
  // };

  // Function to handle adding a new activity group
  const handleAddActivity = () => {
    if (newActivityTitle.trim()) {
      const newItem = new ActivityGroup(
        `group-${activityGroups.length + 1}`,
        newActivityTitle,
        []
      );
      // Ensure newItem is an instance of ActivityGroup
      setActivityGroups([...activityGroups, newItem]);
      setNewActivityTitle("");
      setIsDialogOpen(false);
    }
  };

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
              group.activities.filter((_, index) => index !== activityIndex)
            )
          : group
      )
    );
  };
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
              <DialogTitle>Add a New Activity Group</DialogTitle>
              <DialogDescription>
                Please enter the title of your new Activity Group.
              </DialogDescription>
              <Input
                value={newActivityTitle}
                onChange={(e) => setNewActivityTitle(e.target.value)}
                placeholder="Enter activity title"
              />
              <Button onClick={handleAddActivity}>Create</Button>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      <div className="activity-list">
        {activityGroups.map((group) => (
          <div key={group.id} className="activity-group">
            <div className="group-header" onClick={() => toggleGroup(group.id)}>
              <span className="group-title">{group.title}</span>
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
                  <DropdownMenuItem>Add to Map</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {openGroup === group.id && (
              <div className="activity-items-container space-y-4 pt-2">
                {group.activities.map((activity, index) => (
                  <div
                    key={index}
                    className="activity-item relative bg-gray-100 border border-gray-300 p-4 rounded-lg shadow-sm"
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
                          <DropdownMenuItem
                            onClick={() =>
                              handleRemoveActivity(group.id, index)
                            }
                          >
                            Remove
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Add To Daily Plan</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <h1 className="text-sm text-gray-600 mb-4">
                      {activity.Address}
                    </h1>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};
export default ActivitySelector;
