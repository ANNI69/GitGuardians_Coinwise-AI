import { Transaction } from '../types/banking';

export const transactions: Transaction[] = [
  {
    id: '1',
    bankId: 'hdfc',
    description: 'Salary Deposit',
    amount: 50000,
    date: '15 May 2023',
    type: 'credit',
    category: 'income'
  },
  {
    id: '2',
    bankId: 'hdfc',
    description: 'Amazon Purchase',
    amount: 2499,
    date: '14 May 2023',
    type: 'debit',
    category: 'shopping'
  },
  {
    id: '3',
    bankId: 'icici',
    description: 'Postpaid Recharge',
    amount: 866,
    date: '20 April 2025',
    type: 'debit',
    category: 'utilities'
  },
  {
    id: '4',
    bankId: 'hdfc',
    description: 'Swiggy Food Order',
    amount: 750,
    date: '13 May 2023',
    type: 'debit', 
    category: 'food'
  },
  {
    id: '5',
    bankId: 'icici',
    description: 'Electricity Bill',
    amount: 3200,
    date: '12 May 2023',
    type: 'debit',
    category: 'utilities'
  },
  {
    id: '6', 
    bankId: 'hdfc',
    description: 'Movie Tickets',
    amount: 600,
    date: '10 May 2023',
    type: 'debit',
    category: 'entertainment'
  },
  {
    id: '7',
    bankId: 'icici', 
    description: 'Freelance Payment',
    amount: 25000,
    date: '8 May 2023',
    type: 'credit',
    category: 'income'
  },
  {
    id: '8',
    bankId: 'hdfc',
    description: 'Flipkart Electronics',
    amount: 2999,
    date: '5 May 2023', 
    type: 'debit',
    category: 'shopping'
  },
  {
    id: '9',
    bankId: 'icici',
    description: 'Water Bill',
    amount: 1500,
    date: '3 May 2023',
    type: 'debit',
    category: 'utilities'
  },
  {
    id: '10',
    bankId: 'hdfc',
    description: 'Zomato Order',
    amount: 850,
    date: '1 May 2023',
    type: 'debit',
    category: 'food'
  }
];