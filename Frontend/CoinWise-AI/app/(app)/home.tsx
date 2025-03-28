import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useLocalSearchParams, Stack, Link, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { PieChart, LineChart } from 'react-native-chart-kit';
import { useAuth } from '@clerk/clerk-expo';
import AccountSummary from '@/components/AccountSummary';
import TransactionList from '@/components/TransactionList';
import { banks } from '../../constants/bank';

export default function HomeScreen() {
  const { bankId } = useLocalSearchParams();
  const selectedBank = banks.find(bank => bank.id === bankId);
  const router = useRouter();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/sign-in');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Generate random transaction data for the last 7 days
  const generateRandomData = () => {
    const data = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        amount: Math.floor(Math.random() * 1000) + 100
      });
    }
    return data;
  };

  const transactionData = generateRandomData();

  return (
    <View style={styles.container}>
      {/* Title Bar */}
      <View style={styles.titleBar}>
        <Text style={styles.titleText}>CoinWise AI</Text>
        <View style={styles.titleBarButtons}>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="notifications" size={24} color="#1a237e" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleSignOut}>
            <MaterialIcons name="logout" size={24} color="#1a237e" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Bank Header */}
          {/* <View 
            style={[styles.bankHeader, { backgroundColor: selectedBank?.primaryColor }]}
          >
            <Text style={styles.bankName}>{selectedBank?.name}</Text>
            <Text style={styles.accountText}>Account Balance</Text>
          </View> */}

          {/* Account Summary */}
          <AccountSummary bankId={bankId as string} />

          {/* Quick Actions */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.quickActionsContainer}
          >
            <View style={styles.quickActions}>
              <ActionButton
                icon="receipt-long"
                label="Tax Estimation"
                onPress={() => router.push('/taxestimation')}
              />
              <ActionButton
                icon="trending-up"
                label="Investment Sugesstions"
                onPress={() => router.push('/(app)/investments')}
              />
              <ActionButton
                icon="savings"
                label="Savings Plans"
                onPress={() => router.push('/(app)/savings')}
              />
              <ActionButton
                icon="swap-horiz"
                label="Transfer"
                onPress={() => router.push('/transfer')}
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
          </ScrollView>

          {/* Recent Transactions */}
          <View style={styles.transactionsContainer}>
            <View style={styles.transactionsHeader}>
              <Text style={styles.transactionsTitle}>Spending Breakdown</Text>
            </View>

            <View style={styles.chartContainer}>
              <PieChart
                data={[
                  {
                    name: 'Food',
                    amount: 450,
                    color: '#FF6B6B'
                  },
                  {
                    // name: 'Transportation', 
                    amount: 200,
                    color: '#4ECDC4'
                  },
                  {
                    name: 'Subscription',
                    amount: 300,
                    color: '#45B7D1'
                  },
                  {
                    name: 'Investment',
                    amount: 800,
                    color: '#96CEB4'
                  },
                  {
                    name: 'Other',
                    amount: 150,
                    color: '#FFEEAD'
                  }
                ]}
                width={300}
                height={220}
                chartConfig={{
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="amount"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </View>

            {/* Weekly Transactions Graph */}
            <View style={styles.weeklyTransactionsContainer}>
              <Text style={styles.weeklyTransactionsTitle}>Weekly Transactions</Text>
              <LineChart
                data={{
                  labels: transactionData.map(item => item.date),
                  datasets: [{
                    data: transactionData.map(item => item.amount)
                  }]
                }}
                width={Dimensions.get('window').width - 60}
                height={220}
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
                  style: {
                    borderRadius: 16
                  }
                }}
                bezier
                style={styles.lineChart}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      
      {/* Floating Bottom Button */}
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={() => router.push('/(app)/chat')}
        activeOpacity={0.7}
      >
        <Text style={styles.robotEmoji}>🤖</Text>
      </TouchableOpacity>
    </View>
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
    flex: 1,
    backgroundColor: '#F9FAFB'
  },
  titleBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  titleText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a237e',
  },
  titleBarButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  iconButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
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
  quickActionsContainer: {
    marginVertical: 32,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 16,
  },
  actionButton: {
    alignItems: 'center',
    width: 80,
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
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  robotEmoji: {
    fontSize: 32,
  },
  weeklyTransactionsContainer: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  weeklyTransactionsTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#111827',
    marginBottom: 20,
  },
  lineChart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});