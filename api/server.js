import express from 'express';
import { MongoClient } from 'mongodb';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();  

const app = express();
const port = process.env.PORT || 3000;

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
let collection;

app.use(express.json());
app.use(express.static(path.resolve()));

app.get("/", (req, res) => {
  res.sendFile(path.resolve("index.html"));
});

app.post("/api/saveData", async (req, res) => {
  try {
    const { username, emoji } = req.body;
    if (!username || !emoji) return res.status(400).json({ message: "Username and emoji required" });

    const result = await collection.insertOne({ username, emoji, timestamp: new Date() });
    res.status(201).json({ message: "Data saved", id: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving data", error: err.message });
  }
});

async function startServer() {
  try {
    await client.connect();
    const db = client.db("ROSPL_Project");
    collection = db.collection("Users");
    app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

startServer();
