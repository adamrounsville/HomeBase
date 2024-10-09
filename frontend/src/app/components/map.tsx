"use client";
import { useMemo } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const GoogleMapComponent = () => {
 const { isLoaded } = useLoadScript({
   googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? 'default_api_key',
 });

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
