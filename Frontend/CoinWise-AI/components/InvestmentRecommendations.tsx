import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { useRouter } from 'expo-router';

interface Recommendation {
  scheme: string;
  match_score: string;
  reasons: string[];
  suggested_allocation: number;
}

export const InvestmentRecommendations = () => {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const getMatchScoreColor = (score: string) => {
    // Convert score to number (e.g., "8/10" -> 8)
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
    if (numericScore >= 6) return {
      background: '#fff3e0',
      border: '#f1c40f',
      text: '#e65100'
    };
    return {
      background: '#ffebee',
      border: '#e74c3c',
      text: '#b71c1c'
    };
  };

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      const API_URL ='http://192.168.1.87:5000/api/investment/get-recommendations';
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          age: 50,
          income: 1000000,
          risk_tolerance: "Moderate",
          goals: ["Retirement", "Buy House"]
        }),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch recommendations: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Received data:', data);
      
      if (data && Array.isArray(data.recommendations)) {
        setRecommendations(data.recommendations);
      } else {
        console.error('Invalid data format:', data);
        throw new Error('Invalid response format from server');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      if (err instanceof Error) {
        if (err.message.includes('Network request failed')) {
          setError('Unable to connect to the server. Please check if the server is running and accessible.');
          console.log('Network request failed:', err.message);
        } else {
          setError(err.message);
        }
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchRecommendations();
  }, []);

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <ThemedText style={styles.loadingText}>Loading recommendations...</ThemedText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
        <TouchableOpacity style={styles.retryButton} onPress={fetchRecommendations}>
          <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>Investment Recommendations</ThemedText>
        <ThemedText style={styles.subtitle}>Based on your risk profile and goals</ThemedText>
      </ThemedView>

      {recommendations.length === 0 ? (
        <ThemedView style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>No recommendations available</ThemedText>
        </ThemedView>
      ) : (
        recommendations.map((rec, index) => {
          const colors = getMatchScoreColor(rec.match_score);
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
                <ThemedText style={[styles.cardTitle, { color: colors.text }]}>{rec.scheme}</ThemedText>
                <ThemedText style={[styles.matchScore, { color: colors.text }]}>{rec.match_score}</ThemedText>
              </View>
              <ThemedText style={[styles.cardDescription, { color: colors.text }]}>
                {rec.reasons.join(', ')}
              </ThemedText>
              <View style={styles.metricsContainer}>
                <View style={styles.metric}>
                  <ThemedText style={[styles.metricLabel, { color: colors.text }]}>Suggested Allocation</ThemedText>
                  <ThemedText style={[styles.metricValue, { color: colors.text }]}>{rec.suggested_allocation}%</ThemedText>
                </View>
              </View>
            </ThemedView>
          );
        })
      )}
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
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  matchScore: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  cardDescription: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 16,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingTop: 12,
  },
  metric: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
});
