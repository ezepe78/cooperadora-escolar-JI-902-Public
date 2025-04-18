import React, { createContext, useContext, useState, useEffect } from 'react';
import { format, parseISO, startOfMonth, endOfMonth, subMonths, addMonths } from 'date-fns';
import { es } from 'date-fns/locale';

// Mock data
import { 
  mockTransactions, 
  mockCategories, 
  mockAccounts,
  generateMockMonthlyData
} from '../data/mockData';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  // Current selected month/year
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Data states
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [monthlyData, setMonthlyData] = useState({});

  // Load initial data
  useEffect(() => {
    // In a real app, this would fetch from an API
    setTransactions(mockTransactions);
    setCategories(mockCategories);
    setAccounts(mockAccounts);
    
    // Generate monthly data for current and previous month
    const currentMonthData = generateMockMonthlyData(currentDate);
    const previousMonthData = generateMockMonthlyData(subMonths(currentDate, 1));
    
    setMonthlyData({
      [format(currentDate, 'yyyy-MM')]: currentMonthData,
      [format(subMonths(currentDate, 1), 'yyyy-MM')]: previousMonthData
    });
  }, []);

  // Filter transactions for current month
  const getCurrentMonthTransactions = () => {
    const startDate = startOfMonth(currentDate);
    const endDate = endOfMonth(currentDate);
    
    return transactions.filter(transaction => {
      const transactionDate = parseISO(transaction.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  };

  // Get formatted month name
  const getCurrentMonthName = () => {
    return format(currentDate, 'MMMM yyyy', { locale: es });
  };

  // Change month
  const changeMonth = (direction) => {
    const newDate = direction === 'next' 
      ? addMonths(currentDate, 1) 
      : subMonths(currentDate, 1);
    
    setCurrentDate(newDate);
    
    // Generate data for the new month if it doesn't exist
    const newMonthKey = format(newDate, 'yyyy-MM');
    if (!monthlyData[newMonthKey]) {
      setMonthlyData(prev => ({
        ...prev,
        [newMonthKey]: generateMockMonthlyData(newDate)
      }));
    }
  };

  // Add new transaction
  const addTransaction = (newTransaction) => {
    setTransactions(prev => [newTransaction, ...prev]);
    
    // Update monthly data
    const monthKey = format(parseISO(newTransaction.date), 'yyyy-MM');
    const updatedMonthlyData = { ...monthlyData };
    
    if (!updatedMonthlyData[monthKey]) {
      updatedMonthlyData[monthKey] = generateMockMonthlyData(parseISO(newTransaction.date));
    }
    
    // Update the appropriate totals
    if (newTransaction.type === 'ingreso') {
      updatedMonthlyData[monthKey].totalIngresos += parseFloat(newTransaction.amount);
    } else {
      updatedMonthlyData[monthKey].totalEgresos += parseFloat(newTransaction.amount);
    }
    
    // Update account balance
    const accountIndex = updatedMonthlyData[monthKey].accounts.findIndex(
      acc => acc.id === newTransaction.accountId
    );
    
    if (accountIndex !== -1) {
      if (newTransaction.type === 'ingreso') {
        updatedMonthlyData[monthKey].accounts[accountIndex].ingresos += parseFloat(newTransaction.amount);
      } else {
        updatedMonthlyData[monthKey].accounts[accountIndex].egresos += parseFloat(newTransaction.amount);
      }
      
      // Recalculate final balance
      updatedMonthlyData[monthKey].accounts[accountIndex].saldoFinal = 
        updatedMonthlyData[monthKey].accounts[accountIndex].saldoInicial + 
        updatedMonthlyData[monthKey].accounts[accountIndex].ingresos - 
        updatedMonthlyData[monthKey].accounts[accountIndex].egresos;
    }
    
    // Update total final balance
    updatedMonthlyData[monthKey].saldoFinal = 
      updatedMonthlyData[monthKey].saldoInicial + 
      updatedMonthlyData[monthKey].totalIngresos - 
      updatedMonthlyData[monthKey].totalEgresos;
    
    setMonthlyData(updatedMonthlyData);
  };

  // Add new category
  const addCategory = (newCategory) => {
    setCategories(prev => [...prev, newCategory]);
  };

  // Delete transaction
  const deleteTransaction = (id) => {
    const transactionToDelete = transactions.find(t => t.id === id);
    if (!transactionToDelete) return;
    
    setTransactions(prev => prev.filter(t => t.id !== id));
    
    // Update monthly data
    const monthKey = format(parseISO(transactionToDelete.date), 'yyyy-MM');
    const updatedMonthlyData = { ...monthlyData };
    
    if (updatedMonthlyData[monthKey]) {
      // Update the appropriate totals
      if (transactionToDelete.type === 'ingreso') {
        updatedMonthlyData[monthKey].totalIngresos -= parseFloat(transactionToDelete.amount);
      } else {
        updatedMonthlyData[monthKey].totalEgresos -= parseFloat(transactionToDelete.amount);
      }
      
      // Update account balance
      const accountIndex = updatedMonthlyData[monthKey].accounts.findIndex(
        acc => acc.id === transactionToDelete.accountId
      );
      
      if (accountIndex !== -1) {
        if (transactionToDelete.type === 'ingreso') {
          updatedMonthlyData[monthKey].accounts[accountIndex].ingresos -= parseFloat(transactionToDelete.amount);
        } else {
          updatedMonthlyData[monthKey].accounts[accountIndex].egresos -= parseFloat(transactionToDelete.amount);
        }
        
        // Recalculate final balance
        updatedMonthlyData[monthKey].accounts[accountIndex].saldoFinal = 
          updatedMonthlyData[monthKey].accounts[accountIndex].saldoInicial + 
          updatedMonthlyData[monthKey].accounts[accountIndex].ingresos - 
          updatedMonthlyData[monthKey].accounts[accountIndex].egresos;
      }
      
      // Update total final balance
      updatedMonthlyData[monthKey].saldoFinal = 
        updatedMonthlyData[monthKey].saldoInicial + 
        updatedMonthlyData[monthKey].totalIngresos - 
        updatedMonthlyData[monthKey].totalEgresos;
      
      setMonthlyData(updatedMonthlyData);
    }
  };

  // Delete category
  const deleteCategory = (id) => {
    // Check if category is in use
    const isInUse = transactions.some(t => t.categoryId === id);
    if (isInUse) {
      return { success: false, message: 'No se puede eliminar una categoría que está en uso' };
    }
    
    setCategories(prev => prev.filter(c => c.id !== id));
    return { success: true };
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const value = {
    currentDate,
    setCurrentDate,
    transactions,
    categories,
    accounts,
    monthlyData,
    getCurrentMonthTransactions,
    getCurrentMonthName,
    changeMonth,
    addTransaction,
    addCategory,
    deleteTransaction,
    deleteCategory,
    formatCurrency
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
