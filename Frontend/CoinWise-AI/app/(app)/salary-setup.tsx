import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const currencies = ['USD', 'EUR', 'GBP', 'INR'];

export default function SalarySetupScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [salary, setSalary] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [error, setError] = useState('');

  const handleContinue = async () => {
    if (!salary.trim()) {
      setError('Please enter your monthly income');
      return;
    }

    const salaryAmount = parseFloat(salary);
    if (isNaN(salaryAmount) || salaryAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      await AsyncStorage.setItem('userSalary', JSON.stringify({
        amount: salaryAmount,
        currency: selectedCurrency
      }));
      router.push('/(app)/financial-goals');
    } catch (error) {
      setError('Failed to save your information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="account-balance" size={48} color="#1a237e" />
        <Text style={styles.title}>Set Your Monthly Income</Text>
        <Text style={styles.subtitle}>This helps us provide personalized financial advice</Text>
      </View>

      <View style={styles.form}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={salary}
            placeholder="Enter monthly income"
            onChangeText={(text) => {
              setSalary(text);
              setError('');
            }}
            keyboardType="numeric"
            maxLength={10}
          />
          <View style={styles.currencySelector}>
            {currencies.map((currency) => (
              <TouchableOpacity
                key={currency}
                style={[
                  styles.currencyButton,
                  selectedCurrency === currency && styles.selectedCurrency
                ]}
                onPress={() => setSelectedCurrency(currency)}
              >
                <Text style={[
                  styles.currencyText,
                  selectedCurrency === currency && styles.selectedCurrencyText
                ]}>
                  {currency}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

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
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
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
  form: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginBottom: 16,
  },
  currencySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  currencyButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    alignItems: 'center',
  },
  selectedCurrency: {
    backgroundColor: '#1a237e',
    borderColor: '#1a237e',
  },
  currencyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a237e',
  },
  selectedCurrencyText: {
    color: '#ffffff',
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