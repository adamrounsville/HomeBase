"use client";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import usePlacesService from "./placesServiceHook";

const RouteOptimization = () => {
  const router = useRouter(); // Get the router object

  const handleButtonClick = async () => {
    const userId = localStorage.getItem('userId')
    console.log("UserId:", userId)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/optimize-routes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
        }),
      });
      if (!response.ok) {
        throw new Error(`Failed to optimize routes: ${response.status} (${response.statusText})`);
      }
  
      const data = await response.json();
      console.log("Optimization successful:", data);
    } catch (error: any) {
      console.error("Error optimizing routes:", error.message);
    }
  
    // router.push("/trips"); // Navigate to the trips page
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