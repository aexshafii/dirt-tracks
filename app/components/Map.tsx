'use client';
import React from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { SpotsProps } from '../data/schema';

const ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;

const INITIAL_LNG = 115.092;
const INITIAL_LAT = -8.3405;
const INITIAL_ZOOM = 7.5;

mapboxgl.accessToken = ACCESS_TOKEN;

interface MapContextValue {
  map?: React.RefObject<mapboxgl.Map | null>;
  mapContainer?: React.RefObject<HTMLDivElement>;
  markers?: React.RefObject<mapboxgl.Marker[]>;
}

const MapContext = React.createContext<MapContextValue>({});

export const useMapContext = (): MapContextValue => React.useContext(MapContext);

export const MapProvider: React.FC<{
  locations: SpotsProps;
  children: React.ReactNode;
}> = ({ locations, children }) => {
  const mapContainer = React.useRef<HTMLDivElement | null>(null);
  const map = React.useRef<mapboxgl.Map | null>(null);
  const markers = React.useRef<mapboxgl.Marker[]>([]);
  const [lng, setLng] = React.useState(INITIAL_LNG);
  const [lat, setLat] = React.useState(INITIAL_LAT);
  const [zoom, setZoom] = React.useState(INITIAL_ZOOM);

  React.useEffect(() => {
    if (mapContainer.current && !map.current) {
      // Ensure this runs once and the map container is available
      const initMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12', // Consider changing to satellite-v9 if needed
        center: [lng, lat],
        zoom: zoom,
      });

      initMap.on('load', () => {
        initMap.addSource('earthquakes', {
          type: 'geojson',
          data: 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson',
        });

        initMap.addLayer({
          id: 'earthquakes-layer',
          type: 'circle',
          source: 'earthquakes',
          paint: {
            'circle-radius': 4,
            'circle-stroke-width': 2,
            'circle-color': 'red',
            'circle-stroke-color': 'white',
          },
        });
      });

      map.current = initMap; // Set the ref to the newly created map
    }
  }, [lat, lng, zoom]); // Depend on lat, lng, and zoom if these should cause the map to reinitialize

  React.useEffect(() => {
    if (!map.current) return;
    map.current.on('move', () => {
      setLng(Number(map.current?.getCenter().lng.toFixed(4)));
      setLat(Number(map.current?.getCenter().lat.toFixed(4)));
      setZoom(Number(map.current?.getZoom().toFixed(2)));
    });
  }, [map]);

  return <MapContext.Provider value={{ map, mapContainer, markers }}>{children}</MapContext.Provider>;
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
