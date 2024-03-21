'use client';

import mapboxgl, { GeoJSONSource } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useEffect, useState } from 'react';
import * as turf from '@turf/turf';
import { distinctColors } from '../constants/constants';
import displayTrack from '../utils/displayTrack';
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
}

const MapContext = React.createContext<MapContextValue>({});

export const useMapContext = (): MapContextValue => React.useContext(MapContext);

export const MapProvider: React.FC<{
  locations: Array<{ fileName: string; coordinates: [number, number]; name: string }>;
  children: React.ReactNode;
}> = ({ locations, children }) => {
  const mapContainer = React.useRef<HTMLDivElement | null>(null);
  const map = React.useRef<mapboxgl.Map | null>(null);
  const markers = React.useRef<mapboxgl.Marker[]>([]);
  const tracks = React.useRef<GeoJSONSource | null>(null);
  const [lng, setLng] = React.useState(INITIAL_LNG);
  const [lat, setLat] = React.useState(INITIAL_LAT);
  const [zoom, setZoom] = React.useState(INITIAL_ZOOM);
  React.useEffect(() => {
    if (!mapContainer.current) return;
    if (map.current) return;
    const initMap = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/space-waves/clsy0mhbw00bp01qo66qu0ol9', // Consider changing to satellite-v9 if needed
      center: [lng, lat],
      zoom: zoom,
    });

    // get geojson data and push to tracks ref
    const geojson = {
      type: 'FeatureCollection',
      features: locations.map((location) => ({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: location.coordinates,
        },
      })),
    };
    map.current = initMap; // Set the ref to the newly created map
  }, [lat, lng, locations, map, zoom]);

  React.useEffect(() => {
    if (!map.current) return;

    // Remove old markers
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];
    // Add new markers
    for (const location of locations) {
      console.log('marker clicked');
      const el = document.createElement('div');
      // Tailwind Classname
      el.className = `h-[32px] w-[22px] marker drop-shadow-lg`;
      el.addEventListener('click', () => {
        map.current?.flyTo({
          center: location.coordinates,
          zoom: 15,
        });
        displayTrack(location, locations, map);
      });

      const popup = new mapboxgl.Popup({ offset: 16, closeOnClick: true }).setLngLat(location.coordinates).setHTML(
        `
                <div class="name tracking-tighter">${location.name}</div>
                <div class="text-gray-8 tracking-tighter">
Starting Point
                </div>
        `
      );

      const marker = new mapboxgl.Marker({ element: el, offset: [0, 0] })
        .setLngLat(location.coordinates)
        .setPopup(popup)
        .addTo(map.current);
      markers.current.push(marker);
    }
  }, [locations]);

  React.useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(Number(map.current?.getCenter().lng.toFixed(4)));
      setLat(Number(map.current?.getCenter().lat.toFixed(4)));
      setZoom(Number(map.current?.getZoom().toFixed(2)));
    });
  });

  return <MapContext.Provider value={{ map, mapContainer, markers, tracks }}>{children}</MapContext.Provider>;
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
