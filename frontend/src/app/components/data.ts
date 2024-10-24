type MarkerData = Array<{
    id: string;
    position: google.maps.LatLngLiteral;
    zIndex: number;
  }>;
  
  export function getData() {
    const data: MarkerData = [];
  
    // create 50 random markers
    for (let index = 0; index < 50; index++) {
      data.push({
        id: String(index),
        position: {lat: rnd(53.52, 53.63), lng: rnd(9.88, 10.12)},
        zIndex: index
      });
    }
  
    return data;
  }
  
  function rnd(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }
  