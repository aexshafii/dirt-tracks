// pages/api/tracks.js

import { NextApiRequest, NextApiResponse } from 'next';

const downloadFile = async (fileName: any) => {
  // remove the file extension
  fileName = fileName.fileName;
  const baseUrl = 'https://foamyweb.s3.ap-southeast-2.amazonaws.com/';
  const fileUrl = baseUrl + fileName + '.gpx';
  // download the file into browser
  let res: Response;
  try {
    res = await fetch(fileUrl);
  } catch (error) {
    return console.error('error', error);
  }

  const data = await res.text();

  return data;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = await downloadFile({ fileName: req.query.fileName as string });
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to read the directory' });
  }
}
