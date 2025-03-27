import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import BankCard from '@/components/banking/BankCard';
import { banks } from '@/constants/bank';


export default function SyncBankScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Select Your Bank
      </Text>
      <Text style={styles.subtitle}>
        We'll securely connect to your bank account
      </Text>

      <FlatList
        data={banks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link href={`/(app)/home?bankId=${item.id}`} asChild>
            <TouchableOpacity>
              <BankCard bank={item} />
            </TouchableOpacity>
          </Link>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'white',
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#111827'
  },
  subtitle: {
    color: '#6B7280',
    marginBottom: 32
  },
  separator: {
    height: 16
  }
});