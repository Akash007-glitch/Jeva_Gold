import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async (): Promise<void> => {
  if (isConnected) {
    console.log('MongoDB already connected');
    return;
  }

  const uri = process.env.MONGODB_URL;
  if (!uri) {
    console.error('❌ MONGODB_URL environment variable is not set');
    return;
  }

  try {
    await mongoose.connect(uri.trim(), {
      dbName: 'jeeva-gold',
      serverSelectionTimeoutMS: 10000, // 10s timeout
    });
    isConnected = true;
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.error('⚠️  Check: 1) MongoDB Atlas IP whitelist  2) MONGODB_URL in .env  3) Network/VPN');
    // Do not throw — Strapi will continue running; MongoDB-dependent routes will fail gracefully
  }
};

export default connectDB;

