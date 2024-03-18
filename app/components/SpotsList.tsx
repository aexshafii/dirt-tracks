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
const inter = Inter({ subsets: ['latin'] });

//Get  name of the spot
type Geometry = {
  type: string;
  coordinates: [number, number];
};

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
  const { map, markers } = useMapContext();

  const flyToSpot = (location: FlyToSpot) => {
    if (!map?.current) return;
    map.current.flyTo({
      center: location.coordinates,
      zoom: 15,
    });
  };

  const togglePopup = (feature: Feature) => {
    if (!map?.current) return;
    //console.log('here', feature);

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
    // const fetchData = async () => {
    //   const tracksArray = await fetchTracks();
    //   const coordinates = tracksArray.coordinates;

    //   coordinates.forEach((coordinate: any, index: number) => {
    //     console.log(coordinate);
    //     //  new mapboxgl.Marker().setLngLat(coordinate).addTo(initMap);

    //   });
    // };
    // fetchData();
  };

  const handleClick = (feature: Feature) => {
    if (bottomSheetRef?.current) {
      bottomSheetRef.current.snapTo(({ headerHeight }) => headerHeight);
    }
    flyToSpot({
      type: 'Point',
      coordinates: feature.coordinates,
    });
    togglePopup(feature);
  };

  // async function getData() {
  //   const res = await fetch(
  //     'https://api.mapbox.com/datasets/v1/space-waves/clsini8fa195j1tpcsrhudsf4/features?access_token=pk.eyJ1Ijoic3BhY2Utd2F2ZXMiLCJhIjoiY2xzaWprNnFyMWV6bDJ2cjI2Z3k3cWJjeiJ9.CFoO_J41AuEvImG63SkUpg'
  //   );
  //   if (!res.ok) {
  //     throw new Error('Failed to fetch data');
  //   }
  //   return res.json();
  // }
  // React.useEffect(() => {
  //   const fetchData = async () => {
  //     const data = await getData();
  //     console.log(data.features[0].geometry.coordinates);
  //     const coordinates = data.features[0].geometry.coordinates;
  //     var line = turf.lineString(coordinates);
  //     var length = turf.length(line, { units: 'kilometers' });
  //     // Do something with the data
  //     console.log(length);
  //     return length;
  //   };

  //   fetchData();
  // }, []);
  // console.log(locations);
  console.log(locations);
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
      className="cursor-pointer p-3 flex items-center text-sm justify-between self-stretch rounded-md bg-white shadow-card"
    >
      <div className="tracking-tighter font-[450]">
        <div>{name}</div>
        {/* <div className="text-gray-10">
          {area} - {length}
        </div> */}
      </div>
      {/* <Chip type={type} /> */}
    </div>
  );
};
