import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import transactionsData from '@/constants/transactions.json';

// Mock data for transactions
interface Transaction {
  id: string;
  type: 'transfer' | 'payment' | 'deposit';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending';
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'transfer',
    amount: -50,
    description: 'Transfer to Sahil',
    date: '2024-03-20',
    status: 'completed'
  },
  {
    id: '2',
    type: 'payment',
    amount: -25,
    description: 'Grocery Shopping',
    date: '2024-03-19',
    status: 'completed'
  }
];

export default function TransactionsScreen() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        // First try to load from AsyncStorage
        const savedTransactionsJson = await AsyncStorage.getItem('transactions');
        if (savedTransactionsJson) {
          const savedTransactions = JSON.parse(savedTransactionsJson) as Transaction[];
          setTransactions(savedTransactions);
        } else {
          // If no saved transactions, use the JSON file data
          setTransactions(transactionsData.transactions as Transaction[]);
        }
      } catch (error) {
        console.error('Error loading transactions:', error);
        // Fallback to JSON file data if there's an error
        setTransactions(transactionsData.transactions as Transaction[]);
      }
    };
    loadTransactions();
  }, []);

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionIcon}>
        <MaterialIcons 
          name={item.type === 'transfer' ? 'swap-horiz' : 
                item.type === 'payment' ? 'shopping-cart' : 'account-balance'} 
          size={24} 
          color="#2563EB" 
        />
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionDescription}>{item.description}</Text>
        <Text style={styles.transactionDate}>{item.date}</Text>
      </View>
      <Text style={[
        styles.transactionAmount,
        { color: item.amount >= 0 ? '#10B981' : '#EF4444' }
      ]}>
        {item.amount >= 0 ? '+' : ''}{item.amount.toFixed(2)}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#1a237e" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recent Transactions</Text>
      </View>

      {/* Transfer Button */}
      <TouchableOpacity 
        style={styles.transferButton}
        onPress={() => router.push('/transfer')}
      >
        <MaterialIcons name="swap-horiz" size={24} color="white" />
        <Text style={styles.transferButtonText}>New Transfer</Text>
      </TouchableOpacity>

      {/* Transactions List */}
      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.transactionsList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a237e',
  },
  transferButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transferButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  transactionsList: {
    padding: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionIcon: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 10,
    marginRight: 16,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  transactionDate: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  transactionsContainer: {
    padding: 20,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
});