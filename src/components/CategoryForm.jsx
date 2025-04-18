import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';

const CategoryForm = ({ onClose, editCategory = null }) => {
  const { addCategory } = useData();
  
  const [formData, setFormData] = useState({
    name: editCategory?.name || '',
    description: editCategory?.description || '',
    type: editCategory?.type || 'ingreso'
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
  
  const handleTypeChange = (type) => {
    setFormData(prev => ({ ...prev, type }));
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const newCategory = {
      id: editCategory?.id || Math.random().toString(36).substr(2, 9),
      name: formData.name.trim(),
      description: formData.description.trim(),
      type: formData.type
    };
    
    addCategory(newCategory);
    onClose();
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-neutral-darkest">
          {editCategory ? 'Editar Categoría' : 'Nueva Categoría'}
        </h3>
        <button 
          onClick={onClose}
          className="text-neutral-dark hover:text-danger"
          aria-label="Cerrar"
        >
          <i className="bi bi-x-lg"></i>
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Category Type */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-dark mb-1">
            Tipo de Categoría
          </label>
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
        
        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-dark mb-1">
            Nombre
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input"
            placeholder="Nombre de la categoría"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-danger">{errors.name}</p>
          )}
        </div>
        
        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-dark mb-1">
            Descripción
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input"
            rows="3"
            placeholder="Descripción de la categoría (opcional)"
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
            {editCategory ? 'Actualizar' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
