import { Place } from '@/lib/utils';
import {useMap} from '@vis.gl/react-google-maps';
import React, {useEffect} from 'react';

interface Props {
    // place_result?: google.maps.places.PlaceResult | null;
    place: Place | null;
}

const MapHandler = ({place}: Props) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !place) return;

    if (place.Viewport) {
      map.fitBounds(place.Viewport);
    }
  }, [map, place]);

  return null;
};

export default React.memo(MapHandler);
