import React from 'react';

async function fetchTracks() {
  try {
    const response = await fetch('/api/listTrails');
    const tracksArray = await response.json();
    return tracksArray;
    console.log(tracksArray);
  } catch (error) {
    console.error(error);
  }
}

export default fetchTracks;
