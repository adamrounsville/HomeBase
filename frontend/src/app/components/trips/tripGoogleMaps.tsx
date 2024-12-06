import { Map } from "@vis.gl/react-google-maps"
import TripDetails from "./tripDetails";
import TripPlaceInformation from "./tripPlaceInformation";
import { Trip } from "@/lib/utils";

interface props {
    trip: Trip | undefined
}

const TripGoogleMaps = ({trip}: props) => {
    return (
        <div className="trip-map">
            <div className="pb-3">
                <TripDetails/>
            </div>
           
            
            <Map 
                defaultCenter={{lat: 40.2338, lng:111.6585}}
                defaultZoom={10} 
                // onClick={onMapClick}
                clickableIcons={true}
                mapId="HOMEBASE_MAP_ID"
                >
            </Map>
            <div className="pt-3">
                {trip && trip.places.length > 0 ? (
                        <TripPlaceInformation places={trip.places} />
                    ) : (
                        <div>No places found for this trip.</div>
                    )}
            </div>
            
                

        </div>
            
               
            
      
    )
}

export default TripGoogleMaps;