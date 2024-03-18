async function getTrailsData() {
  try {
    const response = await fetch('/api/getTrailsData');
    const tracksArray = await response.json();
    // console.log(tracksArray);

    return tracksArray;
  } catch (error) {
    console.error(error);
  }
}

export default getTrailsData;
