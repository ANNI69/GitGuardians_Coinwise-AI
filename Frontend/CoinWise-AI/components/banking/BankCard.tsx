import { View, Text, StyleSheet, Image } from 'react-native';
import { Bank } from '@/constants/bank';
// import { Bank } from '../../../constants/banks';

interface BankCardProps {
  bank: Bank;
}

export default function BankCard({ bank }: BankCardProps) {
  return (
    <View style={[styles.container, { backgroundColor: bank.primaryColor }]}>
      <View style={styles.content}>
        <Image 
          source={bank.logo} 
          style={styles.logo} 
          resizeMode="contain"
        />
        <Text style={styles.bankName}>{bank.name}</Text>
      </View>
      <View style={styles.connectionBadge}>
        <Text style={styles.connectionText}>Connect</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 16,
  },
  bankName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  connectionBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  connectionText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
  },
});