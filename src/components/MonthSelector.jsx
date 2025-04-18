import React from 'react';
import { format, subMonths, addMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { useData } from '../contexts/DataContext';

const MonthSelector = () => {
  const { currentDate, changeMonth } = useData();
  
  const formattedMonth = format(currentDate, 'MMMM yyyy', { locale: es });
  const capitalizedMonth = formattedMonth.charAt(0).toUpperCase() + formattedMonth.slice(1);
  
  return (
    <div className="flex items-center bg-neutral-light rounded-md">
      <button 
        onClick={() => changeMonth('prev')}
        className="p-2 text-neutral-dark hover:text-primary"
        aria-label="Mes anterior"
      >
        <i className="bi bi-chevron-left"></i>
      </button>
      
      <span className="px-2 py-1 font-medium text-neutral-darkest">
        {capitalizedMonth}
      </span>
      
      <button 
        onClick={() => changeMonth('next')}
        className="p-2 text-neutral-dark hover:text-primary"
        aria-label="Mes siguiente"
      >
        <i className="bi bi-chevron-right"></i>
      </button>
    </div>
  );
};

export default MonthSelector;
