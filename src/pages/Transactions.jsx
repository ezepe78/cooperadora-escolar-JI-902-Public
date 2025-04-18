import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import TransactionList from '../components/TransactionList';
import TransactionModal from '../components/TransactionModal';
import DatePicker, { registerLocale } from 'react-datepicker';
import { es } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parseISO, startOfDay, endOfDay } from 'date-fns';
import * as XLSX from 'xlsx';

// Register Spanish locale
registerLocale('es', es);

const Transactions = () => {
  const { 
    transactions, 
    categories, 
    accounts, 
    getCurrentMonthName 
  } = useData();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    accountId: 'all',
    categoryId: 'all',
    startDate: null,
    endDate: null,
    search: ''
  });
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setFilters(prev => ({
      ...prev,
      startDate: start,
      endDate: end
    }));
  };
  
  const filteredTransactions = transactions.filter(transaction => {
    // Filter by type
    if (filters.type !== 'all' && transaction.type !== filters.type) {
      return false;
    }
    
    // Filter by account
    if (filters.accountId !== 'all' && transaction.accountId !== filters.accountId) {
      return false;
    }
    
    // Filter by category
    if (filters.categoryId !== 'all' && transaction.categoryId !== filters.categoryId) {
      return false;
    }
    
    // Filter by date range
    if (filters.startDate && filters.endDate) {
      const transactionDate = parseISO(transaction.date);
      if (
        transactionDate < startOfDay(filters.startDate) || 
        transactionDate > endOfDay(filters.endDate)
      ) {
        return false;
      }
    }
    
    // Filter by search term
    if (filters.search && !transaction.category.toLowerCase().includes(filters.search.toLowerCase()) &&
        !transaction.details?.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  const exportToExcel = () => {
    // Prepare data for export
    const dataToExport = filteredTransactions.map(t => ({
      Fecha: format(parseISO(t.date), 'dd/MM/yyyy'),
      Categoría: t.category,
      Monto: t.type === 'ingreso' ? t.amount / 100 : -t.amount / 100,
      Tipo: t.type === 'ingreso' ? 'Ingreso' : 'Egreso',
      Cuenta: t.account,
      Detalles: t.details || ''
    }));
    
    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transacciones');
    
    // Generate file name
    const fileName = `Transacciones_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
    
    // Export
    XLSX.writeFile(wb, fileName);
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-darkest mb-1">
          Transacciones
        </h1>
        <p className="text-neutral-dark">
          Gestione todas las transacciones de ingresos y egresos
        </p>
      </div>
      
      <div className="card mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-neutral-darkest">
            Filtros de Búsqueda
          </h2>
          <div className="flex space-x-3">
            <button 
              onClick={exportToExcel}
              className="btn btn-outline"
            >
              <i className="bi bi-file-earmark-excel"></i> Exportar
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="btn btn-primary"
            >
              <i className="bi bi-plus-circle"></i> Nueva Transacción
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-1">
              Tipo
            </label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="select"
            >
              <option value="all">Todos los tipos</option>
              <option value="ingreso">Ingreso</option>
              <option value="egreso">Egreso</option>
            </select>
          </div>
          
          {/* Account Filter */}
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-1">
              Cuenta
            </label>
            <select
              name="accountId"
              value={filters.accountId}
              onChange={handleFilterChange}
              className="select"
            >
              <option value="all">Todas las cuentas</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-1">
              Categoría
            </label>
            <select
              name="categoryId"
              value={filters.categoryId}
              onChange={handleFilterChange}
              className="select"
            >
              <option value="all">Todas las categorías</option>
              {categories
                .filter(cat => filters.type === 'all' || cat.type === filters.type)
                .map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))
              }
            </select>
          </div>
          
          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-1">
              Rango de Fechas
            </label>
            <DatePicker
              selected={filters.startDate}
              onChange={handleDateChange}
              startDate={filters.startDate}
              endDate={filters.endDate}
              selectsRange
              className="input"
              dateFormat="dd/MM/yyyy"
              locale="es"
              placeholderText="Seleccione rango de fechas"
              isClearable
            />
          </div>
          
          {/* Search Filter */}
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-1">
              Búsqueda
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="bi bi-search text-neutral-dark"></i>
              </div>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                className="input pl-10"
                placeholder="Buscar por categoría o detalle..."
              />
            </div>
          </div>
          
          {/* Apply Filters Button */}
          <div className="flex items-end">
            <button className="btn btn-outline w-full">
              <i className="bi bi-funnel"></i> Aplicar Filtros
            </button>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-neutral-darkest">
            Listado de Transacciones
          </h2>
          <div className="text-sm text-neutral-dark">
            {filteredTransactions.length} transacciones encontradas
          </div>
        </div>
        
        <TransactionList transactions={filteredTransactions} />
      </div>
      
      {/* Transaction Modal */}
      {isModalOpen && (
        <TransactionModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default Transactions;
