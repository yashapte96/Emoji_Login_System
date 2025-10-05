import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error(
    'Please add your MongoDB connection string to environment variables (MONGODB_URI)'
  );
}

let client;
let clientPromise;

if (!client) {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default async function handler(req, res) {
  // Simple GET route for testing API status
  if (req.method === 'GET') {
    return res.status(200).json({ message: 'API is running!' });
  }

  // Only allow POST method for saving data
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Wait for database connection
    await clientPromise;
    const db = client.db('ROSPL_Project');
    const collection = db.collection('Users');

    // Extract username and emoji data from request body
    const { username, emoji } = req.body;

    if (!username || !emoji) {
      return res.status(400).json({ message: 'Username and emoji are required' });
    }

    // Insert data into MongoDB collection
    const result = await collection.insertOne({
      username: decodeURIComponent(username),
      emoji: decodeURIComponent(emoji),
      timestamp: new Date(),
    });

    // Respond with success and inserted document ID
    res.status(201).json({ message: 'Data saved', id: result.insertedId });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ message: 'Error saving data', error: error.message });
  }
}
