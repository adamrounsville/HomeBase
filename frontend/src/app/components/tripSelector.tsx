import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Trip, Vacation } from "@/lib/utils";

interface props {
    vacations : Vacation[]
    openVacation: string
    setOpenVacation: (id:string)=>void
    setSelectedTrip: (id:Trip) => void
}

const tripSelector = ({vacations, openVacation, setOpenVacation, setSelectedTrip}: props) =>{

    const toggleGroup = (id: string) => {
        setOpenVacation(openVacation === id ? "" : id)
      };
    const handleDateSelect = (trip:Trip) => {
        setSelectedTrip(trip)
    }

    return(
        <>
            <div className="activity-selector-header p-4 bg-white shadow-md rounded-lg">
                < h2 className="text-dark text-xl font-semibold mb-2">Trips</h2>
            </div>
            <div className="activity-list ">
            {vacations.map((vacation) => (
                <div key={vacation.id} className="activity-group duration-200 ease-in-out hover:shadow-lg">
                    <div className="group-header" onClick={() => toggleGroup(vacation.id)}>
                        <span className="group-title">{vacation.title}</span>
                    </div>
                    {openVacation === vacation.id && (
                        <div className="activity-items-container space-y-4 pt-2">
                            {vacation.dates.length === 0 ? (
                            <div className="no-items-message">
                                This trip has no activities planned.
                            </div>
                            ) : (
                            vacation.dates.map((trip, index) => (
                                <div
                                key={index}
                                className="activity-item relative bg-gray-100 border border-gray-300 p-4 rounded-lg shadow-sm duration-200 ease-in-out hover:bg-gray-200 hover:shadow-lg hover:scale-105 m-2"
                                >
                                <div 
                                className="flex justify-between items-center"
                                onClick={() => handleDateSelect(trip)}
                                >
                                    <span className=" font-semibold text-gray-800">
                                    {trip.date}
                                    </span>
                                </div>
                                </div>
                            ))
                            )}
                        </div>
                        )}
                </div>
                ))}
            </div>
        </>
    )
}

export default tripSelector;