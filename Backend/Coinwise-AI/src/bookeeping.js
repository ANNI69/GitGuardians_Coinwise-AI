import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";

// Configure Groq Cloud
const llm = new ChatOpenAI({
  apiKey: process.env.GROQ_API_KEY,
  modelName: "mixtral-8x7b-32768", // Groq model name
  temperature: 0.3,
  configuration: {
    baseURL: "https://api.groq.com/openai/v1" // Groq API endpoint
  }
});

// Transaction Extraction Chain
const extractionTemplate = `
Analyze the bank statement text below and extract financial transactions.
Follow these rules:
1. Convert dates to YYYY-MM-DD format
2. Convert amounts to numbers (no currency symbols)
3. Determine transaction type (income/expense)
4. Keep original description

{text}

Return JSON array only:
[{date, description, amount, type}]`;

const extractionPrompt = new PromptTemplate({
  template: extractionTemplate,
  inputVariables: ["text"]
});

const extractionChain = extractionPrompt.pipe(llm).pipe(new JsonOutputParser());

// Categorization Chain
const categoryOptions = [
  'Food', 'Transport', 'Salary', 'Rent', 
  'Utilities', 'Entertainment', 'Healthcare', 'Other'
];

const categorizationTemplate = `
Categorize this transaction into one of: ${categoryOptions.join(', ')}
Description: {description}
Amount: {amount}
Type: {type}

Respond only with the category name. Example: "Food"`;

const categorizationPrompt = new PromptTemplate({
  template: categorizationTemplate,
  inputVariables: ["description", "amount", "type"]
});

const categorizationChain = categorizationPrompt.pipe(llm);

async function processTransactionData(transactionData, salary = null) {
  try {
    if (!transactionData || typeof transactionData !== "string" || transactionData.trim() === "") {
      throw new Error("Invalid transaction data provided.");
    }

    // Extract transactions
    const transactions = await extractionChain.invoke({ text: transactionData });

    // Process categorization in parallel with error handling
    const categorized = await Promise.all(
      transactions.map(async txn => {
        try {
          const category = await categorizationChain.invoke({
            description: txn.description || "Unknown",
            amount: txn.amount || 0,
            type: txn.type || "expense"
          });
          return { ...txn, category: category.content || "Other" };
        } catch (err) {
          console.error(`Categorization failed for transaction: ${txn.description}`, err);
          return { ...txn, category: "Other" };
        }
      })
    );

    // Filter valid transactions
    const validTransactions = categorized.filter(t => 
      t.date && t.description && !isNaN(t.amount)
    );

    // Calculate spending analysis if salary is valid
    let spendingAnalysis = null;
    if (salary && !isNaN(salary) && salary > 0) {
      spendingAnalysis = calculateSpendingAnalysis(validTransactions, salary);
    }

    return {
      transactions: validTransactions,
      spendingAnalysis
    };

  } catch (error) {
    throw new Error(`Processing failed: ${error.message}`);
  }
}

/**
 * Calculate spending analysis by category relative to salary
 * @param {Array} transactions - List of categorized transactions
 * @param {Number} salary - User's salary amount
 * @returns {Object} Analysis of spending by category
 */
function calculateSpendingAnalysis(transactions, salary) {
  // Group expenses by category
  const expensesByCategory = {};
  
  // Calculate total expenses
  let totalExpenses = 0;
  
  transactions.forEach(transaction => {
    if (transaction.type === 'expense' && transaction.amount > 0) {
      const category = transaction.category;
      const amount = transaction.amount;
      
      if (!expensesByCategory[category]) {
        expensesByCategory[category] = 0;
      }
      expensesByCategory[category] += amount;
      totalExpenses += amount;
    }
  });

  // Prevent division by zero
  if (totalExpenses === 0) {
    return { totalExpenses: 0, percentOfSalary: "0%", categories: {} };
  }

  const analysis = {
    totalExpenses,
    percentOfSalary: ((totalExpenses / salary) * 100).toFixed(2),
    categories: {}
  };

  Object.keys(expensesByCategory).forEach(category => {
    const amount = expensesByCategory[category];
    analysis.categories[category] = {
      amount: amount.toFixed(2),
      percentOfSalary: ((amount / salary) * 100).toFixed(2),
      percentOfTotalExpenses: ((amount / totalExpenses) * 100).toFixed(2)
    };
  });

  return analysis;
}

export { processTransactionData };
