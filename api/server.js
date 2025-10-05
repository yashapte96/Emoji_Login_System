const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const uri = process.env.MONGODB_URI || "mongodb+srv://yashapte163_db_user:ziYacpWqAC9sVeup@cluster0.pzo7n77.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

let collection;

async function startServer() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("ROSPL_Project");
    collection = db.collection("Users");

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

startServer();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Test endpoint to check server status
app.get("/api/test", (req, res) => {
  console.log("Test API called");
  res.json({ message: "Server is up and running!" });
});

app.post("/api/saveData", async (req, res) => {
  try {
    console.log("Received data:", req.body);

    const username = decodeURIComponent(req.body.username);
    const emoji = decodeURIComponent(req.body.emoji);

    const result = await collection.insertOne({ username, emoji, timestamp: new Date() });

    console.log("Data saved with ID:", result.insertedId);

    res.status(201).json({ message: "Data saved", id: result.insertedId });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ message: "Error saving data" });
  }
});
