import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';

const FinancialSummary = ({ monthData }) => {
  const navigate = useNavigate();
  const { formatCurrency } = useData();
  
  if (!monthData) {
    return (
      <div className="card animate-pulse">
        <div className="h-6 bg-neutral-medium rounded w-1/3 mb-4"></div>
        <div className="space-y-4">
          <div className="h-12 bg-neutral-medium rounded"></div>
          <div className="h-12 bg-neutral-medium rounded"></div>
          <div className="h-12 bg-neutral-medium rounded"></div>
          <div className="h-12 bg-neutral-medium rounded"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-neutral-darkest mb-4">
        Resumen Financiero
      </h3>
      
      <div className="space-y-4">
        {/* Saldo Inicial */}
        <div className="p-3 bg-neutral-light rounded-md">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium text-neutral-darkest">Saldo Inicial</h4>
              <div className="text-sm text-neutral-dark">
                <span className="mr-2">Caja Chica: {formatCurrency(monthData.accounts[0].saldoInicial)}</span>
                <span>Banco: {formatCurrency(monthData.accounts[1].saldoInicial)}</span>
              </div>
            </div>
            <div className="text-xl font-semibold text-neutral-darkest">
              {formatCurrency(monthData.saldoInicial)}
            </div>
          </div>
        </div>
        
        {/* Ingresos */}
        <div className="p-3 bg-neutral-lightest border border-secondary-light rounded-md">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium text-neutral-darkest">Ingresos Totales</h4>
              <div className="flex items-center text-sm text-secondary-dark">
                <i className="bi bi-arrow-up-right mr-1"></i>
                <span>+{monthData.ingresosChange.toFixed(1)}% respecto al mes anterior</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="text-xl font-semibold text-secondary-dark mr-3">
                +{formatCurrency(monthData.totalIngresos)}
              </div>
              <button 
                onClick={() => navigate('/balance')}
                className="text-primary hover:text-primary-dark text-sm"
              >
                Ver detalles <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
        
        {/* Egresos */}
        <div className="p-3 bg-neutral-lightest border border-danger-light rounded-md">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium text-neutral-darkest">Egresos Totales</h4>
              <div className="flex items-center text-sm text-danger-dark">
                <i className="bi bi-arrow-down-right mr-1"></i>
                <span>{monthData.egresosChange.toFixed(1)}% respecto al mes anterior</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="text-xl font-semibold text-danger-dark mr-3">
                -{formatCurrency(monthData.totalEgresos)}
              </div>
              <button 
                onClick={() => navigate('/balance')}
                className="text-primary hover:text-primary-dark text-sm"
              >
                Ver detalles <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
        
        {/* Saldo Final */}
        <div className="p-3 bg-primary bg-opacity-5 border border-primary-light rounded-md">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium text-neutral-darkest">Saldo Final</h4>
              <div className="text-sm text-neutral-dark">
                <span className="mr-2">Caja Chica: {formatCurrency(monthData.accounts[0].saldoFinal)}</span>
                <span>Banco: {formatCurrency(monthData.accounts[1].saldoFinal)}</span>
              </div>
            </div>
            <div className="text-xl font-semibold text-primary">
              {formatCurrency(monthData.saldoFinal)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialSummary;
