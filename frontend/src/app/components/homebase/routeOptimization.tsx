"use client";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import usePlacesService from "./placesServiceHook";

const RouteOptimization = () => {
  const router = useRouter(); // Get the router object

  const handleButtonClick = () => {
    // const placesService = usePlacesService()
    // const placeId = "ChIJRYWgDQiaTYcRBWbJnKsNrpE"
    // const request: google.maps.places.PlaceDetailsRequest = {
    //     placeId,
    //     fields: ["name", "formatted_address", "geometry", "rating", "photos"],
    // };
    // if(placesService){
    //     placesService.getDetails(request, (result, status) => {
    //         if (status === google.maps.places.PlacesServiceStatus.OK && result) {
    //         //   setPlaceDetails(result);
    //         console.log("Place details fetched:", result);
    //         } else {
    //         console.error("Error fetching place details:", status);
    //         }
    //     }
    
    // )};
    router.push("/trips"); // Navigate to the trips page
  };
  
  return (
    <div className="daily-schedule-container p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-black text-xl font-semibold mb-2">Optimize</h2>
      <button
        onClick={handleButtonClick}
        className="bg-black text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-600 transition"
      >
        Optimize Route
      </button>
    </div>
  );
};

export default RouteOptimization;