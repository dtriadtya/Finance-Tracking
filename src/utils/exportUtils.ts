import ExcelJS from 'exceljs';
import { format } from 'date-fns';
import { MonthlyReport, YearlyReport, TrialBalance } from '../types/finance';

export const exportToExcel = async (data: any[], sheetName: string, fileName: string) => {
  try {
    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    // Add headers
    if (data.length > 0) {
      const headers = Object.keys(data[0]);
      worksheet.columns = headers.map(header => ({
        header,
        key: header,
        width: 20
      }));
    }

    // Add rows
    worksheet.addRows(data);

    // Style the header row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

    // Generate the Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    
    // Create a Blob from the buffer
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // Create a download link and trigger it
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    alert('Failed to export to Excel. Please try again.');
  }
};

export const formatMonthlyReportForExcel = (data: MonthlyReport[]) => {
  return data.map(item => ({
    'Bulan': item.month,
    'Tahun': item.year,
    'Total Pemasukan': `Rp ${item.totalIncome.toLocaleString()}`,
    'Total Pengeluaran': `Rp ${item.totalExpense.toLocaleString()}`,
    'Laba/Rugi': `Rp ${item.netProfit.toLocaleString()}`
  }));
};

export const formatYearlyReportForExcel = (data: YearlyReport[]) => {
  return data.map(item => ({
    'Tahun': item.year,
    'Total Pemasukan': `Rp ${item.totalIncome.toLocaleString()}`,
    'Total Pengeluaran': `Rp ${item.totalExpense.toLocaleString()}`,
    'Laba/Rugi': `Rp ${item.netProfit.toLocaleString()}`
  }));
};

export const formatTrialBalanceForExcel = (data: TrialBalance[]) => {
  return data.map(item => ({
    'Akun': item.account,
    'Debit': item.debit > 0 ? `Rp ${item.debit.toLocaleString()}` : '-',
    'Kredit': item.credit > 0 ? `Rp ${item.credit.toLocaleString()}` : '-'
  }));
};