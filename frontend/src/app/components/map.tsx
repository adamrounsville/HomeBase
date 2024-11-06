"use client";
import {
  AdvancedMarker,
  AdvancedMarkerProps,
  InfoWindow,
  Map,
  Pin,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import MapHandler from "./map-Handler";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ActivityGroup, Place } from "@/lib/utils";
interface Props {
  selectedPlace: google.maps.places.PlaceResult | null;
  homebaseLocation: Place | null;
  openGroup: string | null;
  activityGroups: ActivityGroup[];
  selectedActivity: number | null;
  homebaseFocus: boolean;
  setFocusHomebase: (focusHomebase: boolean) => void;
  setActivityGroups: (activityGroups: ActivityGroup[]) => void;
  
}

const GoogleMapComponent = ({selectedPlace, homebaseLocation, openGroup, activityGroups, selectedActivity, homebaseFocus, setFocusHomebase,setActivityGroups}: Props) => {  
  
  const [displayMarkers, setDisplayMarkers] = useState<Place[] | undefined>();
  // This is the latitude and longitude that is returned from the search and set to display the search marker

  const [position, setPosition] = useState<{lat: number, lng: number} | undefined>();

  const [homebasePosition, setHomebasePosition] = useState<{lat: number, lng: number} | undefined>();
  //These are the markers selected and if the marker is a search location or activity group 
  const [selectedMarker, setSelectedMarker] = useState<google.maps.marker.AdvancedMarkerElement | null>(null);

  const [infoWindowShown, setInfoWindowShown] = useState(false);
  const [isSearchLocation, setSearchLocation] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState<Place>();
  // Change Hover components
  const onMouseEnter = useCallback((id: string | null) => setHoverId(id), []);
  const onMouseLeave = useCallback(() => setHoverId(null), []);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const placeMarkers = true;

  // For the AddToActivityGroup Modal, sets if its open and which activity group is selected
  // for the select
  const [isModalOpen, setModalOpen] = useState(false); // Modal state
  const [selectedActivityGroup, setSelectedActivityGroup] = useState<
    string | undefined
  >(undefined); // Dropdown selection

  // This handles the search marker's click
  const handleMarkerClick = (
    marker: google.maps.marker.AdvancedMarkerElement,
    place?: Place
  ) => {
    if (place){
      setSelectedLocation(place)
      setSearchLocation(false);
    }
    else{
      setSearchLocation(true);
    }
   
    setInfoWindowShown(true);
    setSelectedMarker(marker);
  };

  const onAddToActivityGroupClick = () => {
    setModalOpen(true);
  };

  const handleAddToGroup = () => {
    // Find the group that we want to add to
    const group = activityGroups.find((g) => g.id === selectedActivityGroup);
    // Make a new Place Object and add it to the ActivityGroup
    if (group && selectedPlace) {
      const newPlace: Place = new Place(
        selectedPlace.name,
        selectedPlace.formatted_address,
        selectedPlace.place_id,
        selectedPlace.geometry?.location?.lat(),
        selectedPlace.geometry?.location?.lng(),
        selectedPlace.geometry?.viewport
      );
      group?.addActivity(newPlace);
      setActivityGroups([...activityGroups]); // Update the activity groups
      setModalOpen(false);
    }
  };

  // Handles when map is clicked
  const onMapClick = useCallback(() => {
    setSelectedId(null);
    setSelectedMarker(null);
    setInfoWindowShown(false);
    setFocusHomebase(false);
  }, []);

  //Closes the Info Window
  const handleInfowindowCloseClick = useCallback(
    () => setInfoWindowShown(false),
    []
  );
  // When the selected place changes, this computes the lat and longitude that is set
  useEffect(() => {
    if (selectedPlace?.geometry?.location) {
      const latitude = selectedPlace.geometry.location.lat();
      const longitude = selectedPlace.geometry.location.lng();
      setPosition({ lat: latitude, lng: longitude });
    }
  }, [selectedPlace]);


  useEffect(() => {
    if (homebaseLocation) {
      const latitude = homebaseLocation.Latitude!;
      const longitude = homebaseLocation.Longitude!;
      setHomebasePosition({ lat: latitude, lng: longitude });
    }
  }, [homebaseLocation]);

  useEffect(() => {
    const storedLatitude = localStorage.getItem('homebasePositionLat');
    const storedLongitude = localStorage.getItem('homebasePositionLng');
    if (storedLatitude && storedLongitude){
      console.log("Set Homebase Position")
      const latitude = parseFloat(storedLatitude);
      const longitude = parseFloat(storedLongitude);
      setHomebasePosition({lat:latitude, lng: longitude})
    }
  
  }, []);

  // useEffect(() => {
  //   if(selectedActivity){
  //     const selectedGroup  = activityGroups.find((group) => group.id === openGroup);
  //     const activity = selectedGroup?.activities.at(selectedActivity)
  //     if(activity && activity.Latitude && activity.Longitude){
  //       const latitude = activity.Latitude;
  //       const longitude = activity.Longitude;
  //       console.log("SELECTED ACTIVITY", selectedActivity)
  //       // setPosition({lat: latitude, lng: longitude})
  //     }
  //   }
  // }), [selectedActivity]

  useEffect(() => {
    if (openGroup) {
      const selectedGroup = activityGroups.find((group) => group.id === openGroup);
      setDisplayMarkers(selectedGroup?.activities);
    }
    else {
      setDisplayMarkers(undefined); 
    }
  }), [openGroup]

  
  return (
      <>
        <Map 
          defaultCenter={position || homebasePosition}
          defaultZoom={10} 
          onClick={onMapClick}
          clickableIcons={true}
          mapId="HOMEBASE_MAP_ID"
          >
          {displayMarkers && displayMarkers.map((place) => (
            
            <AdvancedMarkerWithRef
              key={place.Place_ID}
              position={{lat:place.Latitude ?? 0, lng : place.Longitude ?? 0}}
              onMarkerClick={(
                marker: google.maps.marker.AdvancedMarkerElement
              ) => handleMarkerClick(marker, place)}
              onMouseEnter={() => onMouseEnter(place.Place_ID ?? "NO_ID")}
              onMouseLeave={onMouseLeave}
            >
              <Pin
               background={selectedId === place.Place_ID ? '#22ccff' : null}
               borderColor={selectedId === place.Place_ID ? '#1e89a1' : null}
               glyphColor={selectedId === place.Place_ID ? '#0f677a' : null} 
              />
            </AdvancedMarkerWithRef>
          ))}
          // Homebase Marker
          {homebaseLocation && (
            <AdvancedMarkerWithRef
              key={homebaseLocation.Place_ID}
              onMarkerClick={(marker) => handleMarkerClick(marker, homebaseLocation)}
              position={homebasePosition}
            />
          )}
          //Search Marker
            <AdvancedMarkerWithRef
              onMarkerClick={(
                marker: google.maps.marker.AdvancedMarkerElement
              ) => handleMarkerClick(marker)}
              position={position}
            />
          
          // Info Window for Search Marker
        {infoWindowShown && selectedMarker && isSearchLocation && (
          <InfoWindow
            anchor={selectedMarker}
            onCloseClick={handleInfowindowCloseClick}
          >
            <h1 className="text-xl font-semibold text-gray-800">
              {selectedPlace?.name}
            </h1>
            <h1 className="text-sm text-gray-600 mb-4">
              {selectedPlace?.formatted_address}
            </h1>

            <Button onClick={onAddToActivityGroupClick}>
              Add to Activity Group
            </Button>
          </InfoWindow>
        )}
        // Info Window for Other Markers (Homebase, Activity Groups)
        {infoWindowShown && selectedMarker && !isSearchLocation && (
          <InfoWindow
            anchor={selectedMarker}
            onCloseClick={handleInfowindowCloseClick}
          >
            <h1 className="text-xl font-semibold text-gray-800">
              {selectedLocation?.Name}
            </h1>
            <h1 className="text-sm text-gray-600 mb-4">
              {selectedLocation?.Address}
            </h1>
          </InfoWindow>
        )}
      </Map>
      
      {isModalOpen && (
        <Dialog
          open={isModalOpen}
          onOpenChange={(isOpen) => setModalOpen(isOpen)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add To Activity Group</DialogTitle>
            </DialogHeader>
              <Select
                value={selectedActivityGroup}
                onValueChange={(value) => setSelectedActivityGroup(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Activity Group" />
                </SelectTrigger>
                <SelectContent>
                  {activityGroups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.title}
                    </SelectItem>
                  ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleAddToGroup}>
                  Add
                </Button>
              </DialogContent>
          </Dialog>
          )}
          <MapHandler place={homebaseLocation} />

    </>
  );
};
export default GoogleMapComponent;

export const AdvancedMarkerWithRef = (
  props: AdvancedMarkerProps & {
    onMarkerClick: (marker: google.maps.marker.AdvancedMarkerElement) => void;
  }
) => {
  const { children, onMarkerClick, ...advancedMarkerProps } = props;
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <AdvancedMarker
      onClick={() => {
        if (marker) {
          onMarkerClick(marker);
        }
      }}
      ref={markerRef}
      {...advancedMarkerProps}
    >
      {children}
    </AdvancedMarker>
  );
};
