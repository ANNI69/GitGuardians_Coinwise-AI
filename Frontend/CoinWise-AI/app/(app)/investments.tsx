import React from 'react';
import { View, StyleSheet } from 'react-native';
import { InvestmentRecommendations } from '@/components/InvestmentRecommendations';

export default function InvestmentsScreen() {
  return (
    <View style={styles.container}>
      <InvestmentRecommendations />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
}); 