import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import BalanceChart from '../components/BalanceChart';
import AccountsChart from '../components/AccountsChart';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const MonthlyBalance = () => {
  const { 
    currentDate, 
    monthlyData, 
    getCurrentMonthName,
    formatCurrency
  } = useData();
  
  const [activeTab, setActiveTab] = useState('resumen');
  
  const currentMonthKey = format(currentDate, 'yyyy-MM');
  const currentMonthData = monthlyData[currentMonthKey];
  const monthName = getCurrentMonthName();
  
  // Capitalize first letter
  const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  
  const exportToPDF = () => {
    if (!currentMonthData) return;
    
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text(`Balance Mensual - ${capitalizedMonth}`, 14, 22);
    doc.setFontSize(12);
    doc.text('Cooperadora Escolar JI 902', 14, 30);
    
    // Add summary table
    doc.setFontSize(14);
    doc.text('Resumen General', 14, 45);
    
    const summaryData = [
      ['Saldo Inicial', formatCurrency(currentMonthData.saldoInicial)],
      ['Ingresos Totales', formatCurrency(currentMonthData.totalIngresos)],
      ['Egresos Totales', formatCurrency(currentMonthData.totalEgresos)],
      ['Saldo Final', formatCurrency(currentMonthData.saldoFinal)]
    ];
    
    doc.autoTable({
      startY: 50,
      head: [['Concepto', 'Monto']],
      body: summaryData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] }
    });
    
    // Add income categories
    doc.setFontSize(14);
    doc.text('Distribución de Ingresos por Categoría', 14, doc.lastAutoTable.finalY + 15);
    
    const incomeData = currentMonthData.ingresosCategorias.map(cat => [
      cat.name,
      formatCurrency(cat.amount),
      `${cat.percent}%`
    ]);
    
    incomeData.push(['Total Ingresos', formatCurrency(currentMonthData.totalIngresos), '100%']);
    
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 20,
      head: [['Categoría', 'Monto', 'Porcentaje']],
      body: incomeData,
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] }
    });
    
    // Add expense categories
    doc.setFontSize(14);
    doc.text('Distribución de Egresos por Categoría', 14, doc.lastAutoTable.finalY + 15);
    
    const expenseData = currentMonthData.egresosCategorias.map(cat => [
      cat.name,
      formatCurrency(cat.amount),
      `${cat.percent}%`
    ]);
    
    expenseData.push(['Total Egresos', formatCurrency(currentMonthData.totalEgresos), '100%']);
    
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 20,
      head: [['Categoría', 'Monto', 'Porcentaje']],
      body: expenseData,
      theme: 'grid',
      headStyles: { fillColor: [239, 68, 68] }
    });
    
    // Add accounts summary
    doc.setFontSize(14);
    doc.text('Saldos por Cuenta', 14, doc.lastAutoTable.finalY + 15);
    
    const accountsData = currentMonthData.accounts.map(acc => [
      acc.name,
      formatCurrency(acc.saldoInicial),
      formatCurrency(acc.ingresos),
      formatCurrency(acc.egresos),
      formatCurrency(acc.saldoFinal),
      `${acc.percent.toFixed(1)}%`
    ]);
    
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 20,
      head: [['Cuenta', 'Saldo Inicial', 'Ingresos', 'Egresos', 'Saldo Final', 'Porcentaje']],
      body: accountsData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] }
    });
    
    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        `Página ${i} de ${pageCount} - Generado el ${format(new Date(), 'dd/MM/yyyy')}`,
        14,
        doc.internal.pageSize.height - 10
      );
    }
    
    // Save the PDF
    doc.save(`Balance_${currentMonthKey}.pdf`);
  };
  
  if (!currentMonthData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-darkest mb-1">
          Balance Mensual
        </h1>
        <p className="text-neutral-dark">
          Análisis financiero detallado por período
        </p>
      </div>
      
      <div className="card mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-neutral-darkest">
              {capitalizedMonth}
            </h2>
            <p className="text-neutral-dark">
              Balance financiero completo
            </p>
          </div>
          <button 
            onClick={exportToPDF}
            className="btn btn-outline"
          >
            <i className="bi bi-file-earmark-pdf"></i> Exportar Balance
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Saldo Inicial */}
          <div className="p-4 bg-neutral-light rounded-lg">
            <div className="text-sm text-neutral-dark mb-1">Saldo Inicial</div>
            <div className="text-xl font-semibold text-neutral-darkest">
              {formatCurrency(currentMonthData.saldoInicial)}
            </div>
          </div>
          
          {/* Ingresos */}
          <div className="p-4 bg-secondary bg-opacity-10 border border-secondary-light rounded-lg">
            <div className="text-sm text-neutral-dark mb-1">Ingresos Totales</div>
            <div className="text-xl font-semibold text-secondary-dark">
              +{formatCurrency(currentMonthData.totalIngresos)}
            </div>
          </div>
          
          {/* Egresos */}
          <div className="p-4 bg-danger bg-opacity-10 border border-danger-light rounded-lg">
            <div className="text-sm text-neutral-dark mb-1">Egresos Totales</div>
            <div className="text-xl font-semibold text-danger-dark">
              -{formatCurrency(currentMonthData.totalEgresos)}
            </div>
          </div>
          
          {/* Saldo Final */}
          <div className="p-4 bg-primary bg-opacity-10 border border-primary-light rounded-lg">
            <div className="text-sm text-neutral-dark mb-1">Saldo Final</div>
            <div className="text-xl font-semibold text-primary">
              {formatCurrency(currentMonthData.saldoFinal)}
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="card">
        <div className="border-b border-neutral-medium mb-6">
          <nav className="flex space-x-8 -mb-px">
            <button 
              onClick={() => setActiveTab('resumen')}
              className={`tab ${activeTab === 'resumen' ? 'tab-active' : 'tab-inactive'}`}
            >
              Resumen General
            </button>
            <button 
              onClick={() => setActiveTab('ingresos')}
              className={`tab ${activeTab === 'ingresos' ? 'tab-active' : 'tab-inactive'}`}
            >
              Detalle de Ingresos
            </button>
            <button 
              onClick={() => setActiveTab('egresos')}
              className={`tab ${activeTab === 'egresos' ? 'tab-active' : 'tab-inactive'}`}
            >
              Detalle de Egresos
            </button>
            <button 
              onClick={() => setActiveTab('cuentas')}
              className={`tab ${activeTab === 'cuentas' ? 'tab-active' : 'tab-inactive'}`}
            >
              Saldos por Cuenta
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="p-1">
          {/* Resumen General */}
          {activeTab === 'resumen' && (
            <div>
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-neutral-darkest mb-4">
                  Resumen General del Balance
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-neutral-medium">
                    <thead className="bg-neutral-light">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                          Concepto
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-neutral-dark uppercase tracking-wider">
                          Monto
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-neutral-medium">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-darkest">
                          Saldo Inicial
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-neutral-darkest">
                          {formatCurrency(currentMonthData.saldoInicial)}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-darkest">
                          Ingresos Totales
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-secondary-dark">
                          +{formatCurrency(currentMonthData.totalIngresos)}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-darkest">
                          Egresos Totales
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-danger-dark">
                          -{formatCurrency(currentMonthData.totalEgresos)}
                        </td>
                      </tr>
                      <tr className="bg-neutral-lightest">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-neutral-darkest">
                          Saldo Final
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-primary">
                          {formatCurrency(currentMonthData.saldoFinal)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Distribución de Ingresos */}
                <div>
                  <h3 className="text-lg font-semibold text-neutral-darkest mb-4">
                    Distribución de Ingresos por Categoría
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-neutral-medium">
                      <thead className="bg-secondary bg-opacity-10">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                            Categoría
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-neutral-dark uppercase tracking-wider">
                            Monto
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-neutral-medium">
                        {currentMonthData.ingresosCategorias.map((cat, index) => (
                          <tr key={index}>
                            <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-neutral-darkest">
                              {cat.name}
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap text-sm text-right font-medium text-secondary-dark">
                              {formatCurrency(cat.amount)}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-secondary bg-opacity-5">
                          <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-neutral-darkest">
                            Total Ingresos
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap text-sm text-right font-bold text-secondary-dark">
                            {formatCurrency(currentMonthData.totalIngresos)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Distribución de Egresos */}
                <div>
                  <h3 className="text-lg font-semibold text-neutral-darkest mb-4">
                    Distribución de Egresos por Categoría
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-neutral-medium">
                      <thead className="bg-danger bg-opacity-10">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                            Categoría
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-neutral-dark uppercase tracking-wider">
                            Monto
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-neutral-medium">
                        {currentMonthData.egresosCategorias.map((cat, index) => (
                          <tr key={index}>
                            <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-neutral-darkest">
                              {cat.name}
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap text-sm text-right font-medium text-danger-dark">
                              {formatCurrency(cat.amount)}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-danger bg-opacity-5">
                          <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-neutral-darkest">
                            Total Egresos
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap text-sm text-right font-bold text-danger-dark">
                            {formatCurrency(currentMonthData.totalEgresos)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Detalle de Ingresos */}
          {activeTab === 'ingresos' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-neutral-darkest">
                  Detalle de Ingresos por Categoría
                </h3>
                <div className="text-xl font-semibold text-secondary-dark">
                  {formatCurrency(currentMonthData.totalIngresos)}
                </div>
              </div>
              
              <div className="mb-8">
                <h4 className="text-base font-medium text-neutral-darkest mb-4">
                  Distribución por Categoría
                </h4>
                <BalanceChart data={currentMonthData} type="ingresos" />
              </div>
              
              <div className="p-4 bg-secondary bg-opacity-10 rounded-lg">
                <div className="flex items-center">
                  <i className="bi bi-arrow-up-right text-secondary-dark text-xl mr-2"></i>
                  <p className="text-neutral-darkest">
                    Los ingresos del periodo actual muestran un 
                    <span className="font-medium text-secondary-dark"> incremento del {currentMonthData.ingresosChange.toFixed(1)}% </span> 
                    respecto al mes anterior.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Detalle de Egresos */}
          {activeTab === 'egresos' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-neutral-darkest">
                  Detalle de Egresos por Categoría
                </h3>
                <div className="text-xl font-semibold text-danger-dark">
                  {formatCurrency(currentMonthData.totalEgresos)}
                </div>
              </div>
              
              <div className="mb-8">
                <h4 className="text-base font-medium text-neutral-darkest mb-4">
                  Distribución por Categoría
                </h4>
                <BalanceChart data={currentMonthData} type="egresos" />
              </div>
              
              <div className="p-4 bg-danger bg-opacity-10 rounded-lg">
                <div className="flex items-center">
                  <i className="bi bi-arrow-down-right text-danger-dark text-xl mr-2"></i>
                  <p className="text-neutral-darkest">
                    Los egresos del periodo actual muestran una 
                    <span className="font-medium text-danger-dark"> reducción del {Math.abs(currentMonthData.egresosChange).toFixed(1)}% </span> 
                    respecto al mes anterior.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Saldos por Cuenta */}
          {activeTab === 'cuentas' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-neutral-darkest">
                  Saldos por Cuenta
                </h3>
                <div className="text-xl font-semibold text-primary">
                  {formatCurrency(currentMonthData.saldoFinal)}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {currentMonthData.accounts.map((account, index) => (
                  <div key={index} className="card border border-neutral-medium">
                    <h4 className="text-base font-semibold text-neutral-darkest mb-4">
                      {account.name}
                    </h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-neutral-dark">Saldo Inicial:</span>
                        <span className="font-medium">{formatCurrency(account.saldoInicial)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-neutral-dark">Ingresos:</span>
                        <span className="font-medium text-secondary-dark">+{formatCurrency(account.ingresos)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-neutral-dark">Egresos:</span>
                        <span className="font-medium text-danger-dark">-{formatCurrency(account.egresos)}</span>
                      </div>
                      <div className="pt-2 border-t border-neutral-medium flex justify-between items-center">
                        <span className="font-medium text-neutral-darkest">Saldo Final:</span>
                        <span className="font-semibold text-primary">{formatCurrency(account.saldoFinal)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div>
                <h4 className="text-base font-medium text-neutral-darkest mb-4">
                  Distribución de Saldos
                </h4>
                <AccountsChart accounts={currentMonthData.accounts} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthlyBalance;
