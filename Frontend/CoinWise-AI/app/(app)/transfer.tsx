import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import TransactionList from '@/components/TransactionList';

export default function TransferScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [description, setDescription] = useState('');

  const handleTransfer = () => {
    // Here you would typically make an API call to process the transfer
    console.log('Transfer initiated:', { amount, recipient, description });
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#1a237e" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Transfer</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Transfer Form */}
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Recipient</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter recipient name or account number"
              value={recipient}
              onChangeText={setRecipient}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter transfer description"
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <TouchableOpacity 
            style={styles.transferButton}
            onPress={handleTransfer}
          >
            <Text style={styles.transferButtonText}>Confirm Transfer</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Recipients */}
        <View style={styles.recentRecipients}>
          <Text style={styles.sectionTitle}>Recent Recipients</Text>
          <View style={styles.recipientList}>
            <TouchableOpacity style={styles.recipientItem}>
              <MaterialIcons name="rice-bowl" size={24} color="#2563EB" />
              <Text style={styles.recipientName}>Zomato</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.recipientItem}>
              <MaterialIcons name="rice-bowl" size={24} color="#2563EB" />
              <Text style={styles.recipientName}>Dominos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.recipientItem}>
              <MaterialIcons name="directions-railway-filled" size={24} color="#2563EB" />
              <Text style={styles.recipientName}>Transport</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.recipientItem}>
              <MaterialIcons name="family-restroom" size={24} color="#2563EB" />
              <Text style={styles.recipientName}>Family</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a237e',
  },
  content: {
    flex: 1,
  },
  formContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    margin: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  transferButton: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  transferButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  recentRecipients: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  recipientList: {
    gap: 12,
  },
  recipientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  recipientName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginLeft: 12,
  },
}); 