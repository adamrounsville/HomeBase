"use client";
import { AdvancedMarker,  Map, } from "@vis.gl/react-google-maps";
import MapHandler from "./map-Handler";
interface Props {
  selectedPlace: google.maps.places.PlaceResult | null
}

const GoogleMapComponent = ({selectedPlace}: Props) => {
  const position = {lat: 53.54992, lng: 10.00678};

  return (
    <>
          <Map 
          defaultCenter={position} 
          defaultZoom={10} 
          mapId="DEMO_MAP_ID"
          >
            <AdvancedMarker position={position} />
          </Map>
          <MapHandler place={selectedPlace} />
    </>
   );
}
export default GoogleMapComponent
