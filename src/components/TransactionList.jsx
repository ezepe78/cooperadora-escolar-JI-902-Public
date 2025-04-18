import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const TransactionList = ({ transactions, showFilters = false, limit = null, onViewAll = null }) => {
  const { formatCurrency, deleteTransaction } = useData();
  
  const [filters, setFilters] = useState({
    type: 'all',
    account: 'all',
    search: ''
  });
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const filteredTransactions = transactions.filter(transaction => {
    // Filter by type
    if (filters.type !== 'all' && transaction.type !== filters.type) {
      return false;
    }
    
    // Filter by account
    if (filters.account !== 'all' && transaction.accountId !== filters.account) {
      return false;
    }
    
    // Filter by search term
    if (filters.search && !transaction.category.toLowerCase().includes(filters.search.toLowerCase()) &&
        !transaction.details?.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  const displayTransactions = limit 
    ? filteredTransactions.slice(0, limit) 
    : filteredTransactions;
  
  const handleDelete = (id) => {
    if (window.confirm('¿Está seguro que desea eliminar esta transacción?')) {
      deleteTransaction(id);
    }
  };
  
  return (
    <div>
      {showFilters && (
        <div className="mb-4 flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="select"
            >
              <option value="all">Todos los tipos</option>
              <option value="ingreso">Ingresos</option>
              <option value="egreso">Egresos</option>
            </select>
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <select
              name="account"
              value={filters.account}
              onChange={handleFilterChange}
              className="select"
            >
              <option value="all">Todas las cuentas</option>
              <option value="acc1">Caja Chica</option>
              <option value="acc2">Banco Provincia</option>
            </select>
          </div>
          
          <div className="flex-1 min-w-[200px]">
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
                placeholder="Buscar categoría..."
              />
            </div>
          </div>
          
          <button className="btn btn-outline">
            <i className="bi bi-funnel"></i> Filtrar
          </button>
        </div>
      )}
      
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Categoría</th>
              <th>Monto</th>
              <th>Tipo</th>
              <th>Cuenta</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {displayTransactions.length > 0 ? (
              displayTransactions.map(transaction => (
                <tr key={transaction.id}>
                  <td>
                    {format(parseISO(transaction.date), 'dd/MM/yyyy', { locale: es })}
                  </td>
                  <td>
                    <div className="font-medium">{transaction.category}</div>
                    {transaction.details && (
                      <div className="text-xs text-neutral-dark truncate max-w-[200px]">
                        {transaction.details}
                      </div>
                    )}
                  </td>
                  <td className={transaction.type === 'ingreso' ? 'positive-amount' : 'negative-amount'}>
                    {transaction.type === 'ingreso' ? '+' : '-'} {formatCurrency(transaction.amount / 100)}
                  </td>
                  <td>
                    <span className={`badge ${transaction.type === 'ingreso' ? 'badge-success' : 'badge-danger'}`}>
                      {transaction.type === 'ingreso' ? 'Ingreso' : 'Egreso'}
                    </span>
                  </td>
                  <td>{transaction.account}</td>
                  <td>
                    <div className="flex space-x-2">
                      <button 
                        className="text-neutral-dark hover:text-primary"
                        aria-label="Editar"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button 
                        onClick={() => handleDelete(transaction.id)}
                        className="text-neutral-dark hover:text-danger"
                        aria-label="Eliminar"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-neutral-dark">
                  No hay transacciones que coincidan con los filtros aplicados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {limit && filteredTransactions.length > limit && onViewAll && (
        <div className="mt-4 text-right">
          <button 
            onClick={onViewAll}
            className="text-primary hover:text-primary-dark font-medium"
          >
            Ver todas <i className="bi bi-arrow-right"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
