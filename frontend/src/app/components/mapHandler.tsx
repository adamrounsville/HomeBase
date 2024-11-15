import { Place } from '@/lib/utils';
import {useMap} from '@vis.gl/react-google-maps';
import React, {useEffect} from 'react';

interface Props {
    place: Place | null;
}

const MapHandler = ({place}: Props) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !place) return;

    if (place.viewport) {
      map.fitBounds(place.viewport);
    }
  }, [map, place]);

  return null;
};

export default React.memo(MapHandler);
