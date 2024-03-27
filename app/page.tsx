import { Map, MapProvider } from './components/Map';

import { SpotsList } from './components/SpotsList';
import { MobileDrawer } from './components/Drawer';

import { getTrailsData } from '@/pages/api/getTrailsData';

type Coordinate = [number, number];

export default async function Home() {
  //console.log('tracksData', tracksData);
  const tracksData = await getTrailsData();

  // console.log('data', tracksData);
  return (
    <MapProvider locations={tracksData}>
      <div className="flex h-full">
        <div className="absolute py-8 px-6 sm:px-9 sm:py-9 z-20 drop-shadow-xl  ">{/* <Logo /> */}</div>
        <div className="hidden sm:block fade max-w-sm p-9 w-full h-screen max-h-screen z-10 overflow-scroll  -scale-x-100">
          <div className="flex gap-9 flex-col -scale-x-100">
            <div className="flex flex-col gap-3 h-full z-10 pt-16 pb-8 ">{<SpotsList locations={tracksData} />}</div>
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
