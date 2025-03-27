import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { Link } from "expo-router";
import BankCard from "@/components/banking/BankCard";
import { banks } from "@/constants/bank";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";

export default function SyncBankScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Bank</Text>
      <Text style={styles.subtitle}>
        We'll securely connect to your bank account or upload a statement
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
        ListFooterComponent={
          <>
            <View style={styles.separator} />
            <Link href="/(app)/pdfPage" asChild>
              <TouchableOpacity style={styles.pdfOption}>
                <View style={styles.pdfOptionContent}>
                  <MaterialIcons
                    name="picture-as-pdf"
                    size={24}
                    color="#EF4444"
                  />
                  <Text style={styles.pdfOptionText}>Upload PDF Statement</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </Link>
          </>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "white",
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#111827",
  },
  subtitle: {
    color: "#6B7280",
    marginBottom: 32,
  },
  separator: {
    height: 16,
  },
  pdfOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  pdfOptionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  pdfOptionText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },
});
