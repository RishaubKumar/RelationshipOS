const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// load env vars from .env file
dotenv.config({ path: path.resolve(__dirname, '.env'), override: true });
dotenv.config({ path: path.resolve(__dirname, '..', '.env'), override: true });

const authRoutes = require('./src/routes/authRoutes');
const customerRoutes = require('./src/routes/customerRoutes');
const analyticsRoutes = require('./src/routes/analyticsRoutes');
const aiRoutes = require('./src/routes/aiRoutes');

// Check if environment variables are set (to display clearly in Vercel logs)
if (!process.env.MONGODB_URI) {
  console.error('CRITICAL DATABASE ERROR: MONGODB_URI environment variable is missing or undefined!');
} else {
  console.log('MongoDB connection string loaded successfully.');
}

const app = express();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/relationshipOS';

let connectionPromise = null;

// Helper function to manage MongoDB connection state
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  if (!connectionPromise) {
    console.log('Initiating database connection...');
    connectionPromise = mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then((m) => {
      console.log('Successfully connected to MongoDB Atlas.');
      return m;
    }).catch((err) => {
      console.error('Failed to connect to MongoDB:', err.message);
      connectionPromise = null;
      throw err;
    });
  }
  return connectionPromise;
};

// Start connecting to the database immediately
connectDB().catch((err) => {
  console.error('Initial background connection failed:', err.message);
});

// middlewares
app.use(cors());
app.use(express.json());

// Middleware to ensure database connection before handling requests
app.use(async (req, res, next) => {
  if (req.path === '/') {
    next();
  } else {
    try {
      await connectDB();
      next();
    } catch (err) {
      res.status(500).json({
        message: 'Database connection failed. Please configure MONGODB_URI on Vercel and whitelist Vercel IPs (0.0.0.0/0) in MongoDB Atlas.',
        error: err.message
      });
    }
  }
});

// routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);

// basic test route
app.get('/', (req, res) => {
  res.send('RelationshipOS API is running on Vercel...');
});

// only call app.listen if running locally (not in Vercel serverless environment)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running locally on port ${PORT}`);
  });
}

// export app for vercel serverless function compatibility
module.exports = app;
