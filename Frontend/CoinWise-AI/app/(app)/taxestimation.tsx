import React from 'react';
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';

interface TaxBreakdownItem {
  range: string;
  rate: string;
  amount: string;
}

const IndiaTaxEstimationScreen = () => {
  const [income, setIncome] = useState('');
  const [ageGroup, setAgeGroup] = useState('below60');
  const [regime, setRegime] = useState('new');
  const [deductions, setDeductions] = useState({
    section80C: 0,
    section80D: 0,
    hra: 0,
    other: 0,
  });
  const [taxLiability, setTaxLiability] = useState(0);
  const [cess, setCess] = useState(0);
  const [totalTax, setTotalTax] = useState(0);
  const [breakdown, setBreakdown] = useState<TaxBreakdownItem[]>([]);

  const calculateTax = () => {
    const grossIncome = parseFloat(income) || 0;
    let totalDeductions = Object.values(deductions).reduce((sum, val) => sum + val, 0);
    
    // New Tax Regime (FY 2023-24)
    if (regime === 'new') {
      let taxableIncome = grossIncome;
      let calculatedTax = 0;
      
      const newRegimeSlabs = [
        { min: 0, max: 300000, rate: 0 },
        { min: 300001, max: 600000, rate: 0.05 },
        { min: 600001, max: 900000, rate: 0.10 },
        { min: 900001, max: 1200000, rate: 0.15 },
        { min: 1200001, max: 1500000, rate: 0.20 },
        { min: 1500001, max: Infinity, rate: 0.30 }
      ];
      
      let taxBreakdown: TaxBreakdownItem[] = [];
      let remainingIncome = taxableIncome;
      
      newRegimeSlabs.forEach(slab => {
        if (remainingIncome <= 0) return;
        
        const slabAmount = Math.min(remainingIncome, slab.max - slab.min);
        if (slabAmount <= 0) return;
        
        const slabTax = slabAmount * slab.rate;
        calculatedTax += slabTax;
        
        taxBreakdown.push({
          range: `₹${slab.min.toLocaleString('en-IN')} - ${slab.max === Infinity ? '∞' : '₹'+slab.max.toLocaleString('en-IN')}`,
          rate: `${slab.rate * 100}%`,
          amount: slabTax.toLocaleString('en-IN', { maximumFractionDigits: 2 })
        });
        
        remainingIncome -= slabAmount;
      });
      
      setTaxLiability(calculatedTax);
      setBreakdown(taxBreakdown);
    } 
    // Old Tax Regime
    else {
      let taxableIncome = grossIncome - totalDeductions;
      let calculatedTax = 0;
      
      // Different slabs based on age group
      let oldRegimeSlabs;
      if (ageGroup === 'below60') {
        oldRegimeSlabs = [
          { min: 0, max: 250000, rate: 0 },
          { min: 250001, max: 500000, rate: 0.05 },
          { min: 500001, max: 1000000, rate: 0.20 },
          { min: 1000001, max: Infinity, rate: 0.30 }
        ];
      } else if (ageGroup === '60to80') {
        oldRegimeSlabs = [
          { min: 0, max: 300000, rate: 0 },
          { min: 300001, max: 500000, rate: 0.05 },
          { min: 500001, max: 1000000, rate: 0.20 },
          { min: 1000001, max: Infinity, rate: 0.30 }
        ];
      } else { // 80+
        oldRegimeSlabs = [
          { min: 0, max: 500000, rate: 0 },
          { min: 500001, max: 1000000, rate: 0.20 },
          { min: 1000001, max: Infinity, rate: 0.30 }
        ];
      }
      
      let taxBreakdown = [];
      let remainingIncome = taxableIncome;
      
      oldRegimeSlabs.forEach(slab => {
        if (remainingIncome <= slab.min) return;
        
        const slabAmount = Math.min(remainingIncome - slab.min, slab.max - slab.min);
        if (slabAmount <= 0) return;
        
        const slabTax = slabAmount * slab.rate;
        calculatedTax += slabTax;
        
        taxBreakdown.push({
          range: `₹${slab.min.toLocaleString('en-IN')} - ${slab.max === Infinity ? '∞' : '₹'+slab.max.toLocaleString('en-IN')}`,
          rate: `${slab.rate * 100}%`,
          amount: slabTax.toLocaleString('en-IN', { maximumFractionDigits: 2 })
        });
      });
      
      // Rebate under section 87A (if applicable)
      if (ageGroup === 'below60' && grossIncome <= 700000 && regime === 'old') {
        const rebate = Math.min(calculatedTax, 25000);
        calculatedTax -= rebate;
        taxBreakdown.push({
          range: 'Rebate u/s 87A',
          rate: '-',
          amount: `-₹${rebate.toLocaleString('en-IN')}`
        });
      }
      
      setTaxLiability(calculatedTax);
      setBreakdown(taxBreakdown);
    }
    
    // Calculate Health and Education Cess (4%)
    const calculatedCess = taxLiability * 0.04;
    setCess(calculatedCess);
    setTotalTax(taxLiability + calculatedCess);
  };

  const updateDeduction = (key: keyof typeof deductions, value: string) => {
    setDeductions(prev => ({
      ...prev,
      [key]: parseFloat(value) || 0
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="calculate" size={32} color="#2563EB" />
        <Text style={styles.title}>Income Tax Calculator</Text>
        <Text style={styles.subtitle}>FY 2023-24 (AY 2024-25)</Text>
      </View>
      
      <View style={styles.card}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Total Annual Income (₹)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={income}
            onChangeText={setIncome}
            placeholder="Enter your total income"
            placeholderTextColor="#9CA3AF"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tax Regime</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={regime}
              style={styles.picker}
              onValueChange={(itemValue) => setRegime(itemValue)}>
              <Picker.Item label="New Tax Regime (Default)" value="new" />
              <Picker.Item label="Old Tax Regime" value="old" />
            </Picker>
          </View>
        </View>
        
        {regime === 'old' && (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Age Group</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={ageGroup}
                  style={styles.picker}
                  onValueChange={(itemValue) => setAgeGroup(itemValue)}>
                  <Picker.Item label="Below 60 years" value="below60" />
                  <Picker.Item label="60-80 years (Senior Citizen)" value="60to80" />
                  <Picker.Item label="Above 80 years (Super Senior)" value="above80" />
                </Picker>
              </View>
            </View>
            
            <Text style={styles.sectionHeader}>Deductions (Old Regime Only)</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Section 80C (₹)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={deductions.section80C.toString()}
                onChangeText={(text) => updateDeduction('section80C', text)}
                placeholder="Max ₹1,50,000"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Section 80D (Health Insurance) (₹)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={deductions.section80D.toString()}
                onChangeText={(text) => updateDeduction('section80D', text)}
                placeholder="Depends on age"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>HRA Exemption (₹)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={deductions.hra.toString()}
                onChangeText={(text) => updateDeduction('hra', text)}
                placeholder="House Rent Allowance"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Other Deductions (₹)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={deductions.other.toString()}
                onChangeText={(text) => updateDeduction('other', text)}
                placeholder="Other deductions"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </>
        )}
        
        <TouchableOpacity style={styles.button} onPress={calculateTax}>
          <Text style={styles.buttonText}>Calculate Tax Liability</Text>
        </TouchableOpacity>
      </View>
      
      {taxLiability > 0 && (
        <View style={styles.resultCard}>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Tax Liability</Text>
            <Text style={styles.resultValue}>
              ₹{taxLiability.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </Text>
          </View>
          
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Health & Education Cess (4%)</Text>
            <Text style={styles.resultValue}>
              ₹{cess.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </Text>
          </View>
          
          <View style={[styles.resultItem, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Tax Payable</Text>
            <Text style={styles.totalValue}>
              ₹{totalTax.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </Text>
          </View>
          
          <Text style={styles.breakdownTitle}>Tax Calculation Breakdown</Text>
          <View style={styles.breakdownHeader}>
            <Text style={styles.breakdownHeaderText}>Income Range</Text>
            <Text style={styles.breakdownHeaderText}>Rate</Text>
            <Text style={styles.breakdownHeaderText}>Amount</Text>
          </View>
          {breakdown.map((item, index) => (
            <View key={index} style={styles.breakdownItem}>
              <Text style={styles.breakdownText}>{item.range}</Text>
              <Text style={styles.breakdownText}>{item.rate}</Text>
              <Text style={styles.breakdownText}>₹{item.amount}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginTop: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  resultLabel: {
    fontSize: 14,
    color: '#4B5563',
  },
  resultValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  totalRow: {
    borderBottomWidth: 0,
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#E5E7EB',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563EB',
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 20,
    marginBottom: 12,
  },
  breakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
  },
  breakdownHeaderText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  breakdownText: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
  },
});

export default IndiaTaxEstimationScreen;