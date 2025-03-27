import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { DataTable } from "react-native-paper";

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
}

const PdfPage = () => {
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });

      if (result.assets && result.assets[0]) {
        setPdfUri(result.assets[0].uri);
        setError(null);
      }
    } catch (err) {
      setError("Failed to pick document");
      console.error(err);
    }
  };

  const processPdf = async () => {
    if (!pdfUri) {
      setError("Please select a PDF first");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // In a real app, you would upload the file to your backend here
      // For this example, we'll simulate the API call

      // Read the file as base64 (simulating what you'd send to backend)
      const base64Data = await FileSystem.readAsStringAsync(pdfUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Simulate API call to backend
      // Replace this with actual fetch/axios call in your implementation
      const mockResponse = await simulateApiCall(base64Data);

      setTransactions(mockResponse.transactions);
    } catch (err) {
      setError("Failed to process PDF");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  // This simulates what your backend would return
  const simulateApiCall = async (
    base64Data: string
  ): Promise<{ transactions: Transaction[] }> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock data - in a real app, this would come from your backend
    return {
      transactions: [
        {
          id: "1",
          date: "2023-05-15",
          description: "Grocery Store",
          amount: 125.75,
          category: "Food",
        },
        {
          id: "2",
          date: "2023-05-16",
          description: "Gas Station",
          amount: 45.2,
          category: "Transportation",
        },
        {
          id: "3",
          date: "2023-05-17",
          description: "Online Shopping",
          amount: 89.99,
          category: "Shopping",
        },
        {
          id: "4",
          date: "2023-05-18",
          description: "Restaurant",
          amount: 65.3,
          category: "Food",
        },
      ],
    };
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Bank Transaction Processor</Text>
      <Text style={styles.subtitle}>
        Upload your bank statement PDF to analyze transactions
      </Text>

      <TouchableOpacity style={styles.button} onPress={pickDocument}>
        <Text style={styles.buttonText}>Select PDF</Text>
      </TouchableOpacity>

      {pdfUri && (
        <Text style={styles.fileInfo}>
          Selected file: {pdfUri.split("/").pop()}
        </Text>
      )}

      {pdfUri && !isProcessing && (
        <TouchableOpacity
          style={[styles.button, styles.processButton]}
          onPress={processPdf}
          disabled={isProcessing}
        >
          <Text style={styles.buttonText}>Process PDF</Text>
        </TouchableOpacity>
      )}

      {isProcessing && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4a90e2" />
          <Text style={styles.loadingText}>Processing PDF with AI...</Text>
        </View>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}

      {transactions.length > 0 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Processed Transactions</Text>

          <DataTable style={styles.table}>
            <DataTable.Header>
              <DataTable.Title>Date</DataTable.Title>
              <DataTable.Title>Description</DataTable.Title>
              <DataTable.Title numeric>Amount</DataTable.Title>
              <DataTable.Title>Category</DataTable.Title>
            </DataTable.Header>

            {transactions.map((transaction) => (
              <DataTable.Row key={transaction.id}>
                <DataTable.Cell>{transaction.date}</DataTable.Cell>
                <DataTable.Cell>{transaction.description}</DataTable.Cell>
                <DataTable.Cell numeric>
                  ${transaction.amount.toFixed(2)}
                </DataTable.Cell>
                <DataTable.Cell>{transaction.category}</DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: "#666",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#4a90e2",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  processButton: {
    backgroundColor: "#2ecc71",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  fileInfo: {
    marginBottom: 20,
    color: "#555",
    textAlign: "center",
  },
  loadingContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginVertical: 10,
  },
  resultsContainer: {
    marginTop: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  table: {
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 20,
  },
});

export default PdfPage;
