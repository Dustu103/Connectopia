const mongoose = require("mongoose");


const connectDataBase = async function connectToDatabase() {
  try {
    const uri = process.env.MONGO_URI;

    // Connect to MongoDB
    await mongoose.connect(uri);
    console.log("Successfully connected to the MongoDB database");

    // Optional: Handle connection events
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "MongoDB connection error:"));
    db.once("open", function () {
      console.log("MongoDB connected!");
    });
  } catch (err) {
    console.error("Error connecting to the MongoDB database", err);
  }
}

// Call the async function to connect to the database
module.exports= connectDataBase;