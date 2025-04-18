import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker, { registerLocale } from 'react-datepicker';
import { es } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import { useData } from '../contexts/DataContext';

// Register Spanish locale
registerLocale('es', es);

const TransactionModal = ({ isOpen, onClose, editTransaction = null }) => {
  const navigate = useNavigate();
  const { 
    categories, 
    accounts, 
    addTransaction,
    formatCurrency
  } = useData();
  
  const [formData, setFormData] = useState({
    type: editTransaction?.type || 'ingreso',
    date: editTransaction?.date ? new Date(editTransaction.date) : new Date(),
    categoryId: editTransaction?.categoryId || '',
    amount: editTransaction?.amount ? (editTransaction.amount / 100).toString() : '',
    accountId: editTransaction?.accountId || '',
    details: editTransaction?.details || ''
  });
  
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, date }));
    if (errors.date) {
      setErrors(prev => ({ ...prev, date: '' }));
    }
  };
  
  const handleTypeChange = (type) => {
    setFormData(prev => ({ 
      ...prev, 
      type,
      categoryId: '' // Reset category when type changes
    }));
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'Seleccione una categoría';
    }
    
    if (!formData.amount || isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Ingrese un monto válido';
    }
    
    if (!formData.accountId) {
      newErrors.accountId = 'Seleccione una cuenta';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Find category and account names
    const category = categories.find(c => c.id === formData.categoryId);
    const account = accounts.find(a => a.id === formData.accountId);
    
    const newTransaction = {
      id: editTransaction?.id || Math.random().toString(36).substr(2, 9),
      date: formData.date.toISOString().split('T')[0],
      categoryId: formData.categoryId,
      category: category.name,
      amount: parseFloat(formData.amount) * 100, // Store as cents
      type: formData.type,
      accountId: formData.accountId,
      account: account.name,
      details: formData.details
    };
    
    addTransaction(newTransaction);
    onClose();
  };
  
  const handleGoToCategories = () => {
    onClose();
    navigate('/categorias');
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-neutral-darkest bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b border-neutral-medium">
          <h2 className="text-xl font-semibold text-neutral-darkest">
            {editTransaction ? 'Editar Transacción' : 'Nueva Transacción'}
          </h2>
          <button 
            onClick={onClose}
            className="text-neutral-dark hover:text-danger"
            aria-label="Cerrar"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {/* Transaction Type */}
          <div className="mb-6">
            <div className="flex rounded-md shadow-sm">
              <button
                type="button"
                className={`flex-1 py-2 px-4 text-center font-medium rounded-l-md ${
                  formData.type === 'ingreso' 
                    ? 'bg-secondary text-white' 
                    : 'bg-neutral-light text-neutral-dark hover:bg-neutral-medium'
                }`}
                onClick={() => handleTypeChange('ingreso')}
              >
                <i className="bi bi-arrow-down-circle mr-1"></i> Ingreso
              </button>
              <button
                type="button"
                className={`flex-1 py-2 px-4 text-center font-medium rounded-r-md ${
                  formData.type === 'egreso' 
                    ? 'bg-danger text-white' 
                    : 'bg-neutral-light text-neutral-dark hover:bg-neutral-medium'
                }`}
                onClick={() => handleTypeChange('egreso')}
              >
                <i className="bi bi-arrow-up-circle mr-1"></i> Egreso
              </button>
            </div>
          </div>
          
          {/* Date */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-dark mb-1">
              Fecha
            </label>
            <DatePicker
              selected={formData.date}
              onChange={handleDateChange}
              className="input"
              dateFormat="dd/MM/yyyy"
              locale="es"
            />
            {errors.date && (
              <p className="mt-1 text-sm text-danger">{errors.date}</p>
            )}
          </div>
          
          {/* Category */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-neutral-dark">
                Categoría
              </label>
              <button
                type="button"
                onClick={handleGoToCategories}
                className="text-xs text-primary hover:text-primary-dark"
              >
                Gestionar categorías
              </button>
            </div>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="select"
            >
              <option value="">Seleccione una categoría</option>
              {categories
                .filter(cat => cat.type === formData.type)
                .map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))
              }
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-sm text-danger">{errors.categoryId}</p>
            )}
          </div>
          
          {/* Amount */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-dark mb-1">
              Monto
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-neutral-dark">$</span>
              </div>
              <input
                type="text"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="input pl-7"
                placeholder="0,00"
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-danger">{errors.amount}</p>
            )}
          </div>
          
          {/* Account */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-dark mb-1">
              Cuenta
            </label>
            <select
              name="accountId"
              value={formData.accountId}
              onChange={handleChange}
              className="select"
            >
              <option value="">Seleccione una cuenta</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
            {errors.accountId && (
              <p className="mt-1 text-sm text-danger">{errors.accountId}</p>
            )}
          </div>
          
          {/* Details */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-dark mb-1">
              Detalle (opcional)
            </label>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleChange}
              className="input"
              rows="3"
              placeholder="Agregar detalles adicionales..."
            ></textarea>
          </div>
          
          {/* Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`btn ${formData.type === 'ingreso' ? 'btn-secondary' : 'btn-danger'}`}
            >
              {editTransaction ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
