export interface Transaction {
  id: string;
  bankId: string;
  description: string;
  amount: number;
  date: string;
  type: 'credit' | 'debit';
  category?: string;
}