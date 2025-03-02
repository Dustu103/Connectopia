const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("✅ MongoDB Connected Successfully");

        mongoose.connection.on('disconnected', () => {
            console.warn("⚠️ MongoDB Disconnected! Attempting to Reconnect...");
            reconnectDB();
        });

    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error.message);
        setTimeout(reconnectDB, 5000); // Retry after 5 seconds
    }
};

// Reconnection function
const reconnectDB = async () => {
    console.log("🔄 Attempting to Reconnect to MongoDB...");
    await connectDB();
};

// Handling database errors
mongoose.connection.on('error', (err) => {
    console.error("❗ MongoDB Error:", err.message);
    mongoose.disconnect();
});

module.exports = connectDB;
