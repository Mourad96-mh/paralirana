// ---------------------------------------------------------------------------
// Cached Mongoose connection (serverless-safe).
//
// In serverless (Vercel) every invocation may reuse a warm Lambda, so we cache
// the connection on the global object to avoid opening a new socket per request.
// ---------------------------------------------------------------------------

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// eslint-disable-next-line no-var
declare global {
  var _mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global._mongoose ?? { conn: null, promise: null };
global._mongoose = cached;

export async function connectDB(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not set. Add it to .env.local (see .env.example)."
    );
  }
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
