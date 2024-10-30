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
import { getData } from "./data";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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
  homebaseLocation: google.maps.places.PlaceResult | null;
  openGroup: string | null;
  activityGroups: ActivityGroup[];
  setActivityGroups: (activityGroups: ActivityGroup[]) => void;
  setOpenGroup: (group: any) => void;
}

// This is to load in marker Fake Data
const data = getData()
  .sort((a, b) => b.position.lat - a.position.lat)
  .map((dataItem, index) => ({ ...dataItem, zIndex: index }));

const GoogleMapComponent = ({selectedPlace, homebaseLocation, openGroup, activityGroups, setActivityGroups, setOpenGroup}: Props) => {  
  
  const [displayMarkers, setDisplayMarkers] = useState<Place[] | undefined>();
  // This is the latitude and longitude that is returned from the search and set to display the search marker

  const [position, setPosition] = useState<{lat: number, lng: number} | undefined>({lat:  40.233845, lng: -111.658531});
  const [homebasePosition, setHomebasePosition] = useState<{lat: number, lng: number} | undefined>();
  //These are the markers selected and if the marker is a search location or activity group 
  const [selectedMarker, setSelectedMarker] = useState<google.maps.marker.AdvancedMarkerElement | null>(null);

  const [infoWindowShown, setInfoWindowShown] = useState(false);
  const [isSearchLocation, setSearchLocation] = useState(false);

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
    marker: google.maps.marker.AdvancedMarkerElement
  ) => {
    setInfoWindowShown(true);
    setSelectedMarker(marker);
    setSearchLocation(true);
  };

  // This will handle the Activity Group Markers
  const onMarkerClick = useCallback(
    (id: string | null, marker?: google.maps.marker.AdvancedMarkerElement) => {
      setSelectedId(id);
      console.log(selectedPlace?.formatted_address);
      console.log(selectedPlace?.address_components);
      console.log("end test");

      if (marker) {
        setSelectedMarker(marker);
        setSearchLocation(false);
      }

      if (id !== selectedId) {
        setInfoWindowShown(true);
      } else {
        setInfoWindowShown((isShown) => !isShown);
      }
    },
    [selectedId]
  );
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
        selectedPlace.geometry?.location?.lng()
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
    if (homebaseLocation?.geometry?.location) {
      const latitude = homebaseLocation.geometry.location.lat();
      const longitude = homebaseLocation.geometry.location.lng();
      setHomebasePosition({ lat: latitude, lng: longitude });
    }
    
  }, [homebaseLocation]);

  useEffect(() => {
    const storedLatitude = localStorage.getItem('homebasePositionLat');
    const storedLongitude = localStorage.getItem('homebasePositionLng');
    if (storedLatitude && storedLongitude){
      const latitude = parseFloat(storedLatitude);
      const longitude = parseFloat(storedLongitude);
      setHomebasePosition({lat:latitude, lng: longitude})
    }
  
  }, []);
  useEffect(() => {
    if (homebasePosition) {
      setPosition(homebasePosition);
    }
  }, [homebasePosition]);

  useEffect(() => {
    if (openGroup) {
      const selectedGroup = activityGroups.find((group) => group.id === openGroup);
      setDisplayMarkers(selectedGroup?.activities);
    }
    else {
      setDisplayMarkers(undefined); // clear markers if no group is selected
    }
  }), [openGroup]
  
  function removeTags(string: string) {
    return string
      .replace(/<[^>]*>/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim();
  }
  return (
      <>
        <Map 
          defaultCenter={position}
          defaultZoom={10} 
          onClick={onMapClick}
          clickableIcons={false}
          mapId="HOMEBASE_MAP_ID"
          >
          {displayMarkers && displayMarkers.map((place) => (
            
            <AdvancedMarkerWithRef
              key={place.Place_ID}
              position={{lat:place.Latitude ?? 0, lng : place.Longitude ?? 0}}
              onMarkerClick={handleMarkerClick}
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

          <AdvancedMarkerWithRef
              onMarkerClick={(
                marker: google.maps.marker.AdvancedMarkerElement
              ) => handleMarkerClick(marker)}
              position={homebasePosition}
          />
          <AdvancedMarkerWithRef
              onMarkerClick={(
                marker: google.maps.marker.AdvancedMarkerElement
              ) => handleMarkerClick(marker)}
              position={position}
          />
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
        {infoWindowShown && selectedMarker && !isSearchLocation && (
          <InfoWindow
            anchor={selectedMarker}
            onCloseClick={handleInfowindowCloseClick}
          >
            <h2>Marker {selectedId}</h2>
            <p>Some location information</p>
          </InfoWindow>
        )}
      </Map>

      {isModalOpen && (
        <Dialog
          open={isModalOpen}
          onOpenChange={(isOpen) => setModalOpen(isOpen)}
        >

          <DialogContent>
            <h2>Select an Activity Group</h2>
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
          <MapHandler place={selectedPlace || homebaseLocation} />

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
