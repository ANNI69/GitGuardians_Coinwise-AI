import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { processTransactionData } from './bookeeping.js';

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
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
