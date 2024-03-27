import * as turf from '@turf/turf';
export const calculateDistance = (data: any) => {
  // if data is muyltiLineString
  let line;
  if (data[0].length > 3) {
    line = turf.multiLineString(data);

    var length = turf.length(line);
    length = Math.round(length);
    return length;
  } else {
    // if data is LineString
    line = turf.lineString(data);
    var length = turf.length(line);
    length = Math.round(length);

    return length;
  }
};
