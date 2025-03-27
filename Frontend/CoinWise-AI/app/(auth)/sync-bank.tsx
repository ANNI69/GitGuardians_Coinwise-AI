import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';

export default function SyncBankScreen() {
  const { phone } = useLocalSearchParams();

  const handleBankSync = () => {
    console.log('Syncing bank for:', phone);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sync Your Bank Account</Text>
        <Text style={styles.subtitle}>
          We'll securely connect to your bank to fetch transactions
        </Text>
      </View>

      <View style={styles.bankList}>
        {['HDFC', 'ICICI', 'SBI', 'Axis', 'Kotak'].map((bank) => (
          <TouchableOpacity
            key={bank}
            style={styles.bankItem}
            onPress={handleBankSync}
          >
            <View style={styles.bankIcon}>
              <MaterialIcons name="account-balance" size={24} color="#0066CC" />
            </View>
            <Text style={styles.bankName}>{bank} Bank</Text>
            <MaterialIcons name="chevron-right" size={24} color="#666" />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.manualButton}>
        <Text style={styles.manualButtonText}>Or connect manually</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  bankList: {
    marginBottom: 20,
  },
  bankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  bankIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EBF5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  bankName: {
    flex: 1,
    fontSize: 16,
  },
  manualButton: {
    alignSelf: 'center',
    padding: 10,
  },
  manualButtonText: {
    color: '#0066CC',
    fontWeight: 'bold',
  },
});