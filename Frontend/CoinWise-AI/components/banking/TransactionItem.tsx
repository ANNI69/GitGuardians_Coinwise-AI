import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Transaction } from '../../types/banking';

interface TransactionItemProps {
  transaction: Transaction;
}

export default function TransactionItem({ transaction }: TransactionItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialIcons 
          name={transaction.type === 'credit' ? 'call-received' : 'call-made'} 
          size={20} 
          color={transaction.type === 'credit' ? '#4CAF50' : '#F44336'} 
        />
      </View>
      
      <View style={styles.details}>
        <Text style={styles.description}>{transaction.description}</Text>
        <Text style={styles.date}>{transaction.date}</Text>
      </View>
      
      <Text 
        style={[
          styles.amount,
          { color: transaction.type === 'credit' ? '#4CAF50' : '#F44336' }
        ]}
      >
        {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    elevation: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#757575',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
});