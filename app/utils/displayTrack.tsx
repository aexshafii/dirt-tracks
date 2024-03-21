import React from 'react';

export default function displayTrack(
  location: { fileName: string; coordinates: [number, number]; name: string },
  locations: Array<{ fileName: string; coordinates: [number, number]; name: string }>,
  map: React.RefObject<mapboxgl.Map | null>
) {
  if (map?.current) {
    // remove all layers with foreach
    map.current.getStyle().layers?.forEach((layer) => {
      // if any of the layers has an id that maches with any of the locations file name, remove it
      locations.forEach((location) => {
        if (layer.id === location.fileName) {
          console.log('removing layer', layer.id);
          map.current?.removeLayer(layer.id);
          map.current?.removeSource(layer.id);
        }
      });
    });

    //remove all sources

    map.current?.addSource(`${location.fileName}`, {
      type: 'geojson',
      // Reference the file from your repository
      data: `tracks/${location.fileName}`,
    });

    map.current.addLayer({
      id: location.fileName,
      type: 'line',
      source: location.fileName,
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
        visibility: 'visible',
      },
      paint: {
        'line-color': 'hsl(267, 80%, 53%)',
        'line-width': 3,
      },
    });
  }
}
