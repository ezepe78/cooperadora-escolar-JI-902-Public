import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { useData } from '../contexts/DataContext';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const AccountsChart = ({ accounts }) => {
  const { formatCurrency } = useData();
  
  const chartData = {
    labels: accounts.map(account => account.name),
    datasets: [
      {
        data: accounts.map(account => account.saldoFinal),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw;
            const percentage = context.dataset.data.reduce((a, b) => a + b, 0) > 0
              ? (value / context.dataset.data.reduce((a, b) => a + b, 0) * 100).toFixed(1)
              : 0;
            return `${label}: ${formatCurrency(value)} (${percentage}%)`;
          }
        }
      }
    }
  };
  
  return (
    <div className="h-64">
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default AccountsChart;
