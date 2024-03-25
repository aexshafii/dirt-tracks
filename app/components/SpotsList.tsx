'use client';

import { SpotProps, SpotsProps } from '../data/schema';
import { useMapContext } from './Map';
import { Chip } from './Chip';
import { Inter } from 'next/font/google';
import { BottomSheetRef } from 'react-spring-bottom-sheet';
import * as turf from '@turf/turf';
import React from 'react';
import displayTrack from '../utils/displayTrack';
import { calculateDistance } from '../utils/calculateDistance';

//Get  name of the spot
type Feature = {
  coordinates: [number, number];
  name: string;
};

type FlyToSpot = {
  type: string;
  coordinates: [number, number];
};
const allDistancesArray = [] as any;

export const SpotsList = ({
  locations,
  bottomSheetRef,
}: {
  locations: { fileName: string; coordinates: [number, number]; name: string; allCoordinates: any }[];
  bottomSheetRef?: React.RefObject<BottomSheetRef>;
}) => {
  const { map, markers } = useMapContext();

  const flyToSpot = (location: FlyToSpot) => {
    if (!map?.current) return;
    map.current.flyTo({
      center: location.coordinates,
      zoom: 10,
    });
  };
  locations.map(async (location) => {
    console.log('location', location.allCoordinates);
    //console.log('allCoordinates', allCoordinates);
    const itemDistance = await calculateDistance(location.allCoordinates);
    console.log('itemDistance', itemDistance);
    allDistancesArray.push(itemDistance);
    console.log('all2', allDistancesArray);
  });

  // display distance under name of the spot
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
  console.log('all', allDistancesArray);
  return (
    <>
      {locations.map((location: { fileName: string; coordinates: [number, number]; name: string }, i: number) => (
        <Spot
          handleClick={() => handleClick(location)}
          key={i}
          id={i}
          name={location.name}
          distance={allDistancesArray[i]}
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

interface ExtendedSpotProps extends SpotProps {
  handleClick: () => void;
  distance: any; // Replace 'any' with the appropriate type for the 'distance' property
}

export const Spot = ({ id, name, handleClick, distance }: ExtendedSpotProps) => {
  console.log('distance', distance);
  return (
    <div
      onClick={handleClick}
      className="cursor-pointer p-3 flex items-center text-sm justify-between self-stretch rounded-md bg-gray-13 shadow-card"
    >
      <div className="tracking-tighter font-[450] text-white ">
        {name}
        <div>{distance} km</div>
        {/* <div className="text-gray-10">
          {area} - {length}
        </div> */}
      </div>
      {/* <Chip type={type} /> */}
    </div>
  );
};
