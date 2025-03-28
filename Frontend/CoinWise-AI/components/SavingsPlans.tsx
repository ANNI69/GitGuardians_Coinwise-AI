import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { MaterialIcons } from '@expo/vector-icons';

interface SavingsPlan {
  name: string;
  type: string;
  interest_rate: string;
  min_amount: number;
  lock_in: number;
  features: string[];
  match_score: string;
}

export const SavingsPlans = () => {
  const [plans, setPlans] = useState<SavingsPlan[]>([
    {
      name: "Fixed Deposit Plus",
      type: "Bank Deposit",
      interest_rate: "7.5%",
      min_amount: 10000,
      lock_in: 1,
      features: ["Guaranteed returns", "Quarterly interest payout", "Flexible tenure"],
      match_score: "9/10"
    },
    {
      name: "Recurring Deposit",
      type: "Bank Deposit",
      interest_rate: "6.8%",
      min_amount: 5000,
      lock_in: 1,
      features: ["Monthly savings", "Compound interest", "Auto-debit facility"],
      match_score: "8/10"
    },
    {
      name: "Savings Plus Account",
      type: "Bank Account",
      interest_rate: "4.5%",
      min_amount: 1000,
      lock_in: 0,
      features: ["Zero balance", "Debit card", "Online banking"],
      match_score: "7/10"
    },
    {
      name: "Tax Saver FD",
      type: "Bank Deposit",
      interest_rate: "6.5%",
      min_amount: 100000,
      lock_in: 5,
      features: ["Tax benefits", "High returns", "Quarterly payout"],
      match_score: "8/10"
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const getMatchScoreColor = (score: string) => {
    const numericScore = parseFloat(score.split('/')[0]);
    
    if (numericScore >= 8) return {
      background: '#e8f5e9',
      border: '#2ecc71',
      text: '#1b5e20'
    };
    if (numericScore >= 7) return {
      background: '#e3f2fd',
      border: '#3498db',
      text: '#1565c0'
    };
    return {
      background: '#fff3e0',
      border: '#f1c40f',
      text: '#e65100'
    };
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>Savings Plans</ThemedText>
        <ThemedText style={styles.subtitle}>Choose the best plan for your savings goals</ThemedText>
      </ThemedView>

      {plans.map((plan, index) => {
        const colors = getMatchScoreColor(plan.match_score);
        return (
          <ThemedView 
            key={index} 
            style={[
              styles.cardContent,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
                borderWidth: 2,
              }
            ]}
          >
            <View style={styles.cardHeader}>
              <View style={styles.titleContainer}>
                <ThemedText style={[styles.cardTitle, { color: colors.text }]}>{plan.name}</ThemedText>
                <ThemedText style={[styles.planType, { color: colors.text }]}>{plan.type}</ThemedText>
              </View>
              <View style={styles.matchScoreContainer}>
                <ThemedText style={[styles.matchScore, { color: colors.text }]}>{plan.match_score}</ThemedText>
                <MaterialIcons name="star" size={20} color={colors.text} />
              </View>
            </View>

            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <MaterialIcons name="percent" size={20} color={colors.text} />
                <ThemedText style={[styles.detailText, { color: colors.text }]}>
                  Interest Rate: {plan.interest_rate}
                </ThemedText>
              </View>
              <View style={styles.detailRow}>
                <MaterialIcons name="account-balance-wallet" size={20} color={colors.text} />
                <ThemedText style={[styles.detailText, { color: colors.text }]}>
                  Min Amount: ₹{plan.min_amount.toLocaleString()}
                </ThemedText>
              </View>
              <View style={styles.detailRow}>
                <MaterialIcons name="lock-clock" size={20} color={colors.text} />
                <ThemedText style={[styles.detailText, { color: colors.text }]}>
                  Lock-in: {plan.lock_in} year{plan.lock_in > 1 ? 's' : ''}
                </ThemedText>
              </View>
            </View>

            <View style={styles.featuresContainer}>
              <ThemedText style={[styles.featuresTitle, { color: colors.text }]}>Key Features:</ThemedText>
              {plan.features.map((feature, idx) => (
                <View key={idx} style={styles.featureRow}>
                  <MaterialIcons name="check-circle" size={16} color={colors.text} />
                  <ThemedText style={[styles.featureText, { color: colors.text }]}>{feature}</ThemedText>
                </View>
              ))}
            </View>

            <TouchableOpacity 
              style={[styles.applyButton, { backgroundColor: colors.border }]}
              onPress={() => {}}
            >
              <ThemedText style={styles.applyButtonText}>Apply Now</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  cardContent: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  planType: {
    fontSize: 14,
    opacity: 0.8,
  },
  matchScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  matchScore: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailsContainer: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  detailText: {
    fontSize: 14,
  },
  featuresContainer: {
    marginBottom: 16,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    flex: 1,
  },
  applyButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 