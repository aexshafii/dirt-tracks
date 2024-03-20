'use client';

import mapboxgl, { GeoJSONSource } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useEffect, useState } from 'react';
import * as turf from '@turf/turf';
import { distinctColors } from '../constants/constants';
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
  locations: Array<{ fileName: string; coordinates: [number, number]; name: string }>;
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
      style: 'mapbox://styles/space-waves/clsy0mhbw00bp01qo66qu0ol9', // Consider changing to satellite-v9 if needed
      center: [lng, lat],
      zoom: zoom,
    });

    console.log(locations);

    initMap.on('load', () => {
      initMap.addSource('some-id', {
        type: 'vector',
        tiles: ['https://studio.mapbox.com/tilesets/space-waves.clsini8fa195j1tpcsrhudsf4-4g7v2'],
      });
    });

    locations.forEach((location, index) => {
      const colorIndex = index % distinctColors.length;
      const orderedColor = distinctColors[colorIndex];
      initMap.on('load', () => {
        initMap.addSource(`${location.fileName}`, {
          type: 'geojson',
          // Reference the file from your repository
          data: `tracks/${location.fileName}`,
        });

        initMap.addLayer({
          id: `${location.fileName}`,
          type: 'line',
          source: `${location.fileName}`,
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': orderedColor,
            'line-width': 3,
          },
        });
      });
    });

    //  tilesets from mapbox
    //  Add the url and source layer for any additional tilesets you want to include
    // const tilesets = [
    //   {
    //     url: 'mapbox://space-waves.clsini8fa195j1tpcsrhudsf4-4g7v2',
    //     id: 'mapbox-terrain-1',
    //     sourceLayer: 'Speed_Track_Besakih',
    //   },
    //   {
    //     url: 'mapbox://space-waves.9ietosjt',
    //     id: 'mapbox-terrain-2',
    //     sourceLayer: 'tracks',
    //   },
    //   {
    //     url: 'mapbox://space-waves.0b6luok1',
    //     id: 'mapbox-terrain-3',
    //     sourceLayer: 'tracks',
    //   },
    //   {
    //     url: 'mapbox://space-waves.7roo2d1g',
    //     id: 'mapbox-terrain-4',
    //     sourceLayer: 'Bangli_offroad_loop-13d3jg',
    //   },
    //   {
    //     url: 'mapbox://space-waves.88lvpw2c',
    //     id: 'mapbox-terrain-5',
    //     sourceLayer: 'tracks',
    //   },
    //   {
    //     url: 'mapbox://space-waves.3gfy9spy',
    //     id: 'mapbox-terrain-6',
    //     sourceLayer: 'tracks',
    //   },
    //   {
    //     url: 'mapbox://space-waves.5ersva15',
    //     id: 'mapbox-terrain-7',
    //     sourceLayer: 'tracks',
    //   },
    //   {
    //     url: 'mapbox://space-waves.cnidsl91',
    //     id: 'mapbox-terrain-8',
    //     sourceLayer: 'tracks',
    //   },
    //   {
    //     url: 'mapbox://space-waves.6b9jbuvs',
    //     id: 'mapbox-terrain-9',
    //     sourceLayer: 'tracks',
    //   },
    //   {
    //     url: 'mapbox://space-waves.be6noc9r',
    //     id: 'mapbox-terrain-10',
    //     sourceLayer: 'tracks',
    //   },
    //   // Add more objects for each tileset you want to include, specifying the 'id' and 'sourceLayer' for each
    // ];

    // initMap.on('load', () => {
    //   tilesets.forEach((tilesetObj, index) => {
    //     // Randomly select a color from the predefined set
    //     const colorIndex = index % distinctColors.length; // This ensures the index wraps around
    //     const orderedColor = distinctColors[colorIndex];
    //     // Add source for each URL
    //     initMap.addSource(tilesetObj.id, {
    //       type: 'vector',
    //       url: tilesetObj.url,
    //     });

    //     // Add layer for each source with the specified 'source-layer'
    //     initMap.addLayer({
    //       id: `${tilesetObj.id}-terrain-data`,
    //       type: 'line',
    //       source: tilesetObj.id,
    //       'source-layer': tilesetObj.sourceLayer,
    //       layout: {
    //         'line-join': 'round',
    //         'line-cap': 'round',
    //       },
    //       paint: {
    //         'line-color': orderedColor,
    //         'line-width': 3,
    //       },
    //     });
    //   });
    // });

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
    if (!map.current) return;

    // Remove old markers
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];
    // Add new markers
    for (const location of locations) {
      const el = document.createElement('div');
      // Tailwind Classname
      el.className = `h-[32px] w-[22px] marker drop-shadow-lg`;
      el.addEventListener('click', () => {
        map.current?.flyTo({
          center: location.coordinates,
          zoom: 15,
        });
      });

      const popup = new mapboxgl.Popup({ offset: 16, closeOnClick: false }).setLngLat(location.coordinates).setHTML(
        `
                <div class="name tracking-tighter">${location.name}</div>
                <div class="text-gray-10 tracking-tighter">
Starting Point
                </div>
        `
      );

      const marker = new mapboxgl.Marker({ element: el, offset: [0, 0] })
        .setLngLat(location.coordinates)
        .setPopup(popup)
        .addTo(map.current);
      //  el.className = `h-[32px] w-[22px] marker drop-shadow-lg`;
      // el.setAttribute('data-marker', coordinate.properties.type);
      markers.current.push(marker);
    }
  }, [locations]);

  // React.useEffect(() => {
  //   if (!map.current) return;
  //   const source = map.current?.getSource('locations') as GeoJSONSource;
  //   if (source) {
  //     source.setData(locations);
  //   }
  // }, [locations, map]);

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
