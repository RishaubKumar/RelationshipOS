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

console.log('Loaded MONGODB_URI from dotenv:', process.env.MONGODB_URI);

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);

// basic test route
app.get('/', (req, res) => {
  res.send('RelationshipOS API is running on Vercel...');
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/relationshipOS';

// connect to database globally (cached in serverless environments)
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Successfully connected to MongoDB Atlas.');
})
.catch((err) => {
  console.error('Failed to connect to MongoDB:', err.message);
});

// only call app.listen if running locally (not in Vercel serverless environment)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running locally on port ${PORT}`);
  });
}

// export app for vercel serverless function compatibility
module.exports = app;
