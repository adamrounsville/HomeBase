import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
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
  

  const ActivitySelector = () => {

    
    return (
        <>  
            <div className="activity-selector-header">
                <h2>Activities</h2>
                <Dialog >
                <DialogTrigger><i className="fas fa-plus"></i></DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add a New Activity Group</DialogTitle>
                            <DialogDescription>
                                Please enter the title of your new Activity Group.
                            </DialogDescription>
                            <Input />
                            <Button>Create</Button>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="activity-selector">
                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Snorkelling</AccordionTrigger>
                        <AccordionContent>
                        INFO HERE
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Sandy Beaches</AccordionTrigger>
                        <AccordionContent>
                    INFO HERE
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Resturants</AccordionTrigger>
                        <AccordionContent>
                        INFO HERE
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </>
        
       
    );
}
export default ActivitySelector;