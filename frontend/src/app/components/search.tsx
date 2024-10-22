"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEffect, useRef, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

interface Props {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

function SearchBar({onPlaceSelect}: Props) {

  const [placeAutocomplete, setPlaceAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary('places');

  useEffect(() => {
    if (!places || !inputRef.current) return;
      const options = {
        componentRestrictions: { country: "us" },
        fields: ["address_components", "geometry", "icon", "name", "place_id",  "adr_address"],
        strictBounds: false,
      };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener('place_changed', () => {
      onPlaceSelect(placeAutocomplete.getPlace());
    });
  }, [onPlaceSelect, placeAutocomplete]);

  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <div className="autocomplete-container">
        <Input type="text" placeholder="Enter a Location" className="homebase-input" ref={inputRef} />
      </div>
      <Button type="submit">Search</Button>
    </div>
  );
}

export default SearchBar;