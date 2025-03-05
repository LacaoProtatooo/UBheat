import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  section: {
    marginBottom: 20,
  },
  chartImage: {
    width: '100%',
    height: 'auto',
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 5,
  },
});

const WeatherTrendsPDF = ({
  weatherData,
  historicalData,
  futureData,
  allYears,
  allTemps,
  allMtCO2,
  regressionLine,
  chartImages,
}) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Weather Trends in the Philippines</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Weather Trends</Text>
        {chartImages.lineChartImage && (
          <Image style={styles.chartImage} src={chartImages.lineChartImage} />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Temperature Distribution</Text>
        {chartImages.pieChartImage && (
          <Image style={styles.chartImage} src={chartImages.pieChartImage} />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Wind Speed Over 6 Days</Text>
        {chartImages.barChartImage && (
          <Image style={styles.chartImage} src={chartImages.barChartImage} />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Weather Metrics Distribution</Text>
        {chartImages.donutChartImage && (
          <Image style={styles.chartImage} src={chartImages.donutChartImage} />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Philippines Urban Heat Prediction Model (2015-2030)</Text>
        {chartImages.urbanHeatChartImage && (
          <Image style={styles.chartImage} src={chartImages.urbanHeatChartImage} />
        )}
      </View>
    </Page>
  </Document>
);

export default WeatherTrendsPDF;