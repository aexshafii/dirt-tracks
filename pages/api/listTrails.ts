// pages/api/tracks.js
import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

// list all the geojson file names from public/tracks into an array for data manipulation in Map.tsx
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const tracksDirectory = path.join(process.cwd(), 'public', 'tracks');
  fs.readdir(tracksDirectory, (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to read the directory' });
      return;
    }

    // Filter files to only include .geojson files, if necessary
    const geojsonFiles = files.filter((file) => file.endsWith('.geojson'));

    res.status(200).json(geojsonFiles);
  });
}
