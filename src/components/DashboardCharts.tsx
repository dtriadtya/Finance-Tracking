import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import { MonthlyReport } from '../types/finance';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

interface DashboardChartsProps {
  monthlyReports: MonthlyReport[];
  totalIncome: number;
  totalExpenses: number;
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({
  monthlyReports,
  totalIncome,
  totalExpenses,
}) => {
  // Prepare data for trend chart
  const trendData = {
    labels: monthlyReports.slice(0, 6).reverse().map(report => `${report.month} ${report.year}`),
    datasets: [
      {
        label: 'Pemasukan',
        data: monthlyReports.slice(0, 6).reverse().map(report => report.totalIncome),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.4,
      },
      {
        label: 'Pengeluaran',
        data: monthlyReports.slice(0, 6).reverse().map(report => report.totalExpense),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const trendOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 12,
          font: {
            size: 11
          }
        }
      },
      title: {
        display: true,
        text: 'Tren Keuangan 6 Bulan Terakhir',
        font: {
          size: 14
        }
      },
      datalabels: {
        display: false // Disable datalabels for line chart
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => `Rp ${value.toLocaleString()}`,
          font: {
            size: 10
          }
        }
      },
      x: {
        ticks: {
          font: {
            size: 10
          }
        }
      }
    },
  };

  // Calculate total for percentage
  const total = totalIncome + totalExpenses;
  
  // Prepare data for pie chart
  const pieData = {
    labels: ['Pemasukan', 'Pengeluaran'],
    datasets: [
      {
        data: [totalIncome, totalExpenses],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.5,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 12,
          font: {
            size: 11
          }
        }
      },
      title: {
        display: true,
        text: 'Distribusi Pemasukan dan Pengeluaran',
        font: {
          size: 14
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: Rp ${value.toLocaleString()} (${percentage}%)`;
          },
        },
      },
      datalabels: {
        display: true,
        color: '#fff',
        font: {
          weight: 'bold',
          size: 12
        },
        formatter: (value: number) => {
          const percentage = ((value / total) * 100).toFixed(1);
          return `${percentage}%`;
        },
        anchor: 'center',
        align: 'center',
        offset: 0
      }
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div className="bg-white p-4 rounded-lg shadow h-[300px]">
        <Line data={trendData} options={trendOptions} />
      </div>
      <div className="bg-white p-4 rounded-lg shadow h-[300px]">
        <Pie data={pieData} options={pieOptions} />
      </div>
    </div>
  );
};