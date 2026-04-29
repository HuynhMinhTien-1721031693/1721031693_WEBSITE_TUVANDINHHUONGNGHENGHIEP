import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("Missing MONGODB_URI in backend environment.");
    }

    cached.promise = mongoose.connect(uri, {
      dbName: "career_guidance",
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
