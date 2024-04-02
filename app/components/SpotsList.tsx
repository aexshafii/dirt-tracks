'use client';

import { SpotProps, SpotsProps } from '../data/schema';
import { useMapContext } from './Map';
import { Chip } from './Chip';
import { BottomSheetRef } from 'react-spring-bottom-sheet';
import React from 'react';
import displayTrack from '../utils/displayTrack';
import { useState } from 'react';

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
  const { map, markers, allDistancesArray, selectedSpot, setSelectedSpot } = useMapContext();

  const flyToSpot = (location: FlyToSpot) => {
    if (!map?.current) return;
    map.current.flyTo({
      center: location.coordinates,
      zoom: 10,
    });
  };

  // update the distance array in parent component

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

  const handleClick = async (
    location: {
      fileName: string;
      coordinates: [number, number];
      name: string;
    },
    i: number
  ) => {
    setSelectedSpot(i);
    // if bottomSheetRef is not null, snap to the header height
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
          handleClick={() => handleClick(location, i)}
          key={i}
          id={i}
          name={location.name}
          distance={allDistancesArray[i]}
          selected={i === selectedSpot}
          location={location}
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
  selected: boolean;
  location: { fileName: string; coordinates: [number, number]; name: string };
}

export const Spot = ({ id, name, handleClick, distance, selected, location }: ExtendedSpotProps) => {
  console.log(location);
  // make the border two colors
  const selectedStyle = selected ? { borderColor: 'hsl(267, 80%, 53%)', borderWidth: 2 } : {};
  // Inside your component
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (fileName: string) => {
    if (isDownloading) return;

    setIsDownloading(true);

    console.log('clicked');
    const res = await fetch(`/api/downloadFile?fileName=${fileName}`);
    console.log(res.body);
    const data = await res.json();
    console.log(data);
    if (!data.data) {
      alert(data.error);
      setIsDownloading(false);
      return;
    }
    const element = document.createElement('a');
    const file = new Blob([data.data], { type: 'application/gpx+xml' });
    element.href = URL.createObjectURL(file);
    element.download = `${fileName}.gpx`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();

    setIsDownloading(false);
  };
  return (
    <div
      style={selectedStyle}
      onClick={handleClick}
      className="cursor-pointer p-3 flex items-center text-sm justify-between self-stretch rounded-md bg-gray-13 shadow-card"
    >
      <div>
        <div className="tracking-tighter font-[450] text-white text-bold  ">{name} </div>
        <div className="tracking-tighter font-[450] text-gray-8 text-bold  pt-1 ">Length: {distance} km</div>
      </div>
      <button
        disabled={isDownloading}
        onClick={() => handleDownload(location.fileName.split('.')[0])}
        className="download border-none my-2 "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="white"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
          />
        </svg>
      </button>
    </div>
  );
};
