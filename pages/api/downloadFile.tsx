// pages/api/tracks.js

import { NextApiRequest, NextApiResponse } from 'next';

const downloadFile = async (fileName: any) => {
  fileName = fileName.fileName;
  console.log('fileName:', fileName);
  const baseUrl = 'https://dirt-tracks.s3.ap-southeast-2.amazonaws.com/';
  const fileUrl = baseUrl + fileName + '.gpx';
  // download the file into browser
  let res;
  try {
    res = await fetch(fileUrl);
  } catch (error: any) {
    console.error('Error fetching file:', error);
    return { data: null, error: 'Error fetching file: ' + error.message };
  }

  if (!res.ok) {
    const errorMessage = 'Access denied. You do not have permission to access this resource.';
    return { data: null, error: errorMessage };
  }

  console.log('Response:', res);

  try {
    const data = await res.text();
    return { data, error: null };
  } catch (error: any) {
    console.error('Error reading response text:', error);
    return { data: null, error: 'Error reading response text: ' + error.message };
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = await downloadFile({ fileName: req.query.fileName as string });
    console.log(data);
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to read the directory' });
  }
}
