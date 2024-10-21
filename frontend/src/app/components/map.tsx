"use client";
import { useMemo } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { useGoogleMapsLoader } from "./useGoogleMapsLoader";

const GoogleMapComponent = () => {
  const { googleMaps, isLoaded, loadError } = useGoogleMapsLoader();
  
  if (!isLoaded) return <div>Loading...</div>;
  return <Map />;
}

function Map() {
 const center = useMemo(() => ({ lat: 44, lng: -80 }), []);

 return (
   <GoogleMap zoom={10} center={center} mapContainerClassName="map-container">
   </GoogleMap>
 );
}
export default GoogleMapComponent
