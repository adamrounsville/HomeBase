import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"

function ActivitySelector(){
    return (
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
       
    );
}
export default ActivitySelector;