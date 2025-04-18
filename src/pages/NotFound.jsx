import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-neutral-lightest py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <i className="bi bi-exclamation-triangle text-primary text-6xl mb-4"></i>
        <h1 className="text-4xl font-bold text-neutral-darkest mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-neutral-darkest mb-4">
          Página no encontrada
        </h2>
        <p className="text-neutral-dark mb-8">
          La página que está buscando no existe o ha sido movida.
        </p>
        <Link 
          to="/"
          className="btn btn-primary inline-flex"
        >
          <i className="bi bi-house mr-2"></i> Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
