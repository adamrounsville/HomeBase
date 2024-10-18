"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { useState } from "react";
import { useGoogleMapsLoader } from "./useGoogleMapsLoader";

function SearchBar() {
  const [searchResult, setSearchResult] = useState<google.maps.places.Autocomplete>()
  const center = { lat: 50.064192, lng: -130.605469 };
  const defaultBounds = {
    north: center.lat + 0.1,
    south: center.lat - 0.1,
    east: center.lng + 0.1,
    west: center.lng - 0.1,
  };
  const options = {
    bounds: defaultBounds,
    componentRestrictions: { country: "us" },
    fields: ["address_components", "geometry", "icon", "name", "place_id,  adr_address"],
    strictBounds: false,
  };

  const { googleMaps, isLoaded, loadError } = useGoogleMapsLoader();

  function onLoad(autocomplete:google.maps.places.Autocomplete ) {
    setSearchResult(autocomplete);
  }

  function onPlaceChanged() {
    if (searchResult != null) {
      const place = searchResult.getPlace();
      const name = place.name;
      const status = place.business_status;
      const formattedAddress = place.formatted_address;
      console.log(`Name: ${name}`);
      console.log(`Business Status: ${status}`);
      console.log(`Formatted Address: ${formattedAddress}`);
    } else {
      alert("Please enter text");
    }
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
        <Autocomplete options={options} onPlaceChanged={onPlaceChanged} onLoad={onLoad}>
          <Input type="text" placeholder="Enter a Location" className="homebase-input"/>
        </Autocomplete>
        <Button type="submit">Search</Button>
    </div>
  );
}

export default SearchBar;