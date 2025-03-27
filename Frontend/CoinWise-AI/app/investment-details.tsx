import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function InvestmentDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>Investment Details</ThemedText>
        <ThemedText style={styles.subtitle}>Detailed analysis and insights</ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Market Analysis</ThemedText>
        <View style={styles.metricsGrid}>
          <View style={styles.metricItem}>
            <ThemedText style={styles.metricLabel}>Current Price</ThemedText>
            <ThemedText style={styles.metricValue}>$45,000</ThemedText>
          </View>
          <View style={styles.metricItem}>
            <ThemedText style={styles.metricLabel}>24h Change</ThemedText>
            <ThemedText style={styles.metricValue}>+2.5%</ThemedText>
          </View>
          <View style={styles.metricItem}>
            <ThemedText style={styles.metricLabel}>Market Cap</ThemedText>
            <ThemedText style={styles.metricValue}>$850B</ThemedText>
          </View>
        </View>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Investment Strategy</ThemedText>
        <ThemedText style={styles.description}>
          Based on current market conditions and your risk profile, we recommend a gradual investment approach:
        </ThemedText>
        <View style={styles.strategyList}>
          <ThemedText style={styles.strategyItem}>• Start with 30% of intended investment</ThemedText>
          <ThemedText style={styles.strategyItem}>• Monitor market conditions for 2 weeks</ThemedText>
          <ThemedText style={styles.strategyItem}>• Invest remaining 70% based on performance</ThemedText>
        </View>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Risk Assessment</ThemedText>
        <View style={styles.riskMetrics}>
          <View style={styles.riskMetric}>
            <ThemedText style={styles.riskLabel}>Volatility</ThemedText>
            <ThemedText style={styles.riskValue}>High</ThemedText>
          </View>
          <View style={styles.riskMetric}>
            <ThemedText style={styles.riskLabel}>Market Sentiment</ThemedText>
            <ThemedText style={styles.riskValue}>Positive</ThemedText>
          </View>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
  section: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  metricItem: {
    width: '30%',
    marginBottom: 16,
  },
  metricLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  strategyList: {
    marginLeft: 16,
  },
  strategyItem: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  riskMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  riskMetric: {
    flex: 1,
  },
  riskLabel: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 4,
  },
  riskValue: {
    fontSize: 16,
    fontWeight: '500',
  },
}); 