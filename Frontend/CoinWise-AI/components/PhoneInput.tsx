import { View, TextInput, StyleSheet, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';

interface PhoneInputProps {
  value: string;
  onChangeText: (text: string, isValid: boolean) => void;
}

export default function PhoneInput({ value, onChangeText }: PhoneInputProps) {
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const valid = value.replace(/\D/g, '').length >= 10;
    setIsValid(valid);
    onChangeText(value, valid);
  }, [value]);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.countryCode}>+91</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          value={value}
          onChangeText={(text) => onChangeText(text, isValid)}
          maxLength={10}
        />
        {isValid && (
          <MaterialIcons name="check-circle" size={24} color="green" />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  countryCode: {
    marginRight: 8,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
});