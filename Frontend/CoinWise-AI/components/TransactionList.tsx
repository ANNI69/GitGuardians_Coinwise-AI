import { FlatList, View, Text, StyleSheet } from 'react-native';
import TransactionItem from './banking/TransactionItem';
import { transactions } from '../constants/mockData';

export default function TransactionList({ bankId, limit }: { bankId: string, limit?: number }) {
  // First filter by bankId
  const filteredTransactions = transactions.filter(t => t.bankId === bankId);

  // Group transactions by category
  const groupedTransactions = filteredTransactions.reduce<Record<string, typeof transactions>>((groups, transaction) => {
    const category = transaction.category || 'uncategorized';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(transaction);
    return groups;
  }, {});

  // Convert to array format needed for FlatList
  const sections = Object.entries(groupedTransactions).map(([category, transactions]) => ({
    category,
    data: limit ? transactions.slice(0, limit) : transactions
  }));

  return (
    <FlatList
      data={sections}
      keyExtractor={(item) => item.category}
      renderItem={({ item }) => (
        <View style={styles.categorySection}>
          <Text style={styles.categoryTitle}>
            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
          </Text>
          {item.data.map((transaction) => (
            <View key={transaction.id}>
              <TransactionItem transaction={transaction} />
              <View style={styles.separator} />
            </View>
          ))}
        </View>
      )}
      ItemSeparatorComponent={() => <View style={styles.sectionSeparator} />}
      scrollEnabled={false}
    />
  );
}

const styles = StyleSheet.create({
  categorySection: {
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    textTransform: 'capitalize'
  },
  separator: {
    height: 12
  },
  sectionSeparator: {
    height: 24
  }
});