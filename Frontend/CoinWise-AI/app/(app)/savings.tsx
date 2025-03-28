import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SavingsPlans } from '@/components/SavingsPlans';

export default function SavingsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Savings Plans',
          headerStyle: {
            backgroundColor: '#ffffff',
          },
          headerTintColor: '#1a237e',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
      />
      <SavingsPlans />
      
      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={() => router.push('/(app)/chat')}
        activeOpacity={0.8}
      >
        <Text style={styles.robotEmoji}>🤖</Text>
        <Text style={styles.buttonText}>Ask AI</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#1a237e',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  robotEmoji: {
    fontSize: 24,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 