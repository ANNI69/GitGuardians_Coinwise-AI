import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import TransactionItem from '../../components/banking/TransactionItem';
import { transactions } from '../../constants/mockData';
import { MaterialIcons } from '@expo/vector-icons';

export default function TransactionsScreen() {
  const { bankId } = useLocalSearchParams();
  
  // Filter transactions for the selected bank
  const bankTransactions = transactions.filter(
    (t) => t.bankId === bankId
  );

  // Calculate total balance (for demo purposes)
  const balance = bankTransactions.reduce((total, t) => {
    return t.type === 'credit' ? total + t.amount : total - t.amount;
  }, 0);

  return (
    <View style={styles.container}>
      {/* Header with Bank Info and Balance */}
      <View style={styles.header}>
        <View style={styles.bankInfo}>
          <MaterialIcons name="account-balance" size={24} color="#4A6FA5" />
          <Text style={styles.bankName}>
            {bankId?.toString().toUpperCase()} Bank
          </Text>
        </View>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balanceAmount}>₹{balance.toLocaleString()}</Text>
        </View>
      </View>

      {/* Transaction List */}
      <FlatList
        data={bankTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionItem transaction={item} />}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <Text style={styles.sectionTitle}>Transaction History</Text>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  bankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bankName: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: '#1A1A1A',
  },
  balanceContainer: {
    marginTop: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666666',
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 4,
  },
  listContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  separator: {
    height: 12,
  },
});