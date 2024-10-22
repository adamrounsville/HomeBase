"use client";
import { AdvancedMarker,  Map } from "@vis.gl/react-google-maps";
import MapHandler from "./map-Handler";
import { useEffect, useRef, useState } from "react";
interface Props {
  selectedPlace: google.maps.places.PlaceResult | null
}

const GoogleMapComponent = ({selectedPlace}: Props) => {
  const [position, setPosition] = useState<{lat: number, lng: number}>({lat:  40.233845, lng: -111.658531});
  const [isInfoWindowOpen, setIsInfoWindowOpen] = useState(false);
  const [infoWindowPosition, setInfoWindowPosition] = useState<{ lat: number; lng: number } | undefined>(undefined);

  useEffect(() => {
    if (selectedPlace?.geometry?.location) {
      const latitude = selectedPlace.geometry.location.lat();
      const longitude = selectedPlace.geometry.location.lng();
      setPosition({ lat: latitude, lng: longitude });
    }
  }, [selectedPlace]);

  const handleMarkerClick = () => {
    if (position) {
      setInfoWindowPosition(position);
      setIsInfoWindowOpen(true); // Open the info window on marker click
    }
  };
  const handleAddToActivityGroup = () => {
    alert('Added to Activity Group!');
    // Add your functionality here to handle adding to the activity group
  };

  return (
    <>
          <Map 
          defaultCenter={position} 
          defaultZoom={10} 
          mapId="HOMEBASE_MAP_ID"
          >
          {position && (
          <>
            <AdvancedMarker 
            position={position}
            onClick={handleMarkerClick} 
            />
            {isInfoWindowOpen && infoWindowPosition && (
              <div
                style={{
                  position: 'absolute',
                  transform: `translate(${infoWindowPosition.lat}px, ${infoWindowPosition.lng}px)`,
                }}
              >
                <div className="info-window">
                  <p><strong>{selectedPlace?.name}</strong></p>
                  <button onClick={handleAddToActivityGroup}>Add to Activity Group</button>
                </div>
              </div>
            )}
             </>
            )}
          </Map>
          <MapHandler place={selectedPlace} />
    </>
   );
}
export default GoogleMapComponent
