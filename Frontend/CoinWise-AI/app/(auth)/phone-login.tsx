import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { useState } from 'react';
import PhoneInput from '../../components/PhoneInput';

export default function PhoneLoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValid, setIsValid] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Connect Your Bank Account</Text>
        <Text style={styles.subtitle}>Enter your phone number to get started</Text>
        
        <PhoneInput 
          value={phoneNumber}
          onChangeText={(text, valid) => {
            setPhoneNumber(text);
            setIsValid(valid);
          }}
        />
      </View>
      
      <Link 
        href={{
          pathname: "/verity-otp",
          params: { phone: phoneNumber }
        }} 
        asChild
      >
        <TouchableOpacity
          style={[
            styles.button,
            !isValid && styles.disabledButton
          ]}
          disabled={!isValid}
        >
          <Text style={styles.button}>Get Started</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#0066CC',
    padding: 18,
    borderRadius: 12,
    textAlign: 'center',
    width: '100%',
    marginBottom: 20, // Add some bottom margin
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
    opacity: 0.8, // Add opacity to make it look more disabled
  },
});