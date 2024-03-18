import { Map, MapProvider } from './components/Map';
import dynamic from 'next/dynamic';
import { spotsSchema } from './data/schema';
import { promises as fs } from 'fs';
import path from 'path';
import { FilterDropdown, VenueFilters, PostcodeWheel } from './components/FilterDropdown';
import { Logo } from './components/Logo';
import { SpotsList } from './components/SpotsList';
import { Drawer } from 'vaul';
import { MobileDrawer } from './components/Drawer';
import { get } from 'http';
import getTrailsData from './components/Tracks';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { object } from 'zod';
import { NextPageContext } from 'next';

// function getPostcode(postcode: string) {
//   const match = postcode.match(/^[^\d]+/);
//   return match ? match[0] : "";
// }
type Coordinate = [number, number];

type TrailData = {
  geojsonFiles: string[];
  names: string[];
  coordinates: Coordinate[];
};

type ServerSideProps = {
  props: {
    trailData: TrailData;
  };
};
async function getSpots() {
  // const getServerSideProps: GetServerSideProps<{ trailData: TrailData }> = async () => {
  //   // Fetch data from external API
  //   const res = await fetch('http://localhost:3000/api/getTrailsData');
  //   const trailData: TrailData = await res.json();

  //   // Pass data to the page via props
  //   return { props: { trailData } };
  // };

  const getServerSideProps = async () => {
    // Fetch data from external API
    const res = await fetch('http://localhost:8080/api/getTrailsData');
    const data: TrailData = await res.json();
    // Pass data to the page via props

    return { props: { data } };
  };

  // const data = await fs.readFile(path.join(process.cwd(), 'app/data/spots.json'));
  //const data2 = await getTrailsData();

  // make it a string
  const trailsData = await getServerSideProps();

  const rawData = trailsData.props.data;
  console.log('tdata', rawData.names);
  // associate the data from each keys according to it's index
  const fileNames = rawData.geojsonFiles;
  // console.log('fileNames', fileNames);
  const tracksArray = [] as Array<{ fileName: string; coordinates: Coordinate; name: string }>;
  fileNames.map((fileName, i) => {
    const tracksProps = { fileName: fileName, coordinates: rawData.coordinates[i], name: rawData.names[i] };
    tracksArray.push(tracksProps);
    // console.log(tracksProps);
  });
  //console.log('props', tracksArray);
  return tracksArray;
}

export default async function Home({}: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const tracksData = await getSpots();
  //console.log('tracksData', tracksData);
  return (
    <MapProvider locations={tracksData}>
      <div className="flex h-full">
        <div className="absolute py-8 px-6 sm:px-9 sm:py-9 z-20 drop-shadow-xl">{/* <Logo /> */}</div>
        <div className="hidden sm:block fade max-w-sm p-9 w-full h-screen max-h-screen z-10 overflow-scroll -scale-x-100">
          <div className="flex gap-9 flex-col -scale-x-100">
            <div className="flex flex-col gap-3 h-full z-10 pt-16 pb-8">{<SpotsList locations={tracksData} />}</div>
          </div>
        </div>

        <div className="hidden sm:flex p-9 gap-2.5 w-full justify-end h-fit z-10">
          {/* <FilterDropdown
            label="Filter by Postcode"
            filterValue="postcode"
            align="center"
            sideOffset={12}
          >
            <PostcodeWheel mobile={false} />
          </FilterDropdown> */}
          {/* <FilterDropdown
            filterValue="venue"
            label="Filter by Type"
            align="start"
            sideOffset={6}
          >
            <VenueFilters mobile={false} />
          </FilterDropdown> */}
        </div>

        <div className="block sm:hidden">
          <MobileDrawer spots={tracksData} />
        </div>
        <Map />
      </div>
    </MapProvider>
  );
}
