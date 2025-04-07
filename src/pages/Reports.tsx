import React, { useState } from 'react';
import { FileSpreadsheet, TrendingUp, Calendar, BarChart3, Download } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { MonthlyReportPDF, YearlyReportPDF, TrialBalancePDF } from '../components/PDFReport';
import { exportToExcel, formatMonthlyReportForExcel, formatYearlyReportForExcel, formatTrialBalanceForExcel } from '../utils/exportUtils';
import { useFinancialReports } from '../hooks/useFinancialReports';
import { useTransactions } from '../hooks/useTransactions';
import { format } from 'date-fns';
import { useSidebar } from '../contexts/SidebarContext';
import SharedDataBanner from '../components/SharedDataBanner';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('profit-loss');
  const { summary, monthlyReports, yearlyReports, trialBalance, loading } = useFinancialReports();
  const { transactions } = useTransactions();
  const { collapsed } = useSidebar();

  const getMonthlyTransactionsByCategory = (month: string, year: number, type: 'income' | 'expense') => {
    return transactions
      .filter(t => {
        const date = new Date(t.date);
        return format(date, 'MMMM') === month && 
               date.getFullYear() === year && 
               t.type === type;
      })
      .reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
        return acc;
      }, {} as Record<string, number>);
  };

  const calculatePPHFinal = (income: number) => {
    return income * 0.005;
  };

  const handleExcelExport = async (type: string) => {
    switch (type) {
      case 'monthly':
        await exportToExcel(formatMonthlyReportForExcel(monthlyReports), 'Rekap Bulanan', 'rekap_bulanan');
        break;
      case 'yearly':
        await exportToExcel(formatYearlyReportForExcel(yearlyReports), 'Rekap Tahunan', 'rekap_tahunan');
        break;
      case 'trial-balance':
        await exportToExcel(formatTrialBalanceForExcel(trialBalance), 'Neraca Percobaan', 'neraca_percobaan');
        break;
    }
  };

  const renderMonthlyReport = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Rekap Bulanan</h2>
      {monthlyReports.map((report, index) => {
        const incomeByCategory = getMonthlyTransactionsByCategory(report.month, report.year, 'income');
        const expensesByCategory = getMonthlyTransactionsByCategory(report.month, report.year, 'expense');
        
        return (
          <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {report.month} {report.year}
              </h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase mb-4">Rincian Pemasukan</h4>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-green-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-green-700">Kategori</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-green-700">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {Object.entries(incomeByCategory).map(([category, amount], idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm text-gray-900">{category}</td>
                        <td className="px-4 py-2 text-sm text-green-600 text-right">
                          Rp {amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-green-50 font-medium">
                      <td className="px-4 py-2 text-sm text-green-700">Total Pemasukan</td>
                      <td className="px-4 py-2 text-sm text-green-700 text-right">
                        Rp {report.totalIncome.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase mb-4">Rincian Pengeluaran</h4>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-red-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-red-700">Kategori</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-red-700">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {Object.entries(expensesByCategory).map(([category, amount], idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm text-gray-900">{category}</td>
                        <td className="px-4 py-2 text-sm text-red-600 text-right">
                          Rp {amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-red-50 font-medium">
                      <td className="px-4 py-2 text-sm text-red-700">Total Pengeluaran</td>
                      <td className="px-4 py-2 text-sm text-red-700 text-right">
                        Rp {report.totalExpense.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900">Laba/Rugi Bersih</span>
                <span className={`text-lg font-bold ${
                  report.netProfit >= 0 ? 'text-blue-600' : 'text-red-600'
                }`}>
                  Rp {report.netProfit.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  if (loading) {
    return (
      <main className={`flex-1 p-8 transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </main>
    );
  }

  return (
    <main className={`flex-1 p-8 transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Laporan Keuangan</h1>
          {activeTab !== 'profit-loss' && (
            <div className="flex space-x-2">
              <button
                onClick={() => handleExcelExport(activeTab)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700"
              >
                <Download className="h-4 w-4" />
                <span>Export Excel</span>
              </button>
              <PDFDownloadLink
                document={
                  activeTab === 'monthly' ? (
                    <MonthlyReportPDF data={monthlyReports} />
                  ) : activeTab === 'yearly' ? (
                    <YearlyReportPDF data={yearlyReports} />
                  ) : (
                    <TrialBalancePDF data={trialBalance} />
                  )
                }
                fileName={`${activeTab}_report_${new Date().toISOString().split('T')[0]}.pdf`}
                className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-700"
              >
                <Download className="h-4 w-4" />
                <span>Export PDF</span>
              </PDFDownloadLink>
            </div>
          )}
        </div>

        <SharedDataBanner />

        <div className="bg-white rounded-lg shadow">
          <div className="border-b">
            <nav className="flex space-x-4 p-4">
              <button
                onClick={() => setActiveTab('profit-loss')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  activeTab === 'profit-loss' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <TrendingUp className="h-4 w-4" />
                <span>Laba Rugi</span>
              </button>
              
              <button
                onClick={() => setActiveTab('monthly')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  activeTab === 'monthly' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Calendar className="h-4 w-4" />
                <span>Rekap Bulanan</span>
              </button>
              
              <button
                onClick={() => setActiveTab('yearly')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  activeTab === 'yearly' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Rekap Tahunan</span>
              </button>
              
              <button
                onClick={() => setActiveTab('trial-balance')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  activeTab === 'trial-balance' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FileSpreadsheet className="h-4 w-4" />
                <span>Neraca Percobaan</span>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'profit-loss' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Laporan Laba Rugi</h2>
                {monthlyReports.map((report, index) => {
                  const incomeByCategory = getMonthlyTransactionsByCategory(report.month, report.year, 'income');
                  const expensesByCategory = getMonthlyTransactionsByCategory(report.month, report.year, 'expense');
                  
                  return (
                    <div key={index} className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2">
                        <h3 className="font-semibold">{report.month} {report.year}</h3>
                      </div>
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr className="bg-gray-50">
                            <th colSpan={2} className="px-4 py-2 text-left text-sm font-medium text-green-600">Pemasukan</th>
                            <th colSpan={2} className="px-4 py-2 text-left text-sm font-medium text-red-600">Pengeluaran</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {Math.max(
                            Object.keys(incomeByCategory).length,
                            Object.keys(expensesByCategory).length
                          ) > 0 ? (
                            Object.keys(incomeByCategory).length > 0 || Object.keys(expensesByCategory).length > 0 ? (
                              Array.from({ length: Math.max(
                                Object.keys(incomeByCategory).length,
                                Object.keys(expensesByCategory).length
                              ) }).map((_, idx) => {
                                const incomeEntry = Object.entries(incomeByCategory)[idx] || [];
                                const expenseEntry = Object.entries(expensesByCategory)[idx] || [];
                                return (
                                  <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 text-sm text-gray-900">{incomeEntry[0] || ''}</td>
                                    <td className="px-4 py-2 text-sm text-green-600 text-right">
                                      {incomeEntry[1] ? `Rp ${incomeEntry[1].toLocaleString()}` : ''}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-900">{expenseEntry[0] || ''}</td>
                                    <td className="px-4 py-2 text-sm text-red-600 text-right">
                                      {expenseEntry[1] ? `Rp ${expenseEntry[1].toLocaleString()}` : ''}
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan={4} className="px-4 py-2 text-sm text-gray-500 text-center">
                                  Tidak ada transaksi
                                </td>
                              </tr>
                            )
                          ) : null}
                          <tr className="bg-gray-50 font-medium">
                            <td className="px-4 py-2 text-sm">Total Pemasukan</td>
                            <td className="px-4 py-2 text-sm text-green-600 text-right">
                              Rp {report.totalIncome.toLocaleString()}
                            </td>
                            <td className="px-4 py-2 text-sm">Total Pengeluaran</td>
                            <td className="px-4 py-2 text-sm text-red-600 text-right">
                              Rp {report.totalExpense.toLocaleString()}
                            </td>
                          </tr>
                        </tbody>
                        <tfoot>
                          <tr className="bg-gray-100">
                            <td colSpan={2} className="px-4 py-2 text-sm font-medium">Laba/Rugi Bersih</td>
                            <td colSpan={2} className="px-4 py-2 text-sm font-medium text-blue-600 text-right">
                              Rp {report.netProfit.toLocaleString()}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'monthly' && renderMonthlyReport()}

            {activeTab === 'yearly' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Rekap Tahunan</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tahun</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Pemasukan</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PPH Final (0.5%)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Pengeluaran</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Laba Bersih</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {yearlyReports.map((report, index) => {
                        const pphFinal = calculatePPHFinal(report.totalIncome);
                        const netProfitAfterTax = report.netProfit - pphFinal;
                        
                        return (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {report.year}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                              Rp {report.totalIncome.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-orange-600">
                              Rp {pphFinal.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                              Rp {report.totalExpense.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                              Rp {netProfitAfterTax.toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Reports;