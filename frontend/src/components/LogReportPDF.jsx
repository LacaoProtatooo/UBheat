import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register alternative fonts from a reliable CDN
// Using Open Sans as an alternative to Roboto
Font.register({
  family: 'Open Sans',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/open-sans/1.1.0/OpenSans-Regular.ttf', fontWeight: 'normal' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/open-sans/1.1.0/OpenSans-Bold.ttf', fontWeight: 'bold' }
  ]
});

// Or use standard web fonts that don't require downloading
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'Helvetica' },
    { src: 'Helvetica-Bold', fontWeight: 'bold' }
  ]
});

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica' // Using the safe default font
  },
  header: {
    marginBottom: 20,
    borderBottom: '1 solid #eaeaea',
    paddingBottom: 10
  },
  title: {
    fontSize: 24,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    color: '#2c3e50'
  },
  subtitle: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 5
  },
  chartContainer: {
    marginVertical: 20,
    alignItems: 'center'
  },
  chartImage: {
    width: 500,
    height: 250,
    marginBottom: 10,
    border: '1 solid #eaeaea',
    borderRadius: 5
  },
  section: {
    marginTop: 15,
    marginBottom: 10
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: 8,
    paddingBottom: 5,
    borderBottom: '1 solid #eaeaea'
  },
  logEntry: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    borderLeft: '3 solid #3498db'
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  logNumber: {
    fontSize: 12,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    color: '#2c3e50'
  },
  logTimestamp: {
    fontSize: 10,
    color: '#7f8c8d'
  },
  dataGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  dataItem: {
    width: '30%',
    padding: 8,
    backgroundColor: '#f1f8ff',
    borderRadius: 3
  },
  dataLabel: {
    fontSize: 9,
    color: '#7f8c8d'
  },
  dataValue: {
    fontSize: 12,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    color: '#3498db',
    marginTop: 2
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#95a5a6',
    borderTop: '1 solid #eaeaea',
    paddingTop: 10
  }
});

// Create LogReportPDF component
const LogReportPDF = ({ logs, chartImage }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>UBheat Analysis Report</Text>
        <Text style={styles.subtitle}>Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</Text>
      </View>
      
      {chartImage && (
        <View style={styles.chartContainer}>
          <Image src={chartImage} style={styles.chartImage} />
          <Text style={{ fontSize: 10, color: '#7f8c8d' }}>Temperature & CO2 Emissions Trend Analysis</Text>
        </View>
      )}
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Log Entries Summary</Text>
        {logs.map((log, index) => (
          <View key={index} style={styles.logEntry}>
            <View style={styles.logHeader}>
              <Text style={styles.logNumber}>Log Entry #{index + 1}</Text>
              {log.timestamp && <Text style={styles.logTimestamp}>{log.timestamp}</Text>}
            </View>
            <View style={styles.dataGrid}>
              <View style={styles.dataItem}>
                <Text style={styles.dataLabel}>Temperature</Text>
                <Text style={styles.dataValue}>{log.temperature}°C</Text>
              </View>
              <View style={styles.dataItem}>
                <Text style={styles.dataLabel}>CO2 Emissions</Text>
                <Text style={styles.dataValue}>{log.co2Emissions} MtCO2</Text>
              </View>
              <View style={styles.dataItem}>
                <Text style={styles.dataLabel}>Emission Rate</Text>
                <Text style={styles.dataValue}>{log.emissionRate}%</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
      
      <View style={styles.footer}>
        <Text>UBheat Analysis Platform • Environmental Monitoring System</Text>
      </View>
    </Page>
  </Document>
);

export default LogReportPDF;