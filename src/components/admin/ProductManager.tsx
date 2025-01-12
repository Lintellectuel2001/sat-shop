import React from 'react';
import ProductHeader from './products/ProductHeader';
import ProductGrid from './products/ProductGrid';
import { useProductManager } from './products/useProductManager';
import { useProducts } from '@/hooks/useProducts';

const ProductManager = () => {
  const { products, invalidateProducts } = useProducts();
  const {
    newProduct,
    setNewProduct,
    isDialogOpen,
    setIsDialogOpen,
    handleProductCreate,
    handleProductUpdate,
    handleProductDelete,
  } = useProductManager(invalidateProducts);

  const handleCreateSuccess = async () => {
    await handleProductCreate();
  };

  return (
    <div className="space-y-6">
      <ProductHeader
        productsCount={products.length}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        newProduct={newProduct}
        onProductChange={(field, value) => 
          setNewProduct({ ...newProduct, [field]: value })
        }
        onSubmit={handleCreateSuccess}
      />
      <ProductGrid
        products={products}
        onEdit={handleProductUpdate}
        onDelete={handleProductDelete}
      />
    </div>
  );
};

export default ProductManager;