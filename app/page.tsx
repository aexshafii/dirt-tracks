import { Map, MapProvider } from './components/Map';

import { SpotsList } from './components/SpotsList';
import { MobileDrawer } from './components/Drawer';

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
  const getServerSideProps = async () => {
    // detect if production or development
    const baseUrl = process.env.NODE_ENV === 'production' ? 'https://dirt-tracks.vercel.app' : 'http://localhost:3000';
    const url = `${baseUrl}/api/getTrailsData`;

    console.log('url in use', url);
    // Fetch data from external API
    const res = await fetch(url);
    const data: TrailData = await res.json();
    // Pass data to the page via props
    return { props: { data } };
  };

  const trailsData = await getServerSideProps();

  const rawData = trailsData.props.data;
  //console.log('tdata', rawData.names);
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

export default async function Home() {
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
