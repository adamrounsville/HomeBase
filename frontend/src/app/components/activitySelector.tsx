"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ActivityGroup, Place } from "@/lib/utils";
import { Props } from "next/script";
  interface props {
    activityGroups: ActivityGroup[]
    setActivityGroups: (activityGroups: ActivityGroup[]) => void;
  }

  const ActivitySelector = ({activityGroups, setActivityGroups}: props) => {


      const [isDialogOpen, setIsDialogOpen] = useState(false);
    
      // State to track new activity input
      const [newActivityTitle, setNewActivityTitle] = useState('');
    
      // State to track the currently open group
      const [openGroup, setOpenGroup] = useState<string | null>(null);
    
      // Function to toggle group dropdown
      const toggleGroup = (id: string) => {
        setOpenGroup((prevOpenGroup) => (prevOpenGroup === id ? null : id));
      };
    
      // Function to handle adding new activity group
      const handleAddActivity = () => {
        if (newActivityTitle.trim()) {
          const newItem = new ActivityGroup(
            `group-${activityGroups.length + 1}`,
            newActivityTitle,
            []
          );
          setActivityGroups([...activityGroups, newItem]);
          setNewActivityTitle(''); 
          setIsDialogOpen(false);
        }
      };
    
    return (
        <>  
            <div className="activity-selector-header">
                <h2 className="activity-title">Activities</h2>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger><i className="fas fa-plus" onClick={() => setIsDialogOpen(true)}></i></DialogTrigger>
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
                            <DropdownMenuTrigger><i className="fa-solid fa-ellipsis group-options"></i></DropdownMenuTrigger>
                            <DropdownMenuContent>
                            <DropdownMenuItem>Add to Map</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Delete Group</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    
                    </div>
                    {openGroup === group.id && (
                        <div className="group-content">
                            <div className="activity-items-container">
                              {group.activities!.map((activity, index) => (
                                <div key={index} className="activity-item">
                                  {activity.Name}<br/>
                                  {activity.Latitude}<br />
                                  {activity.Longitude}<br />
                                  {activity.Place_ID}
                                </div>
                              ))}
                            </div>
                        </div>
                    )}
                </div>
                ))}
            </div>
        </>
    );
}
export default ActivitySelector;