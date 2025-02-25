import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 20,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  text: {
    fontSize: 12,
    marginBottom: 10,
  },
});

const LogReportPDF = ({ logs }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.header}>User Logs Report</Text>
        {logs.map((log, index) => (
          <View key={index}>
            <Text style={styles.text}>Log {index + 1}</Text>
            <Text style={styles.text}>Temperature: {log.temperature}°C</Text>
            <Text style={styles.text}>CO2 Emissions: {log.co2Emissions} MtCO2</Text>
            <Text style={styles.text}>Emission Rate: {log.emissionRate}%</Text>
            <Text style={styles.text}>Analysis: {log.analysis}</Text>
            <Text style={styles.text}>-----------------------------------</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default LogReportPDF;