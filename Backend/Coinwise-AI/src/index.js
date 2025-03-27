import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// import userRoutes from './routes/userRoutes.js';
import askSuggestions from './service/askSuggestion.js';

// Load environment variables
dotenv.config();

// Initialize Firebase Admin
// const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// app.use('/api/users', userRoutes);
// Suggestion route
app.use('/api/suggestions', askSuggestions);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to CoinWise AI API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 