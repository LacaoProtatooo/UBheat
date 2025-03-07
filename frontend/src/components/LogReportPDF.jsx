import React from "react";
import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 40,
    backgroundColor: "#f7f7f7",
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
    color: "#2c3e50",
  },
  subHeader: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
    color: "#34495e",
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  text: {
    fontSize: 12,
    marginBottom: 8,
    color: "#333",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    alignSelf: "center",
  },
  divider: {
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    marginBottom: 15,
  },
  chartImage: {
    width: "100%",
    marginBottom: 20,
  },
  logEntry: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 4,
  },
});

const LogReportPDF = ({ logs, chartImage }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Image src="/UB_Logo.png" style={styles.logo} />
        <Text style={styles.header}>UBheat Analysis</Text>
        <View style={styles.divider} />
        <Text style={styles.header}>User Logs Report</Text>
        {chartImage && (
          <Image
            src={chartImage}
            style={styles.chartImage}
          />
        )}
        {logs.map((log, index) => (
          <View key={index} style={styles.logEntry}>
            <Text style={styles.text}>Log {index + 1}</Text>
            <Text style={styles.text}>Temperature: {log.temperature}°C</Text>
            <Text style={styles.text}>CO2 Emissions: {log.co2Emissions} MtCO2</Text>
            <Text style={styles.text}>Emission Rate: {log.emissionRate}%</Text>
            <View style={styles.divider} />
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default LogReportPDF;