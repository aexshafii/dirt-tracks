# Dirt-Tracks: Bali Off-Road Motorbike Tracks

Welcome to the Dirt-Tracks open source project. This project is a Next.js application styled with Tailwind CSS that provides a comprehensive map of off-road motorbike tracks in Bali, Indonesia, using Mapbox. This collection of dual sport tracks is curated by our community of riders. Whether you're an experienced rider looking for a new adventure, or a beginner looking for safe and scenic routes, our map has something for everyone.

## Features

- Interactive map of Bali highlighting off-road motorbike tracks.
- Detailed information about each track, including length, area, starting point
- User-contributed tracks and reviews.

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

## Uploading a Track via Tilesets on Mapbox Studio

1. Go to Mapbox Studio and navigate to the Tilesets section.
2. Click on the "New tileset" button and select "Upload file".
3. Choose your track file (GeoJSON, Shapefile, KML, etc.) and upload it.
4. Once the upload is complete, Mapbox Studio will process the file and create a tileset. Make sure it is publicly acessible

## Fetching Tracks in the Application

1. In your `.env.local` file, make sure you have your Mapbox access token defined as `NEXT_PUBLIC_MAPBOX_TOKEN`.
2. In your application, fetch tracks using your tilesets id

## Contributing

We welcome contributions from the community. Whether you want to add a new track, improve the interface, or fix a bug, your contributions are always appreciated. Please read our [contributing guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- Thanks to all the riders who have contributed their favorite tracks and reviews.
- Special thanks to the open source community for their continuous support and inspiration.
