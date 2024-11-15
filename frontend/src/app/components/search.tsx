"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { Place } from "@/lib/utils";

interface Props {
  onPlaceSelect: (place: Place | null) => void;
}

function SearchBar({ onPlaceSelect }: Props) {
  const [placeAutocomplete, setPlaceAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !inputRef.current) return;
    const options = {
      componentRestrictions: { country: "us" },
      fields: [
        "address_components",
        "geometry",
        "icon",
        "name",
        "place_id",
        "adr_address",
        "formatted_address",
      ],
      strictBounds: false,
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener("place_changed", () => {
      const autocomplete_place = placeAutocomplete.getPlace()
      const place = new Place(
        autocomplete_place.name,
        autocomplete_place.formatted_address,
        autocomplete_place.place_id,
        autocomplete_place.geometry?.location?.lat(),
        autocomplete_place.geometry?.location?.lng(),
        autocomplete_place.geometry?.viewport
      )
      onPlaceSelect(place);
    });
  }, [onPlaceSelect, placeAutocomplete]);

  return (
    <div className="flex w-full max-w-sm items-center space-x-2 p-4 bg-white shadow-md rounded-lg">
      <div className="autocomplete-container">
        <Input
          type="text"
          placeholder="Enter a Location"
          className="homebase-input"
          ref={inputRef}
        />
      </div>
      <Button className = "button-hover-effect" type="submit">Search</Button>
    </div>
  );
}

export default SearchBar;
