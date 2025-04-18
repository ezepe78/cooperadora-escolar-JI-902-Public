import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import CategoryForm from '../components/CategoryForm';

const Categories = () => {
  const { categories, deleteCategory } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [error, setError] = useState('');
  
  const ingresoCategories = categories.filter(cat => cat.type === 'ingreso');
  const egresoCategories = categories.filter(cat => cat.type === 'egreso');
  
  const handleNewCategory = () => {
    setEditCategory(null);
    setShowForm(true);
    setError('');
  };
  
  const handleEditCategory = (category) => {
    setEditCategory(category);
    setShowForm(true);
    setError('');
  };
  
  const handleDeleteCategory = (id) => {
    if (window.confirm('¿Está seguro que desea eliminar esta categoría?')) {
      const result = deleteCategory(id);
      if (!result.success) {
        setError(result.message);
      }
    }
  };
  
  const renderCategoryList = (categoryList, type) => {
    return (
      <div className="space-y-4">
        {categoryList.length > 0 ? (
          categoryList.map(category => (
            <div 
              key={category.id} 
              className="p-4 bg-white border border-neutral-medium rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-neutral-darkest">
                    {category.name}
                  </h4>
                  {category.description && (
                    <p className="text-sm text-neutral-dark mt-1">
                      {category.description}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEditCategory(category)}
                    className="text-neutral-dark hover:text-primary"
                    aria-label="Editar"
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button 
                    onClick={() => handleDeleteCategory(category.id)}
                    className="text-neutral-dark hover:text-danger"
                    aria-label="Eliminar"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 bg-neutral-light rounded-lg text-center text-neutral-dark">
            No hay categorías de {type} definidas
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-darkest mb-1">
          Gestión de Categorías
        </h1>
        <p className="text-neutral-dark">
          Administre las categorías para clasificar ingresos y egresos
        </p>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-danger bg-opacity-10 border border-danger text-danger rounded-lg">
          {error}
        </div>
      )}
      
      <div className="flex justify-end mb-6">
        <button 
          onClick={handleNewCategory}
          className="btn btn-primary"
        >
          <i className="bi bi-plus-circle"></i> Nueva Categoría
        </button>
      </div>
      
      {showForm ? (
        <div className="mb-6">
          <CategoryForm 
            onClose={() => setShowForm(false)} 
            editCategory={editCategory}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Categorías de Ingresos */}
          <div className="card">
            <h2 className="text-lg font-semibold text-neutral-darkest mb-4">
              <span className="text-secondary-dark mr-2">
                <i className="bi bi-arrow-down-circle"></i>
              </span>
              Categorías de Ingresos
            </h2>
            {renderCategoryList(ingresoCategories, 'ingresos')}
          </div>
          
          {/* Categorías de Egresos */}
          <div className="card">
            <h2 className="text-lg font-semibold text-neutral-darkest mb-4">
              <span className="text-danger-dark mr-2">
                <i className="bi bi-arrow-up-circle"></i>
              </span>
              Categorías de Egresos
            </h2>
            {renderCategoryList(egresoCategories, 'egresos')}
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
