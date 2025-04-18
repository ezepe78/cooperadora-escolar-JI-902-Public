import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import MonthSelector from '../components/MonthSelector';
import TransactionModal from '../components/TransactionModal';

const MainLayout = () => {
  const { logout, user } = useAuth();
  const { getCurrentMonthName } = useData();
  const navigate = useNavigate();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <i className="bi bi-bank text-primary text-2xl mr-2"></i>
              <h1 className="text-xl font-semibold text-neutral-darkest">
                Cooperadora Escolar JI 902
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <MonthSelector />
              
              <button 
                onClick={() => setIsModalOpen(true)}
                className="btn btn-primary"
              >
                <i className="bi bi-plus-circle"></i>
                Nueva Transacción
              </button>
              
              <div className="relative">
                <button className="flex items-center text-neutral-dark hover:text-primary">
                  <span className="mr-2">{user?.name || 'Usuario'}</span>
                  <i className="bi bi-person-circle text-xl"></i>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden">
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-neutral-darkest hover:bg-neutral-light"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex space-x-8 -mb-px">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `tab ${isActive ? 'tab-active' : 'tab-inactive'}`
              }
              end
            >
              <i className="bi bi-house mr-1"></i> Inicio
            </NavLink>
            <NavLink 
              to="/transacciones" 
              className={({ isActive }) => 
                `tab ${isActive ? 'tab-active' : 'tab-inactive'}`
              }
            >
              <i className="bi bi-arrow-left-right mr-1"></i> Transacciones
            </NavLink>
            <NavLink 
              to="/balance" 
              className={({ isActive }) => 
                `tab ${isActive ? 'tab-active' : 'tab-inactive'}`
              }
            >
              <i className="bi bi-bar-chart mr-1"></i> Balance
            </NavLink>
            <NavLink 
              to="/categorias" 
              className={({ isActive }) => 
                `tab ${isActive ? 'tab-active' : 'tab-inactive'}`
              }
            >
              <i className="bi bi-tags mr-1"></i> Categorías
            </NavLink>
          </nav>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow bg-neutral-lightest">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-neutral-medium py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <p className="text-sm text-neutral-dark">
              © {new Date().getFullYear()} Cooperadora Escolar JI 902
            </p>
            <p className="text-sm text-neutral-dark">
              Diseñado por WebSparks AI
            </p>
          </div>
        </div>
      </footer>
      
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

export default MainLayout;
