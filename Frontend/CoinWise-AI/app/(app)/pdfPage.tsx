import  { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { MaterialIcons } from "@expo/vector-icons";

interface Transaction {
  date: string;
  description: string;
  amount: number;
  category: string;
  type: string;
  paymentMethod: string;
  merchant?: string;
  isRecurring?: boolean;
  isEssential?: boolean;
}

interface AnomalyAlert {
  type:
    | "high_amount"
    | "unusual_category"
    | "multiple_transactions"
    | "unusual_time";
  message: string;
  severity: "high" | "medium" | "low";
  transaction: Transaction;
}

interface BehavioralInsight {
  category: string;
  totalSpent: number;
  percentageOfTotal: number;
  trend: "increasing" | "decreasing" | "stable";
  unusualPatterns: string[];
}

const PdfPage = () => {
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [anomalyAlerts, setAnomalyAlerts] = useState<AnomalyAlert[]>([]);
  const [behavioralInsights, setBehavioralInsights] = useState<
    BehavioralInsight[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "transactions" | "alerts" | "insights"
  >("transactions");

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
      // Simulate API call with dummy data
      const mockResponse = await simulateApiCall();
      setTransactions(mockResponse.transactions);
      setAnomalyAlerts(mockResponse.anomalyAlerts);
      setBehavioralInsights(mockResponse.behavioralInsights);
    } catch (err) {
      setError("Failed to process PDF");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const simulateApiCall = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Dummy transactions data
    const transactions = [
      {
        id: "1",
        date: "2023-05-15",
        description: "Grocery Store",
        amount: 125.75,
        category: "Food",
        type: "expense",
        paymentMethod: "credit card",
        isRecurring: false,
        isEssential: true,
      },
      {
        id: "2",
        date: "2023-05-16",
        description: "Gas Station",
        amount: 45.2,
        category: "Transportation",
        type: "expense",
        paymentMethod: "cash",
        isRecurring: false,
        isEssential: true,
      },
      {
        id: "3",
        date: "2023-05-17",
        description: "Online Shopping",
        amount: 89.99,
        category: "Shopping",
        type: "expense",
        paymentMethod: "credit card",
        isRecurring: false,
        isEssential: false,
      },
      {
        id: "4",
        date: "2023-05-18",
        description: "Restaurant",
        amount: 65.3,
        category: "Food",
        type: "expense",
        paymentMethod: "credit card",
        isRecurring: false,
        isEssential: true,
      },
      {
        id: "5",
        date: "2023-05-19",
        description: "Large Purchase - Electronics",
        amount: 999.99,
        category: "Shopping",
        type: "expense",
        paymentMethod: "credit card",
        isRecurring: false,
        isEssential: false,
      },
      {
        id: "6",
        date: "2023-05-20",
        description: "Multiple Small Purchases",
        amount: 25.5,
        category: "Food",
        type: "expense",
        paymentMethod: "debit card",
        isRecurring: false,
        isEssential: false,
      },
    ];

    // Dummy anomaly alerts
    const anomalyAlerts: AnomalyAlert[] = [
      {
        type: "high_amount",
        message: "Unusually high transaction amount detected",
        severity: "high",
        transaction: transactions[4], // Using the large electronics purchase
      },
      {
        type: "unusual_category",
        message: "Multiple transactions in a new category",
        severity: "medium",
        transaction: transactions[2], // Using the online shopping transaction
      },
      {
        type: "multiple_transactions",
        message: "Multiple transactions to the same merchant in short time",
        severity: "low",
        transaction: transactions[5], // Using the multiple small purchases transaction
      },
    ];

    // Dummy behavioral insights
    const behavioralInsights: BehavioralInsight[] = [
      {
        category: "Food & Dining",
        totalSpent: 109.65,
        percentageOfTotal: 15.2,
        trend: "increasing",
        unusualPatterns: ["Increased spending on weekends"],
      },
      {
        category: "Transportation",
        totalSpent: 126.8,
        percentageOfTotal: 17.5,
        trend: "stable",
        unusualPatterns: ["Regular usage during weekdays"],
      },
      {
        category: "Entertainment",
        totalSpent: 48.49,
        percentageOfTotal: 6.7,
        trend: "decreasing",
        unusualPatterns: ["Reduced spending compared to last month"],
      },
    ];

    return {
      transactions,
      anomalyAlerts,
      behavioralInsights,
    };
  };

  const renderAnomalyAlert = (alert: AnomalyAlert) => {
    const getSeverityColor = (severity: string) => {
      switch (severity) {
        case "high":
          return "#ff4444";
        case "medium":
          return "#ffbb33";
        case "low":
          return "#00C851";
        default:
          return "#2BBBAD";
      }
    };

    return (
      <View
        style={[
          styles.alertCard,
          { borderLeftColor: getSeverityColor(alert.severity) },
        ]}
      >
        <View style={styles.alertHeader}>
          <MaterialIcons
            name={alert.severity === "high" ? "warning" : "info"}
            size={24}
            color={getSeverityColor(alert.severity)}
          />
          <Text
            style={[
              styles.alertTitle,
              { color: getSeverityColor(alert.severity) },
            ]}
          >
            {alert.type.replace("_", " ").toUpperCase()}
          </Text>
        </View>
        <Text style={styles.alertMessage}>{alert.message}</Text>
        <View style={styles.alertDetails}>
          <Text style={styles.alertAmount}>
            ${Math.abs(alert.transaction.amount).toFixed(2)}
          </Text>
          <Text style={styles.alertDate}>{alert.transaction.date}</Text>
        </View>
      </View>
    );
  };

  const renderBehavioralInsight = (insight: BehavioralInsight) => {
    const getTrendIcon = (trend: string) => {
      switch (trend) {
        case "increasing":
          return "trending-up";
        case "decreasing":
          return "trending-down";
        case "stable":
          return "trending-flat";
        default:
          return "trending-flat";
      }
    };

    return (
      <View style={styles.insightCard}>
        <View style={styles.insightHeader}>
          <Text style={styles.insightCategory}>{insight.category}</Text>
          <MaterialIcons
            name={getTrendIcon(insight.trend)}
            size={24}
            color={
              insight.trend === "increasing"
                ? "#ff4444"
                : insight.trend === "decreasing"
                ? "#00C851"
                : "#2BBBAD"
            }
          />
        </View>
        <View style={styles.insightStats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Spent</Text>
            <Text style={styles.statValue}>
              ${insight.totalSpent.toFixed(2)}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>% of Total</Text>
            <Text style={styles.statValue}>
              {insight.percentageOfTotal.toFixed(1)}%
            </Text>
          </View>
        </View>
        <View style={styles.patternsContainer}>
          {insight.unusualPatterns.map((pattern, index) => (
            <View key={index} style={styles.patternItem}>
              <MaterialIcons name="lightbulb" size={16} color="#FFD700" />
              <Text style={styles.patternText}>{pattern}</Text>
            </View>
          ))}
        </View>
      </View>
    );
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
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === "transactions" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("transactions")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "transactions" && styles.activeTabText,
                ]}
              >
                Transactions
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "alerts" && styles.activeTab]}
              onPress={() => setActiveTab("alerts")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "alerts" && styles.activeTabText,
                ]}
              >
                Anomaly Alerts
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "insights" && styles.activeTab]}
              onPress={() => setActiveTab("insights")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "insights" && styles.activeTabText,
                ]}
              >
                Behavioral Insights
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === "transactions" && (
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.headerCell, styles.cell]}>Date</Text>
                <Text style={[styles.headerCell, styles.cell]}>
                  Description
                </Text>
                <Text
                  style={[styles.headerCell, styles.cell, styles.amountCell]}
                >
                  Amount
                </Text>
                <Text style={[styles.headerCell, styles.cell]}>Category</Text>
              </View>

              {transactions.map((transaction, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.cell}>{transaction.date}</Text>
                  <Text style={styles.cell}>{transaction.description}</Text>
                  <Text
                    style={[
                      styles.cell,
                      styles.amountCell,
                      { color: transaction.amount < 0 ? "#ff4444" : "#00C851" },
                    ]}
                  >
                    ${Math.abs(transaction.amount).toFixed(2)}
                  </Text>
                  <Text style={styles.cell}>{transaction.category}</Text>
                </View>
              ))}
            </View>
          )}

          {activeTab === "alerts" && (
            <View style={styles.alertsContainer}>
              {anomalyAlerts.map((alert, index) => (
                <View key={index}>{renderAnomalyAlert(alert)}</View>
              ))}
            </View>
          )}

          {activeTab === "insights" && (
            <View style={styles.insightsContainer}>
              {behavioralInsights.map((insight, index) => (
                <View key={index}>{renderBehavioralInsight(insight)}</View>
              ))}
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    marginTop: 40,
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
  tabContainer: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: "#4a90e2",
  },
  tabText: {
    color: "#666",
    fontWeight: "600",
  },
  activeTabText: {
    color: "white",
  },
  table: {
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerCell: {
    fontWeight: "bold",
    color: "#333",
  },
  cell: {
    flex: 1,
    paddingHorizontal: 8,
    textAlign: "left",
  },
  amountCell: {
    textAlign: "right",
  },
  alertsContainer: {
    marginTop: 12,
  },
  insightsContainer: {
    marginTop: 12,
  },
  alertCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alertHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  alertTitle: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
  alertMessage: {
    color: "#666",
    marginBottom: 8,
  },
  alertDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  alertAmount: {
    fontWeight: "bold",
    color: "#333",
  },
  alertDate: {
    color: "#666",
  },
  insightCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  insightCategory: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  insightStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    color: "#666",
    fontSize: 12,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  patternsContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 6,
    padding: 12,
  },
  patternItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  patternText: {
    marginLeft: 8,
    color: "#666",
  },
});

export default PdfPage;
