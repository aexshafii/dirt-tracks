'use client';

import { SpotProps, SpotsProps } from '../data/schema';
import { useMapContext } from './Map';
import { Chip } from './Chip';
import mapboxgl from 'mapbox-gl';
import { Inter } from 'next/font/google';
import { BottomSheetRef } from 'react-spring-bottom-sheet';
import * as turf from '@turf/turf';
import React from 'react';
import fetchTracks from './Tracks';
import displayTrack from '../utils/displayTrack';
const inter = Inter({ subsets: ['latin'] });

//Get  name of the spot
type Feature = {
  coordinates: [number, number];
  name: string;
};

type FlyToSpot = {
  type: string;
  coordinates: [number, number];
};

export const SpotsList = ({
  locations,
  bottomSheetRef,
}: {
  locations: { fileName: string; coordinates: [number, number]; name: string }[];
  bottomSheetRef?: React.RefObject<BottomSheetRef>;
}) => {
  const { map, markers, tracks } = useMapContext();

  const flyToSpot = (location: FlyToSpot) => {
    if (!map?.current) return;
    map.current.flyTo({
      center: location.coordinates,
      zoom: 10,
    });
  };

  const togglePopup = (feature: Feature) => {
    if (!map?.current) return;

    const marker = markers?.current?.find(
      (marker) => marker.getLngLat().lng === feature.coordinates[0] && marker.getLngLat().lat === feature.coordinates[1]
    );

    markers?.current?.filter((m) => m !== marker).map((m) => m?.getPopup()?.remove());

    if (marker) {
      const popup = marker.getPopup();
      if (!popup.isOpen()) {
        marker.togglePopup();
      }
    }
  };

  const handleClick = async (location: { fileName: string; coordinates: [number, number]; name: string }) => {
    if (bottomSheetRef?.current) {
      bottomSheetRef.current.snapTo(({ headerHeight }) => headerHeight);
    }
    flyToSpot({
      type: 'Point',
      coordinates: location.coordinates,
    });
    togglePopup(location);

    // Load the location data for the selected spot

    // Add the location data to the map
    if (map && map.current) {
      displayTrack(location, locations, map);
    }
  };

  return (
    <>
      {locations.map((location: { fileName: string; coordinates: [number, number]; name: string }, i: number) => (
        <Spot
          handleClick={() => handleClick(location)}
          key={i}
          id={i}
          name={location.name}
          // type={feature.properties.type}
          // length={feature.properties.length}
          // area={feature.properties.area}
        />
      ))}
    </>
  );
};

interface ExtendedSpotProps extends SpotProps {
  handleClick: () => void;
}

export const Spot = ({ id, name, handleClick }: ExtendedSpotProps) => {
  return (
    <div
      onClick={handleClick}
      className="cursor-pointer p-3 flex items-center text-sm justify-between self-stretch rounded-md bg-gray-13 shadow-card"
    >
      <div className="tracking-tighter font-[450] text-white ">
        <div>{name}</div>
        {/* <div className="text-gray-10">
          {area} - {length}
        </div> */}
      </div>
      {/* <Chip type={type} /> */}
    </div>
  );
};
