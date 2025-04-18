import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import FinancialSummary from '../components/FinancialSummary';
import TransactionList from '../components/TransactionList';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const Dashboard = () => {
  const navigate = useNavigate();
  const { 
    currentDate, 
    monthlyData, 
    getCurrentMonthTransactions, 
    getCurrentMonthName,
    formatCurrency
  } = useData();
  
  const currentMonthKey = format(currentDate, 'yyyy-MM');
  const currentMonthData = monthlyData[currentMonthKey];
  const transactions = getCurrentMonthTransactions();
  const monthName = getCurrentMonthName();
  
  // Capitalize first letter
  const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-darkest mb-1">
          Gestión Financiera
        </h1>
        <p className="text-neutral-dark">
          Cooperadora Escolar JI 902
        </p>
      </div>
      
      {/* Current Balance */}
      <div className="card mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold text-neutral-darkest">
              Saldo Actual
            </h2>
            <p className="text-sm text-neutral-dark">
              Consolidado de todas las cuentas
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">
              {currentMonthData ? formatCurrency(currentMonthData.saldoFinal) : '-'}
            </div>
            {currentMonthData && currentMonthData.ingresosChange > 0 && (
              <div className="text-sm text-secondary-dark flex items-center justify-end">
                <i className="bi bi-arrow-up-right mr-1"></i>
                <span>+{currentMonthData.ingresosChange.toFixed(1)}% este mes</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => navigate('/transacciones')}
            className="btn btn-primary"
          >
            <i className="bi bi-plus-circle"></i> Nueva Transacción
          </button>
          <button 
            onClick={() => navigate('/balance')}
            className="btn btn-outline"
          >
            <i className="bi bi-bar-chart"></i> Ver Balance Mensual
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Summary */}
        <div className="lg:col-span-1">
          <FinancialSummary monthData={currentMonthData} />
        </div>
        
        {/* Latest Transactions */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-neutral-darkest">
                Últimas Transacciones - {capitalizedMonth}
              </h3>
            </div>
            
            <TransactionList 
              transactions={transactions} 
              showFilters={true}
              limit={5}
              onViewAll={() => navigate('/transacciones')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
