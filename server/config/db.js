const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log("DEBUG MONGODB_URI =", process.env.MONGODB_URI);

    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is undefined. Check your .env file.");
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`🟢 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("🔴 MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;