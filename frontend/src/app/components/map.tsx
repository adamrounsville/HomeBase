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
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ActivityGroup, Place } from "@/lib/utils";
interface Props {
  selectedPlace: Place | null;
  homebaseLocation: Place | null;
  openGroup: string | null;
  activityGroups: ActivityGroup[];
  focusSelectedLocation: Place | undefined;
  setActivityGroups: (activityGroups: ActivityGroup[]) => void;
  setSelectedActivity:(activity: number) => void;
  
}

const GoogleMapComponent = ({
    selectedPlace, 
    homebaseLocation, 
    openGroup, 
    activityGroups,
    focusSelectedLocation, 
    setActivityGroups, 
    setSelectedActivity
}: Props) => {  
  
  // const [focusSelectedLocation, setFocusSelectedLocation] = useState<Place | undefined>();
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
      group?.addActivity(selectedPlace);
      setActivityGroups([...activityGroups]); // Update the activity groups
      setModalOpen(false);
    }
  };

  // Handles when map is clicked
  const onMapClick = useCallback(() => {
    setSelectedId(null);
    setSelectedMarker(null);
    setInfoWindowShown(false);
    setSelectedActivity(100);
  }, []);

  //Closes the Info Window
  const handleInfowindowCloseClick = useCallback(
    () => setInfoWindowShown(false),
    []
  );
  // When the selected place changes, this computes the lat and longitude that is set
  useEffect(() => {
    if (selectedPlace) {
      const latitude = selectedPlace.Latitude!;
      const longitude = selectedPlace.Longitude!;
      setInfoWindowShown(false);
      setPosition({ lat: latitude, lng: longitude });
      
    }
  }, [selectedPlace]);


  useEffect(() => {
    if (homebaseLocation) {
      const latitude = homebaseLocation.Latitude!;
      const longitude = homebaseLocation.Longitude!;
      setInfoWindowShown(false);
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
          {/* {displayMarkers && displayMarkers.map((place) => (

          
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
               background={openGroup.}
               borderColor={selectedId === place.Place_ID ? '#1e89a1' : null}
               glyphColor={selectedId === place.Place_ID ? '#0f677a' : null} 
              />
            
            </AdvancedMarkerWithRef>
          ))} */}
          {displayMarkers && displayMarkers.map((place) => {
            const selectedGroup = activityGroups.find((group) => group.id === openGroup);
            return (
              <AdvancedMarkerWithRef
                key={place.Place_ID}
                position={{ lat: place.Latitude ?? 0, lng: place.Longitude ?? 0 }}
                onMarkerClick={(marker: google.maps.marker.AdvancedMarkerElement) =>
                  handleMarkerClick(marker, place)
                }
                onMouseEnter={() => onMouseEnter(place.Place_ID ?? "NO_ID")}
                onMouseLeave={onMouseLeave}
              >
                <Pin
                  background={selectedGroup?.color ?? '#ccc'} // Use selectedGroup's color or fallback
                  borderColor={"#000"}
                  glyphColor={"#000"}
                />
              </AdvancedMarkerWithRef>
            );
            })}
          // Homebase Marker
          {homebaseLocation && (
              <AdvancedMarkerWithRef
                key={homebaseLocation.Place_ID}
                onMarkerClick={(marker) => handleMarkerClick(marker, homebaseLocation)}
                position={homebasePosition}
              >
              <HomebaseIcon/>
              </AdvancedMarkerWithRef>
            
          )}
          //Search Marker
          {selectedPlace && (
            <AdvancedMarkerWithRef
            onMarkerClick={(
              marker: google.maps.marker.AdvancedMarkerElement
            ) => handleMarkerClick(marker)}
            position={position}
            >
            </AdvancedMarkerWithRef>
          )}
            
            
          
          // Info Window for Search Marker
        {infoWindowShown && selectedMarker && isSearchLocation && (
          <InfoWindow
            anchor={selectedMarker}
            onCloseClick={handleInfowindowCloseClick}
          >
            <h1 className="text-xl font-semibold text-gray-800">
              {selectedPlace?.Name}
            </h1>
            <h1 className="text-sm text-gray-600 mb-4">
              {selectedPlace?.Address}
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
          <MapHandler place={focusSelectedLocation!} />

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

export const HomebaseIcon = () => (
  <>
    <div className="custom-pin">
      <div className="image-container">
        <span className="icon">
            <svg
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M30 0H0V30H30V0Z" fill="#B88B2E" />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15 30C23.2843 30 30 23.2842 30 15C30 6.7157 23.2843 0 15 0C6.71578 0 0 6.7157 0 15C0 23.2842 6.71578 30 15 30Z"
                fill="#B88B2E"
              />
              <path
                d="M10 20.75V13.8875L7.9 15.5L7 14.3L15.25 8L18.25 10.2875V8.75H20.5V12.0125L23.5 14.3L22.6 15.5L20.5 13.8875V20.75H16V16.25H14.5V20.75H10ZM11.5 19.25H13V14.75H17.5V19.25H19V12.7438L15.25 9.89375L11.5 12.7438V19.25ZM13.75 13.2688H16.75C16.75 12.8688 16.6 12.5406 16.3 12.2844C16 12.0281 15.65 11.9 15.25 11.9C14.85 11.9 14.5 12.0281 14.2 12.2844C13.9 12.5406 13.75 12.8688 13.75 13.2688Z"
                fill="white"
              />
            </svg>
        </span>
      </div>
      
    </div>  
    <div className="tip"/>
  </>
);

export const SearchIcon= () => (
  <>
    <div className="custom-pin-white">
      <div className="image-container">
        <span className="icon">
          <i className="search-icon fa-solid fa-magnifying-glass-location"></i>
        </span>
      </div>
    </div>  
  </>
)