import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-neutral-lightest py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <i className="bi bi-bank text-primary text-4xl"></i>
          <h2 className="mt-6 text-3xl font-extrabold text-neutral-darkest">
            Cooperadora Escolar JI 902
          </h2>
          <p className="mt-2 text-sm text-neutral-dark">
            Sistema de Gestión Financiera
          </p>
        </div>
        
        <Outlet />
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-neutral-dark">
          Diseñado por WebSparks AI
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
