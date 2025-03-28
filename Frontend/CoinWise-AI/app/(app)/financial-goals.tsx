import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const goals = [
  {
    id: 'car',
    title: 'Car',
    icon: 'directions-car',
    description: 'Save for a new car or car upgrade',
    color: '#2196F3'
  },
  {
    id: 'home',
    title: 'Home',
    icon: 'home',
    description: 'Save for a house or apartment',
    color: '#4CAF50'
  },
  {
    id: 'gold',
    title: 'Gold',
    icon: 'monetization-on',
    description: 'Invest in gold or precious metals',
    color: '#FFD700'
  },
  {
    id: 'education',
    title: 'Education',
    icon: 'school',
    description: 'Save for education or skill development',
    color: '#9C27B0'
  }
];

export default function FinancialGoalsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [error, setError] = useState('');

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleContinue = async () => {
    if (selectedGoals.length === 0) {
      setError('Please select at least one financial goal');
      return;
    }

    setLoading(true);
    try {
      await AsyncStorage.setItem('userGoals', JSON.stringify(selectedGoals));
      router.push('/(app)/home');
    } catch (error) {
      setError('Failed to save your goals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="flag" size={48} color="#1a237e" />
        <Text style={styles.title}>Set Your Financial Goals</Text>
        <Text style={styles.subtitle}>Select one or more goals to focus on</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.goalsContainer}>
          {goals.map((goal) => (
            <TouchableOpacity
              key={goal.id}
              style={[
                styles.goalCard,
                selectedGoals.includes(goal.id) && styles.selectedGoalCard,
                { borderColor: goal.color }
              ]}
              onPress={() => toggleGoal(goal.id)}
            >
              <View style={[styles.iconContainer, { backgroundColor: goal.color }]}>
                <MaterialIcons name={goal.icon as any} size={24} color="#ffffff" />
              </View>
              <View style={styles.goalContent}>
                <Text style={styles.goalTitle}>{goal.title}</Text>
                <Text style={styles.goalDescription}>{goal.description}</Text>
              </View>
              <MaterialIcons
                name={selectedGoals.includes(goal.id) ? 'check-circle' : 'radio-button-unchecked'}
                size={24}
                color={selectedGoals.includes(goal.id) ? goal.color : '#e9ecef'}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Continue</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a237e',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  scrollView: {
    flex: 1,
  },
  goalsContainer: {
    padding: 20,
    gap: 16,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedGoalCard: {
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  goalContent: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a237e',
    marginBottom: 4,
  },
  goalDescription: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  button: {
    backgroundColor: '#1a237e',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
}); 