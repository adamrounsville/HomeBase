"use client";

import { useEffect } from "react";

const GoogleMap = () => {
  useEffect(() => {
    let map: google.maps.Map | undefined;

    const initMap = () => {

      map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
      });
    };

    const loadGoogleMapsScript = (apiKey: string) => {
      return new Promise<void>((resolve, reject) => {
        const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);

        if (existingScript) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;

        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Google Maps failed to load."));

        document.head.appendChild(script);
      });
    };
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if(apiKey == undefined){
        throw Error("No API Key Specified")
    }
    loadGoogleMapsScript(apiKey)
      .then(() => {
        initMap();
      })
      .catch((error) => console.error(error));
  }, []);

  return <div id="map" style={{ height: "100%", width: "100%" }}></div>;
};

export default GoogleMap;
