import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack, Link, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import AccountSummary from '@/components/AccountSummary';
import TransactionList from '@/components/TransactionList';
import { banks } from '../../constants/bank';

export default function HomeScreen() {
  const { bankId } = useLocalSearchParams();
  const selectedBank = banks.find(bank => bank.id === bankId);
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Bank Header */}
        <View 
          style={[styles.bankHeader, { backgroundColor: selectedBank?.primaryColor }]}
        >
          <Text style={styles.bankName}>{selectedBank?.name}</Text>
          <Text style={styles.accountText}>Account Balance</Text>
        </View>

        {/* Account Summary */}
        <AccountSummary bankId={bankId as string} />

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <ActionButton 
            icon="swap-horiz" 
            label="Transfer"
            onPress={() => {}} 
          />
          <ActionButton 
            icon="picture-as-pdf" 
            label="PDF"
            onPress={() => router.push('/pdfPage')} 
          />
          <ActionButton 
            icon="receipt-long" 
            label="Transactions"
            onPress={() => router.push('/transactions')} 
          />
          <ActionButton 
            icon="chat" 
            label="Chat"
            onPress={() => router.push('/(app)/chat')} 
          />
        </View>

        {/* Recent Transactions */}
        <View style={styles.transactionsContainer}>
          <View style={styles.transactionsHeader}>
            <Text style={styles.transactionsTitle}>Recent Transactions</Text>
            <Link href={`/(app)/transactions?bankId=${bankId}`} asChild>
              <TouchableOpacity style={styles.seeAllButton}>
                <Text style={styles.seeAllText}>See All</Text>
                <MaterialIcons name="chevron-right" size={20} color="#2563EB" />
              </TouchableOpacity>
            </Link>
          </View>
          <TransactionList bankId={bankId as string} limit={5} />
        </View>
      </View>
    </ScrollView>
  );
}

function ActionButton({ 
  icon, 
  label,
  onPress 
}: { 
  icon: keyof typeof MaterialIcons.glyphMap, 
  label: string,
  onPress: () => void
}) {
  return (
    <TouchableOpacity 
      style={styles.actionButton}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <MaterialIcons name={icon} size={28} color="#2563EB" />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flex: 1,
    backgroundColor: '#F9FAFB'
  },
  content: {
    padding: 20
  },
  bankHeader: {
    padding: 24,
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5
  },
  bankName: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.5
  },
  accountText: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 12,
    letterSpacing: 0.5
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 32,
    paddingHorizontal: 10
  },
  actionButton: {
    alignItems: 'center',
    width: 80
  },
  iconContainer: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 3
  },
  actionLabel: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center'
  },
  transactionsContainer: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  transactionsTitle: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#111827',
    letterSpacing: 0.5
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  seeAllText: {
    color: '#2563EB',
    fontWeight: '600',
    fontSize: 16,
    marginRight: 4
  }
});