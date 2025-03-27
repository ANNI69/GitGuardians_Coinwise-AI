import 'dotenv/config';
import express from 'express';
import cors from 'cors';
<<<<<<< HEAD
import { processTransactionData } from './bookeeping.js';
=======
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import userRoutes from './routes/userRoutes.js';

// Load environment variables
dotenv.config();
>>>>>>> 4e8efc10e81d8085bc072fc14322fac1faef15cf

// Initialize Firebase Admin
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Transaction Processing Endpoint
app.post('/api/process-statement', async (req, res) => {
  try {
    if (!req.body?.transactionData) {
      return res.status(400).json({ error: 'No transaction data provided' });
    }

<<<<<<< HEAD
    const transactionData = req.body.transactionData;
    const salary = req.body.salary ? parseFloat(req.body.salary) : null;
    
    const result = await processTransactionData(transactionData, salary);

    res.json({
      success: true,
      count: result.transactions.length,
      transactions: result.transactions,
      spendingAnalysis: result.spendingAnalysis
    });
  } catch (error) {
    console.error('Processing Error:', error);
    res.status(500).json({ 
      error: 'Failed to process transactions',
      details: error.message
    });
  }
=======
// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to CoinWise AI API' });
>>>>>>> 4e8efc10e81d8085bc072fc14322fac1faef15cf
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
