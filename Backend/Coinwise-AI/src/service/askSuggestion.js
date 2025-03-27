import express, { json } from 'express';
import cors from 'cors';
import { ChatGroq } from '@langchain/groq';
import { PromptTemplate } from '@langchain/core/prompts';
import { LLMChain } from '@langchain/core/chains';

require('dotenv').config();

const app = express();
app.use(cors());
app.use(json());

// Groq configuration
const template = `
<|system|>
You are a certified financial advisor specializing in personal finance and saving habits.
Provide concrete, numbered advice with specific examples. Keep responses under 150 words.
</s>
<|user|>
{question}
</s>
<|assistant|>`;

const prompt = new PromptTemplate({
  template,
  inputVariables: ["question"],
});

const model = new ChatGroq({
  temperature: 0.3,
  modelName: "llama2-70b-4096",
  apiKey: process.env.GROQ_API_KEY,
});

const chain = new LLMChain({
  llm: model,
  prompt: prompt,
});

// Keep the same /ask endpoint
app.post('/askSuggestion', async (req, res) => {
  try {
    const { question } = req.body;
    const response = await chain.call({ question });
    
    res.json({
      answer: response.text.trim().replace(/<\/?s>/g, ''), // Clean up response
    });
    
  } catch (error) {
    console.error('Groq Error:', error);
    res.status(500).json({ error: 'Failed to process question' });
  }
});

const router = express.Router();

router.post('/askSuggestion', async (req, res) => {
  try {
    const { question } = req.body;
    const response = await chain.call({ question });
    
    res.json({
      answer: response.text.trim().replace(/<\/?s>/g, ''), // Clean up response
    });
    
  } catch (error) {
    console.error('Groq Error:', error);
    res.status(500).json({ error: 'Failed to process question' });
  }
});

export default router;