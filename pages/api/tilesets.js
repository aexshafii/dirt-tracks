export default async function handler(req, res) {
  const SECRET_TOKEN = process.env.API_KEY; // Accessing the secret token server-side

  try {
    const response = await fetch(`https://api.mapbox.com/tilesets/v1/space-waves/?access_token=${SECRET_TOKEN}`);

    if (!response.ok) {
      // If the response is not 2xx, we should not attempt to parse it as JSON
      throw new Error(`Mapbox API responded with status: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data); // Send the successful response
  } catch (error) {
    console.error(error); // Log the error to the server console for debugging
    res.status(500).json({ message: 'Internal Server Error', error_detail: error.message });
  }
}
