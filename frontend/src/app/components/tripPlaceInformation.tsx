import { Place } from "@/lib/utils";

interface props {
    places: Place[];
}

const TripPlaceInformation = ({ places }: props) => {
    return (
        <div className="place-container p-4 bg-white shadow-md rounded-lg overflow-auto max-h-[500px]">
             < h2 className="text-dark text-xl font-semibold mb-2">Location Information:</h2>

            <div className="place-list flex flex-wrap gap-4">
                {places.map((place) => (
                    <div
                        key={place.placeId} // Make sure each item has a unique key
                        className="place-item p-4 bg-white shadow-md rounded-lg flex flex-col items-center w-[30%] h-[150px] border"
                    >
                        <h2>{place.name}</h2>
                        <h2>{place.address}</h2>
                        
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TripPlaceInformation;
