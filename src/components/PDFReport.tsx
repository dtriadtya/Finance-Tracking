import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { MonthlyReport, YearlyReport, TrialBalance } from '../types/finance';

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  table: {
    display: 'table',
    width: '100%',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    alignItems: 'center',
    minHeight: 30,
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
  },
  tableCell: {
    flex: 1,
    padding: 5,
  },
  amount: {
    textAlign: 'right',
  },
});

interface MonthlyReportPDFProps {
  data: MonthlyReport[];
}

export const MonthlyReportPDF: React.FC<MonthlyReportPDFProps> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Rekap Bulanan</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>Bulan</Text>
          <Text style={styles.tableCell}>Pemasukan</Text>
          <Text style={styles.tableCell}>Pengeluaran</Text>
          <Text style={styles.tableCell}>Laba/Rugi</Text>
        </View>
        {data.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{`${item.month} ${item.year}`}</Text>
            <Text style={[styles.tableCell, styles.amount]}>
              Rp {item.totalIncome.toLocaleString()}
            </Text>
            <Text style={[styles.tableCell, styles.amount]}>
              Rp {item.totalExpense.toLocaleString()}
            </Text>
            <Text style={[styles.tableCell, styles.amount]}>
              Rp {item.netProfit.toLocaleString()}
            </Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

interface YearlyReportPDFProps {
  data: YearlyReport[];
}

export const YearlyReportPDF: React.FC<YearlyReportPDFProps> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Rekap Tahunan</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>Tahun</Text>
          <Text style={styles.tableCell}>Total Pemasukan</Text>
          <Text style={styles.tableCell}>Total Pengeluaran</Text>
          <Text style={styles.tableCell}>Laba/Rugi</Text>
        </View>
        {data.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.year}</Text>
            <Text style={[styles.tableCell, styles.amount]}>
              Rp {item.totalIncome.toLocaleString()}
            </Text>
            <Text style={[styles.tableCell, styles.amount]}>
              Rp {item.totalExpense.toLocaleString()}
            </Text>
            <Text style={[styles.tableCell, styles.amount]}>
              Rp {item.netProfit.toLocaleString()}
            </Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

interface TrialBalancePDFProps {
  data: TrialBalance[];
}

export const TrialBalancePDF: React.FC<TrialBalancePDFProps> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Neraca Percobaan</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>Akun</Text>
          <Text style={styles.tableCell}>Debit</Text>
          <Text style={styles.tableCell}>Kredit</Text>
        </View>
        {data.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.account}</Text>
            <Text style={[styles.tableCell, styles.amount]}>
              {item.debit > 0 ? `Rp ${item.debit.toLocaleString()}` : '-'}
            </Text>
            <Text style={[styles.tableCell, styles.amount]}>
              {item.credit > 0 ? `Rp ${item.credit.toLocaleString()}` : '-'}
            </Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);