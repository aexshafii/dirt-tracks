import * as turf from '@turf/turf';
export const calculateDistance = (data: any) => {
  // if data is muyltiLineString
  let line;
  console.log(data[0].length > 3);
  if (data[0].length > 3) {
    line = turf.multiLineString(data);

    var length = turf.length(line);
    length = Math.round(length);
    console.log('length', length);
    return length;
  } else {
    console.log(data[0].length > 2);

    // if data is LineString
    line = turf.lineString(data);
    var length = turf.length(line);
    length = Math.round(length);

    console.log('length', length);
    return length;
  }
};
