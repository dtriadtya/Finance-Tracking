export interface Transaction {
  id: string;
  code: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  created_at: string;
  user_id: string;
  attachment_url?: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
}

export interface MonthlyReport extends FinancialSummary {
  month: string;
  year: number;
}

export interface YearlyReport extends FinancialSummary {
  year: number;
}

export interface TrialBalance {
  account: string;
  debit: number;
  credit: number;
}

export interface WorksheetBalance extends TrialBalance {
  adjustedDebit: number;
  adjustedCredit: number;
  balanceSheetDebit: number;
  balanceSheetCredit: number;
  incomeStatementDebit: number;
  incomeStatementCredit: number;
}