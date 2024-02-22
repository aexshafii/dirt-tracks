'use client';

import mapboxgl, { GeoJSONSource } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { SpotsProps } from '../data/schema';
import React, { useEffect, useState } from 'react';
import * as turf from '@turf/turf';
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
    if (!mapContainer.current) return;
    if (map.current) return;
    const initMap = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/space-waves/clsk3h19n00c201qu5gzz78n9', // Consider changing to satellite-v9 if needed
      center: [lng, lat],
      zoom: zoom,
    });
    initMap.on('load', () => {
      map.current?.addSource('locations', {
        type: 'geojson',
        data: locations,
      });

      // Additional earthquake layer
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
  }, [lat, lng, locations, map, zoom]);

  interface Dataset {
    bounds: [number, number, number, number];
    created: string;
    description: string | null;
    features: number;
    id: string;
    modified: string;
    name: string;
    owner: string;
    size: number;
  }

  React.useEffect(() => {
    const fetchDataSets = async () => {
      const res = await fetch(`/api/mapbox-data`);
      const data = await res.json();
      console.log(data);
      // create an array of dataset ids
      const dataSetIds = data.map((dataset: Dataset) => dataset.id);
      dataSetIds.forEach((datasetId: string) => {
        fetch(`https://api.mapbox.com/datasets/v1/space-waves/${datasetId}/features?access_token=${ACCESS_TOKEN}`)
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
          });
      });

      return data;
    };
    fetchDataSets();
  }, []);
  React.useEffect(() => {
    if (!map.current) return;

    // Remove old markers
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    // Add new markers
    for (const feature of locations.features) {
      const el = document.createElement('div');
      // Tailwind Classname
      el.className = `h-[32px] w-[22px] marker drop-shadow-lg`;
      el.setAttribute('data-marker', feature.properties.venue);
      el.addEventListener('click', () => {
        map.current?.flyTo({
          center: feature.geometry.coordinates,
          zoom: 15,
        });
      });

      const popup = new mapboxgl.Popup({ offset: 16, closeOnClick: false })
        .setLngLat(feature.geometry.coordinates)
        .setHTML(
          `
                <div class="name tracking-tighter">${feature.properties.name}</div>
                <div class="text-gray-10 tracking-tighter">
                  ${feature.properties.area} 
                </div>
        `
        );

      const marker = new mapboxgl.Marker({ element: el, offset: [0, 0] })
        .setLngLat(feature.geometry.coordinates)
        .setPopup(popup)
        .addTo(map.current);

      markers.current.push(marker);
    }
  }, [locations]);

  React.useEffect(() => {
    if (!map.current) return;
    const source = map.current?.getSource('locations') as GeoJSONSource;
    if (source) {
      source.setData(locations);
    }
  }, [locations, map]);

  React.useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(Number(map.current?.getCenter().lng.toFixed(4)));
      setLat(Number(map.current?.getCenter().lat.toFixed(4)));
      setZoom(Number(map.current?.getZoom().toFixed(2)));
    });
  });

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
