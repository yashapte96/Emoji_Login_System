const { MongoClient } = require('mongodb');

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

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    await clientPromise;
    const db = client.db('ROSPL_Project');
    const collection = db.collection('Users');

    const { username, emoji } = req.body;

    if (!username || !emoji) {
      return res.status(400).json({ message: 'Username and emoji are required' });
    }

    const result = await collection.insertOne({
      username: decodeURIComponent(username),
      emoji: decodeURIComponent(emoji),
      timestamp: new Date()
    });

    res.status(201).json({ message: 'Data saved', id: result.insertedId });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ message: 'Error saving data', error: error.message });
  }
};
