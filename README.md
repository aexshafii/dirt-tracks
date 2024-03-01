# Dirt Tracks

An interactive map with a curated collection of enduro dirt bike tracks in Bali.
See for yourself: https://dirt-tracks.vercel.app/

![alt text](public/app_screeshot.png)

## Features

- Interactive map of Bali highlighting off-road motorbike tracks.
- Basic information about 10 tracks, including length, area, starting point

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repository:
   git clone https://github.com/aexshafii/dirt-tracks.git
2. Navigate into the project directory:
   cd dirt-tracks
3. Install the dependencies:
   npm install
4. Start the development server:

npm run dev

The application will start running at `http://localhost:3000`.

### How to Contribute

Add any geojson file to the public/tracks folder and it will render on the map. If you have a gpx or kml you can use the following tool to convert it into a geojson file: `https://mapbox.github.io/togeojson/`

For now, the properties seen on the interactive chips and starting point coordinates need to be manually added to the app/data/spots.json file. To do so, copy this object and append it to the existing list and modify the properties and coordinates as needed.

{
"type": "Feature",
"geometry": {
"type": "Point",
"coordinates": [115.3983956, -8.2217413]
},
"properties": {
"id": 10,
"name": "Batur to Ubud",
"area": "Besakih",
"length": "114.93 km",
"type": "mixed track"
}
}

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- Thanks to all the riders who have contributed their favorite tracks and reviews.
- Special thanks to the open source community for their continuous support and inspiration.
