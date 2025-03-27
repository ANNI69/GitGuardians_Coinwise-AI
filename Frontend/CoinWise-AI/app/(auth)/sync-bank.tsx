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
              <MaterialIcons name="account-balance" size={28} color="#0066CC" />
            </View>
            <Text style={styles.bankName}>{bank} Bank</Text>
            <MaterialIcons name="chevron-right" size={20} color="#999" />
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
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginTop: 40,
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 22,
  },
  bankList: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  bankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  bankIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EBF5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  bankName: {
    flex: 1,
    fontSize: 17,
    fontWeight: '500',
    color: '#333333',
  },
  manualButton: {
    alignSelf: 'center',
    padding: 16,
    marginTop: 8,
  },
  manualButtonText: {
    color: '#0066CC',
    fontWeight: '600',
    fontSize: 16,
  },
});