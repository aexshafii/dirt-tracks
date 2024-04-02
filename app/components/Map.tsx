'use client';

import mapboxgl, { GeoJSONSource } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import React from 'react';
import displayTrack from '../utils/displayTrack';
import { calculateDistance } from '../utils/calculateDistance';

const ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;
const INITIAL_LNG = 115.092;
const INITIAL_LAT = -8.3405;
const INITIAL_ZOOM = 7.5;

mapboxgl.accessToken = ACCESS_TOKEN;

interface MapContextValue {
  map?: React.RefObject<mapboxgl.Map | null>;
  mapContainer?: React.RefObject<HTMLDivElement>;
  markers?: React.RefObject<mapboxgl.Marker[]>;
  tracks?: React.RefObject<GeoJSONSource | null>;
  allDistancesArray?: any;
  setAllDistancesArray?: any;
  selectedSpot?: any;
  setSelectedSpot?: any;
}

const MapContext = React.createContext<MapContextValue>({});

export const useMapContext = (): MapContextValue => React.useContext(MapContext);

export const MapProvider: React.FC<{
  locations: Array<{ fileName: string; coordinates: [number, number]; name: string; allCoordinates: any }>;
  children: React.ReactNode;
}> = ({ locations, children }) => {
  const mapContainer = React.useRef<HTMLDivElement | null>(null);
  const map = React.useRef<mapboxgl.Map | null>(null);
  const markers = React.useRef<mapboxgl.Marker[]>([]);
  const tracks = React.useRef<GeoJSONSource | null>(null);
  const [lng, setLng] = React.useState(INITIAL_LNG);
  const [lat, setLat] = React.useState(INITIAL_LAT);
  const [zoom, setZoom] = React.useState(INITIAL_ZOOM);
  const [allDistancesArray, setAllDistancesArray] = React.useState<any>([]);
  const [selectedSpot, setSelectedSpot] = React.useState<any>([]);

  // Remove map from the dependencies array
  React.useEffect(() => {
    if (!mapContainer.current || map.current) return;
    const initMap = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/space-waves/clsy0mhbw00bp01qo66qu0ol9',
      center: [lng, lat],
      zoom: zoom,
    });

    map.current = initMap; // Set the ref to the newly created map
  }, [lat, lng, locations, zoom]);

  // Use a separate state variable to track whether the distances have been calculated

  React.useEffect(() => {
    const calculateAllDistances = async () => {
      const distances = [];
      for (const location of locations) {
        const distance = await calculateDistance(location.allCoordinates);
        distances.push(distance);
      }
      return distances;
    };

    calculateAllDistances().then((distances) => {
      setAllDistancesArray(distances);

      locations.forEach((location, i) => {
        const el = document.createElement('div');
        el.className = 'h-[32px] w-[22px] marker drop-shadow-lg';

        el.addEventListener('click', () => {
          map.current?.flyTo({
            center: location.coordinates,
            zoom: 10,
          });
          displayTrack(location, locations, map);
          setSelectedSpot(i);

          const cards = document.querySelectorAll('.shadow-card');
          cards[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });

        const popup = new mapboxgl.Popup({ offset: 16, closeOnClick: true }).setLngLat(location.coordinates).setHTML(`
            <div class="name tracking-tighter">${location.name}</div>
            <div class="text-gray-8 tracking-tighter pt-1">Start</div>
          `);
        //   <div class="text-gray-8 tracking-tighter font-sm">Length: ${distances[i]} km</div>

        if (map.current) {
          const marker = new mapboxgl.Marker({ element: el, offset: [0, 0] })
            .setLngLat(location.coordinates)
            .setPopup(popup)
            .addTo(map.current);

          markers.current = markers.current.filter((m) => m !== marker);
          markers.current.push(marker);
        }
      });
    });
  }, [locations]);

  React.useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(Number(map.current?.getCenter().lng.toFixed(4)));
      setLat(Number(map.current?.getCenter().lat.toFixed(4)));
      setZoom(Number(map.current?.getZoom().toFixed(2)));
    });
  });

  return (
    <MapContext.Provider
      value={{ map, mapContainer, markers, tracks, allDistancesArray, selectedSpot, setSelectedSpot }}
    >
      {children}
    </MapContext.Provider>
  );
};

export const Map = () => {
  const { mapContainer } = useMapContext();

  return (
    <div className="absolute inset-0">
      <div
        ref={mapContainer}
        className="h-screen w-screen"
      />
    </div>
  );
};
