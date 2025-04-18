import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simple validation
    if (!formData.email || !formData.password) {
      setError('Por favor complete todos los campos');
      setLoading(false);
      return;
    }
    
    // For demo purposes, accept any login
    // In a real app, this would validate against a backend
    setTimeout(() => {
      const userData = {
        name: 'Tesorero',
        email: formData.email,
        role: 'admin'
      };
      
      login(userData);
      navigate('/');
      setLoading(false);
    }, 1000);
  };
  
  return (
    <div className="card mt-8">
      <h2 className="text-xl font-semibold text-neutral-darkest mb-6">
        Iniciar Sesión
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-danger bg-opacity-10 border border-danger text-danger rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-dark mb-1">
            Correo Electrónico
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input"
            placeholder="correo@ejemplo.com"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-dark mb-1">
            Contraseña
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="input"
            placeholder="••••••••"
          />
        </div>
        
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
              Iniciando sesión...
            </span>
          ) : (
            'Iniciar Sesión'
          )}
        </button>
      </form>
      
      <div className="mt-4 text-center text-sm text-neutral-dark">
        <p>Para fines de demostración, puede ingresar con cualquier correo y contraseña.</p>
      </div>
    </div>
  );
};

export default Login;
