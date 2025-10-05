import { MongoClient } from 'mongodb';

const uri = process.env.mongodb+srv:yashapte163_db_user:ziYacpWqAC9sVeup@cluster0.pzo7n77.mongodb.net/ROSPL_Project?retryWrites=true&w=majority;

  throw new Error('Please add your MongoDB connection string to environment variables (MONGODB_URI)');
}

let client;
let clientPromise;

if (!client) {
  client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  clientPromise = client.connect();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    await clientPromise;
    const db = client.db('ROSPL_Project');
    const collection = db.collection('Users');

    const { username, emoji } = req.body;

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
}
