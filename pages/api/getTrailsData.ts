// pages/api/tracks.js
import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

// list all the geojson file names from public/tracks into an array for data manipulation in Map.tsx
export async function getTrailsData() {
  const tracksDirectory = path.join(process.cwd(), 'public', 'tracks');
  const files = fs.readdirSync(tracksDirectory);

  // Filter files to only include .geojson files, if necessary
  const geojsonFiles = files.filter((file) => file.endsWith('.geojson'));

  const names = [] as string[];
  const coordinates = [] as [number, number][];
  geojsonFiles.forEach((file) => {
    const filePath = path.join(tracksDirectory, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const geojson = JSON.parse(fileContent);

    // Extract the name property
    const name = geojson.features[0].properties.name;
    const coordinate = geojson.features[0].geometry.coordinates[0].slice(0, 2);
    // add conditional to support different data structures for coordinates to make all current geojson files compatible
    // if the coordinates are [Array(3), Array(3)], then get array[0] and slice(0, 2) to get the first two coordinates
    if (Array.isArray(coordinate[0]) && coordinate[0].length === 3) {
      const [first, second] = coordinate[0];
      coordinates.push([first, second]);
    } else {
      coordinates.push(coordinate);
    }

    names.push(name);
  });

  const trailsData = { geojsonFiles, names, coordinates };

  const rawData = trailsData;
  // associate the data from each keys according to it's index
  const fileNames = rawData.geojsonFiles;
  const tracksArray = [] as Array<{ fileName: string; coordinates: [number, number]; name: string }>;
  fileNames.map((fileName, i) => {
    const tracksProps = { fileName: fileName, coordinates: rawData.coordinates[i], name: rawData.names[i] };
    tracksArray.push(tracksProps);
  });
  return tracksArray;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = await getTrailsData();
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to read the directory' });
  }
}
