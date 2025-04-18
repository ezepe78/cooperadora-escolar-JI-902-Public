import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useData } from '../contexts/DataContext';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BalanceChart = ({ data, type }) => {
  const { formatCurrency } = useData();
  
  const isIncome = type === 'ingresos';
  const categories = isIncome ? data.ingresosCategorias : data.egresosCategorias;
  
  const chartData = {
    labels: categories.map(cat => cat.name),
    datasets: [
      {
        label: isIncome ? 'Ingresos' : 'Egresos',
        data: categories.map(cat => cat.amount),
        backgroundColor: isIncome ? 'rgba(16, 185, 129, 0.8)' : 'rgba(239, 68, 68, 0.8)',
        borderColor: isIncome ? 'rgb(16, 185, 129)' : 'rgb(239, 68, 68)',
        borderWidth: 1,
      },
    ],
  };
  
  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${formatCurrency(context.raw)}`;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          callback: function(value) {
            return formatCurrency(value);
          }
        }
      }
    }
  };
  
  return (
    <div className="h-64">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BalanceChart;
