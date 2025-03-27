import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import NotificationService from '../services/notificationService';

interface Transaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  date: string;
  bankName: string;
}

const TransactionScreen = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [hasPermission, setHasPermission] = useState(false);
  const notificationService = NotificationService.getInstance();

  useEffect(() => {
    setupNotificationListener();
    return () => {
      notificationService.stopListening();
    };
  }, []);

  const setupNotificationListener = async () => {
    const permission = await notificationService.requestPermission();
    setHasPermission(permission);

    if (permission) {
      notificationService.startListening((transaction) => {
        setTransactions(prev => [transaction, ...prev]);
      });
    }
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={[
      styles.transactionCard,
      { borderLeftColor: item.type === 'credit' ? '#4CAF50' : '#F44336' }
    ]}>
      <View style={styles.transactionHeader}>
        <Text style={styles.bankName}>{item.bankName}</Text>
        <Text style={[
          styles.amount,
          { color: item.type === 'credit' ? '#4CAF50' : '#F44336' }
        ]}>
          {item.type === 'credit' ? '+' : '-'}₹{item.amount.toFixed(2)}
        </Text>
      </View>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.date}>
        {new Date(item.date).toLocaleString()}
      </Text>
    </View>
  );

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>
          Please grant notification permission to track transactions
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  transactionCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bankName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  permissionText: {
    textAlign: 'center',
    margin: 16,
    fontSize: 16,
    color: '#666',
  },
});

export default TransactionScreen; 