import { useJsApiLoader, Libraries } from '@react-google-maps/api';
import { useState, useEffect } from 'react';

// Cache the Google object
let googleMaps: typeof google | null = null;
const libraries: Libraries = ["places"]

export const useGoogleMapsLoader = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);

    const { isLoaded: apiIsLoaded, loadError: apiLoadError } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!, // Your API Key
        libraries: libraries, 
    });

  useEffect(() => {
    // Wait for the Google API to load and ensure `window.google` is available
    if (apiIsLoaded && !googleMaps) {
      if (window.google) {
        googleMaps = window.google; // Cache the google object globally
        setIsLoaded(true); // Update local state
      } else {
        setLoadError('Google Maps API is loaded, but `window.google` is undefined.');
      }
    } else if (googleMaps) {
      setIsLoaded(true); // Already loaded, just set loaded state
    }

    if (apiLoadError) {
      setLoadError(apiLoadError.message);
    }
  }, [apiIsLoaded, apiLoadError]);

  return { googleMaps, isLoaded, loadError };
};
