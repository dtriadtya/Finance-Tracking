import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MonthlyReport, YearlyReport, TrialBalance } from '../types/finance';
import { format, parseISO } from 'date-fns';

export function useFinancialReports() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [monthlyReports, setMonthlyReports] = useState<MonthlyReport[]>([]);
  const [yearlyReports, setYearlyReports] = useState<YearlyReport[]>([]);
  const [trialBalance, setTrialBalance] = useState<TrialBalance[]>([]);
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
    profit: 0
  });

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    try {
      setLoading(true);
      setError(null);

      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        // Instead of throwing an error, initialize with empty data
        setMonthlyReports([]);
        setYearlyReports([]);
        setTrialBalance([]);
        return;
      }

      // Fetch all transactions
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      // If no transactions, set empty data
      if (!transactions || transactions.length === 0) {
        setSummary({
          balance: 0,
          income: 0,
          expenses: 0,
          profit: 0
        });
        setMonthlyReports([]);
        setYearlyReports([]);
        setTrialBalance([
          {
            account: 'Kas',
            debit: 0,
            credit: 0
          },
          {
            account: 'Pendapatan',
            debit: 0,
            credit: 0
          },
          {
            account: 'Beban',
            debit: 0,
            credit: 0
          }
        ]);
        return;
      }

      // Calculate summary
      const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      setSummary({
        balance: totalIncome - totalExpenses,
        income: totalIncome,
        expenses: totalExpenses,
        profit: totalIncome - totalExpenses
      });

      // Calculate monthly reports
      const monthlyData = new Map<string, MonthlyReport>();
      
      transactions.forEach(transaction => {
        const date = parseISO(transaction.date);
        const key = format(date, 'yyyy-MM');
        const monthYear = {
          month: format(date, 'MMMM'),
          year: date.getFullYear()
        };

        const existing = monthlyData.get(key) || {
          ...monthYear,
          totalIncome: 0,
          totalExpense: 0,
          netProfit: 0
        };

        const amount = Number(transaction.amount);
        if (transaction.type === 'income') {
          existing.totalIncome += amount;
        } else {
          existing.totalExpense += amount;
        }
        existing.netProfit = existing.totalIncome - existing.totalExpense;

        monthlyData.set(key, existing);
      });

      // Sort monthly reports by year and month (most recent first)
      setMonthlyReports(Array.from(monthlyData.values())
        .sort((a, b) => {
          if (b.year !== a.year) {
            return b.year - a.year;
          }
          // Get month number (0-11) for comparison
          const monthA = new Date(Date.parse(`${a.month} 1, 2000`)).getMonth();
          const monthB = new Date(Date.parse(`${b.month} 1, 2000`)).getMonth();
          return monthB - monthA;
        }));

      // Calculate yearly reports
      const yearlyData = new Map<number, YearlyReport>();
      
      transactions.forEach(transaction => {
        const year = parseISO(transaction.date).getFullYear();
        const existing = yearlyData.get(year) || {
          year,
          totalIncome: 0,
          totalExpense: 0,
          netProfit: 0
        };

        const amount = Number(transaction.amount);
        if (transaction.type === 'income') {
          existing.totalIncome += amount;
        } else {
          existing.totalExpense += amount;
        }
        existing.netProfit = existing.totalIncome - existing.totalExpense;

        yearlyData.set(year, existing);
      });

      // Sort yearly reports by year (most recent first)
      setYearlyReports(Array.from(yearlyData.values())
        .sort((a, b) => b.year - a.year));

      // Calculate trial balance with proper accounting principles
      const trialBalanceData: TrialBalance[] = [
        // Kas (Asset account)
        {
          account: 'Kas',
          debit: totalIncome, // All income increases cash (debit)
          credit: totalExpenses // All expenses decrease cash (credit)
        },
        // Pendapatan (Revenue/Income account)
        {
          account: 'Pendapatan',
          debit: 0, // Income accounts normally have credit balance
          credit: totalIncome // All income credited to revenue
        },
        // Beban (Expense account)
        {
          account: 'Beban',
          debit: totalExpenses, // All expenses debited
          credit: 0 // Expense accounts normally have debit balance
        }
      ];

      setTrialBalance(trialBalanceData);

    } catch (err) {
      console.error('Error fetching reports:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching reports');
      
      // Set default values in case of error
      setMonthlyReports([]);
      setYearlyReports([]);
      setTrialBalance([]);
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    summary,
    monthlyReports,
    yearlyReports,
    trialBalance,
    refreshReports: fetchReports
  };
}