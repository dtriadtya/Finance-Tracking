import React, { useEffect, useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useFinancialReports } from '../hooks/useFinancialReports';
import { useTransactions } from '../hooks/useTransactions';
import { format } from 'date-fns';
import { DashboardCharts } from '../components/DashboardCharts';
import { useSidebar } from '../contexts/SidebarContext';
import { updateRLSPolicies } from '../lib/updateRLSPolicies';
import SharedDataBanner from '../components/SharedDataBanner';

const Dashboard = () => {
  const { summary, monthlyReports, loading: reportsLoading } = useFinancialReports();
  const { transactions, loading: transactionsLoading } = useTransactions();
  const { collapsed } = useSidebar();
  const [policyUpdateStatus, setPolicyUpdateStatus] = useState<'loading' | 'success' | 'error'>('loading');

  // Update RLS policies when the dashboard loads
  useEffect(() => {
    const applySharedAccess = async () => {
      try {
        const result = await updateRLSPolicies();
        if (result.success) {
          console.log('RLS policies updated successfully');
          setPolicyUpdateStatus('success');
        } else {
          setPolicyUpdateStatus('error');
        }
      } catch (error) {
        console.error('Failed to update RLS policies:', error);
        setPolicyUpdateStatus('error');
      }
    };
    
    applySharedAccess();
  }, []);

  const recentTransactions = transactions.slice(0, 5);

  return (
    <main className={`flex-1 p-8 transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Keuangan</h1>
        
        <SharedDataBanner />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Saldo</p>
                <p className="text-2xl font-bold text-gray-800">
                  Rp {summary.balance.toLocaleString()}
                </p>
              </div>
              <Wallet className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pemasukan</p>
                <p className="text-2xl font-bold text-green-600">
                  Rp {summary.income.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pengeluaran</p>
                <p className="text-2xl font-bold text-red-600">
                  Rp {summary.expenses.toLocaleString()}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Laba/Rugi</p>
                <p className="text-2xl font-bold text-blue-600">
                  Rp {summary.profit.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </div>

        {!reportsLoading && (
          <DashboardCharts
            monthlyReports={monthlyReports}
            totalIncome={summary.income}
            totalExpenses={summary.expenses}
          />
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Transaksi Terbaru</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactionsLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center">Loading...</td>
                  </tr>
                ) : recentTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center">Belum ada transaksi</td>
                  </tr>
                ) : (
                  recentTransactions.map(transaction => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(transaction.date), 'dd/MM/yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.category}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        Rp {transaction.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;