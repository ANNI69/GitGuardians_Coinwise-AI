import { View, Text, StyleSheet } from 'react-native';

export default function AccountSummary({ bankId }: { bankId: string }) {
  // In a real app, fetch this data from your backend/API
  const accountData = {
    balance: '₹85,432.00',
    accountNumber: 'XXXX XXXX 7890',
    ifsc: 'HDFC0000123',
  };

  return (
    <View style={styles.container}>
      <Text style={styles.balanceLabel}>Current Balance</Text>
      <Text style={styles.balanceAmount}>{accountData.balance}</Text>
      
      <View style={styles.detailsContainer}>
        <View>
          <Text style={styles.label}>Account Number</Text>
          <Text style={styles.value}>{accountData.accountNumber}</Text>
        </View>
        <View>
          <Text style={styles.label}>IFSC Code</Text>
          <Text style={styles.value}>{accountData.ifsc}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  balanceLabel: {
    color: '#6B7280',
    marginBottom: 4
  },
  balanceAmount: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 24
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  label: {
    color: '#6B7280',
    fontSize: 12
  },
  value: {
    fontWeight: '500'
  }
});